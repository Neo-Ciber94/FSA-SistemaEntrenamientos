import {
  AssessmentAnswerDTO,
  AssessmentAnswerNew,
  AssessmentDTO,
  AssessmentNew,
  AssessmentQuestions,
  ClassTaskDTO,
  TaskType,
} from '../types';
import {
  Body,
  BodyParam,
  Delete,
  Get,
  JsonController,
  OnUndefined,
  Param,
  Post,
  Put,
  QueryParam,
  Res,
} from 'routing-controllers';
import {
  Assessment,
  AssessmentAnswers,
  ClassTask,
  Course,
  CourseClass,
  CourseStudent,
} from '../entities';
import { Response } from 'express';
import { getManager } from 'typeorm';

@JsonController('/courses/:courseId/classes/:classId/assessments')
export class ClassAssessmentController {
  @Get()
  @OnUndefined(200)
  async getAllAssessments(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number,
    @QueryParam('title') assessmentTitle?: string
  ) {
    const course = await Course.findOne(courseId);
    const courseClass = await CourseClass.findOne(classId);

    if (course && courseClass && course.id === courseClass.courseId) {
      let result: Assessment | Assessment[] | undefined;

      if (assessmentTitle) {
        result = await Assessment.findOne({
          where: {
            title: assessmentTitle,
            courseClassId: classId,
          },
        });
      } else {
        result = await Assessment.find({
          where: {
            courseClassId: courseClass.id,
          },
          relations: ['coursesClass', 'classTask', 'courseClass.course'],
        });
      }

      if (result == null) {
        return undefined;
      }

      return mapAssessmentToDTO(result as any);
    }
  }

  @Get('/:assessmentId')
  async getAssessmentById(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number,
    @Param('assessmentId') assessmentId: number
  ) {
    const course = await Course.findOne(courseId);
    const courseClass = await CourseClass.findOne(classId);

    if (course && courseClass && course.id === courseClass.courseId) {
      const result = await Assessment.findOne(assessmentId, {
        relations: ['courseClass', 'classTask', 'courseClass.course'],
      });
      if (result) {
        return mapAssessmentToDTO(result);
      }
    }
  }

  @Post()
  async createAssessment(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number,
    @Body() assessmentDTO: AssessmentNew
  ) {
    const course = await Course.findOne(courseId);
    const courseClass = await CourseClass.findOne(classId);

    if (course && courseClass && course.id === courseClass.courseId) {
      const assessmentQuestion = new AssessmentQuestions(
        assessmentDTO.questions
      );

      const newAssessment = Assessment.create({
        title: assessmentDTO.title,
        questionsJson: assessmentQuestion.toJson(),
        courseClass,
      });

      const result = await getManager().transaction(async (manager) => {
        const order = await ClassTask.nextOrder(classId);
        const newTask = ClassTask.create({
          taskType: TaskType.Assessment,
          courseClass,
          order,
        });

        newAssessment.classTask = newTask;

        await manager.save(ClassTask, newTask);
        return manager.save(Assessment, newAssessment);
      });

      return mapAssessmentToDTO(result);
    }
  }

  @Put()
  async updateAssessment(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number,
    @Body() assessmentDTO: AssessmentNew
  ) {
    const course = await Course.findOne(courseId);
    const courseClass = await CourseClass.findOne(classId);
    const assessment = await Assessment.findOne(assessmentDTO.id);

    if (
      course &&
      courseClass &&
      assessment &&
      course.id === courseClass.courseId &&
      assessment.courseClassId === courseClass.id
    ) {
      const assessmentQuestion = new AssessmentQuestions(
        assessmentDTO.questions
      );

      const newAssessment = Assessment.create({
        ...assessment,
        title: assessmentDTO.title,
        questionsJson: assessmentQuestion.toJson(),
      });

      const result = await Assessment.save(newAssessment);
      return mapAssessmentToDTO(result);
    }
  }

  @Delete('/:assessmentId')
  async deleteAssessment(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number,
    @Param('assessmentId') assessmentId: number
  ) {
    const course = await Course.findOne(courseId);
    const courseClass = await CourseClass.findOne(classId);
    const assessment = await Assessment.findOne(assessmentId);

    if (
      course &&
      courseClass &&
      assessment &&
      course.id === courseClass.courseId &&
      assessment.courseClassId === courseClass.id
    ) {
      await ClassTask.delete(assessment.classTaskId);
      return Assessment.remove(assessment);
    }
  }

  @Get('/:assessmentId/responses')
  @OnUndefined(200)
  async getAssessmentAnswer(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number,
    @Param('assessmentId') assessmentId: number,
    @QueryParam('student') studentId: number
  ) {
    const course = await Course.findOne(courseId);
    const courseClass = await CourseClass.findOne(classId);
    const assessment = await Assessment.findOne(assessmentId);
    const answer = await AssessmentAnswers.findOne({
      where: { studentId, assessmentId },
    });

    if (
      course &&
      courseClass &&
      assessment &&
      answer &&
      course.id === courseClass.courseId &&
      assessment.courseClassId === courseClass.id &&
      assessment.id === answer.assessmentId
    ) {
      const assessmentQuestions = new AssessmentQuestions(
        answer.questionsAnswerJson
      );

      // SAFETY: `AssessmentAnswer` have the same layout as `AssessmentAnswerDTO` except for `questionsAnswer`
      const result = (answer as unknown) as AssessmentAnswerDTO;
      result.questionsAnswer = assessmentQuestions.questions;

      // We assume already have calification
      return result;
    }
  }

  @Post('/:assessmentId/responses')
  async postAssessmentAnswer(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number,
    @Param('assessmentId') assessmentId: number,
    @Body() assessmentAnswerDTO: AssessmentAnswerNew,
    @Res() response: Response
  ) {
    const course = await Course.findOne(courseId);
    const courseClass = await CourseClass.findOne(classId);
    const assessment = await Assessment.findOne(assessmentId);
    const student = await CourseStudent.findOne(assessmentAnswerDTO.studentId);

    if (
      course &&
      courseClass &&
      assessment &&
      student &&
      course.id === courseClass.courseId &&
      assessment.courseClassId === courseClass.id &&
      assessment.id === assessmentAnswerDTO.assessmentId
    ) {
      const assessmentAnswer = await AssessmentAnswers.findOne({
        where: {
          assessmentId,
        },
      });

      if (assessmentAnswer == null) {
        const assessmentQuestions = new AssessmentQuestions(
          assessment.questionsJson
        );

        for (let i = 0; i < assessmentQuestions.length; i++) {
          const question = assessmentQuestions.questions[i];
          question.selected = assessmentAnswerDTO.questionsAnswer[i].selected;
        }

        if (!assessmentQuestions.isCompleted) {
          return response.status(400).send('Assessment is not completed');
        }

        const calification = assessmentQuestions.computeCalification();

        const newAssessmentAnswer = AssessmentAnswers.create({
          assessment,
          calification,
          studentId: student.id,
          questionsAnswerJson: assessmentQuestions.toJson(),
        });

        return AssessmentAnswers.save(newAssessmentAnswer);
      }
    }
  }
}

function mapAssessmentToDTO(assessment: Assessment): AssessmentDTO;
function mapAssessmentToDTO(assessment: Assessment[]): AssessmentDTO[];
function mapAssessmentToDTO(
  assessment: Assessment | Assessment[]
): AssessmentDTO | AssessmentDTO[] {
  if (Array.isArray(assessment)) {
    const result: AssessmentDTO[] = [];
    for (const e of assessment) {
      result.push(mapAssessmentToDTO(e));
    }
    return result;
  } else {
    const assessmentQuestions = new AssessmentQuestions(
      assessment.questionsJson
    );

    const result: AssessmentDTO = {
      id: assessment.id,
      title: assessment.title,
      classTaskId: assessment.classTaskId,
      classTask: assessment.classTask as any,
      courseClassId: assessment.courseClassId,
      courseClass: assessment.courseClass as any,
      questions: assessmentQuestions.questions,
    };

    return result;
  }
}

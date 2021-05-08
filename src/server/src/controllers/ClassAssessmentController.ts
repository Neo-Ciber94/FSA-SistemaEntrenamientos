import {
  AssessmentAnswerDTO,
  AssessmentAnswerNew,
  AssessmentDTO,
  AssessmentNew,
  AssessmentQuestions,
  TaskType,
} from '../types';
import {
  Body,
  Delete,
  Get,
  JsonController,
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

@JsonController('/courses/:courseId/classes/:classId/assessments')
export class ClassAssessmentController {
  @Get()
  async getAllAssessments(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number
  ) {
    const course = await Course.findOne(courseId);
    const courseClass = await CourseClass.findOne(classId);

    if (course && courseClass && course.id === courseClass.courseId) {
      const result = await Assessment.find({
        where: {
          courseClassId: courseClass.id,
        },
      });

      return mapAssessmentToDTO(result);
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
      const result = await Assessment.findOne(assessmentId);
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

      const order = await ClassTask.nextOrder(classId);
      const newTask = ClassTask.create({
        taskType: TaskType.Assessment,
        courseClass,
        order,
      });

      newAssessment.classTask = newTask;
      return Assessment.save(newAssessment);
    }
  }

  @Put('/:assessmentId')
  async updateAssessment(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number,
    @Param('assessmentId') assessmentId: number,
    @Body() assessmentDTO: AssessmentNew
  ) {
    const course = await Course.findOne(courseId);
    const courseClass = await CourseClass.findOne(classId);
    const assessment = await Assessment.findOne(assessmentId);

    if (
      course &&
      courseClass &&
      assessment &&
      course.id === courseClass.courseId &&
      assessment.courseClassId === courseClass.id &&
      assessment.id === assessmentDTO.id
    ) {
      const assessmentQuestion = new AssessmentQuestions(
        assessmentDTO.questions
      );

      const newAssessment = Assessment.create({
        title: assessmentDTO.title,
        questionsJson: assessmentQuestion.toJson(),
      });

      return Assessment.save(newAssessment);
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
      return Assessment.remove(assessment);
    }
  }

  // courses/1/classes/2/assessments/3/responses?student=1
  @Get('/:assessmentId/responses')
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
      where: { studentId },
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
          assessmentAnswerDTO.questionsAnswer
        );
        if (!assessmentQuestions.isCompleted) {
          return response.status(400).send('Assessment is not completed');
        }

        const calification = assessmentQuestions.computeCalification();

        const newAssessmentAnswer = AssessmentAnswers.create({
          assessment,
          student,
          calification,
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

    // SAFETY: Both types have same layout except for `questions`
    const assessmentDTO = (assessment as unknown) as AssessmentDTO;
    // Sets the questions
    assessmentDTO.questions = assessmentQuestions.questions;
    return assessmentDTO;
  }
}

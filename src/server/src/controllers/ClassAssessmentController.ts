import { AssessmentNew } from '@shared/types';
import {
  Body,
  Delete,
  JsonController,
  Param,
  Post,
  Put,
} from 'routing-controllers';
import { Assessment, Course, CourseClass } from '../entities';

@JsonController('/courses/:courseId/classes/:classId/assessments')
export class ClassAssessmentController {
  @Post()
  async createAssessment(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number,
    @Body() assessmentDTO: AssessmentNew
  ) {
    const course = await Course.findOne(courseId);
    const courseClass = await CourseClass.findOne(classId);

    if (course && courseClass && course.id === courseClass.courseId) {
      const newAssessment = Assessment.create(assessmentDTO);
      return Assessment.save(newAssessment);
    }
  }

  @Put('/:id')
  async updateAssessment(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number,
    @Param('id') assessmentId: number,
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
      const newAssessment = Assessment.create(assessmentDTO);
      return Assessment.save(newAssessment);
    }
  }

  @Delete('/:id')
  async deleteAssessment(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number,
    @Param('id') assessmentId: number
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

  @Post()
  async addQuestion() {}

  @Put('/:id')
  async updateQuestion() {}

  @Delete('/:id')
  async deleteQuestion() {}
}

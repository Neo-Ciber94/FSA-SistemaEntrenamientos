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
      const assessment = Assessment.create(assessmentDTO);
    }
  }

  @Put()
  async updateAssessment(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number
  ) {}

  @Delete('id')
  async deleteAssessment(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number
  ) {}
}

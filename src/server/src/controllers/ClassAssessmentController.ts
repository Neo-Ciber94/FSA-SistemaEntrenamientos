import { Delete, JsonController, Param, Post, Put } from 'routing-controllers';

@JsonController('/courses/:courseId/classes/:classId/assessments')
export class ClassAssessmentController {
  @Post()
  async createAssessment(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number
  ) {
    // Change course to available if have more than '3' assessments
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

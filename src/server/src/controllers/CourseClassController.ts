import {
  Body,
  Get,
  JsonController,
  Param,
  Post,
  QueryParam,
  Res,
} from 'routing-controllers';
import { Response } from 'express';
import { Course, CourseClass } from '../entities';
import { CourseClassDTO } from '../types';

@JsonController('/courses')
export class CourseClassController {
  @Get('/:id/classes')
  async getAllClasses(
    @Param('id') courseId: number,
    @QueryParam('include') include?: string
  ) {
    const course = await Course.findOne(courseId);
    if (!course) {
      return undefined;
    }

    const relations = include ? include.split(',') : [];
    const courseClasses = await CourseClass.find({
      relations,
      where: {
        course,
      },
    });

    return courseClasses;
  }

  @Get('/:id/classes/:classId')
  async getClassById(
    @Param('id') courseId: number,
    @Param('classId') classId: number
  ) {
    const course = await Course.findOne(courseId);
    if (course) {
      return course.classes.find((c) => c.id === classId);
    }
  }

  @Post('/:id/classes')
  async addClass(
    @Param('id') courseId: number,
    @Body() courseClassDTO: CourseClassDTO,
    @Res() response: Response
  ) {
    const course = await Course.findOne(courseId, { relations: ['students'] });

    if (course && course.students.length > 0) {
      return response
        .status(400)
        .send('cannot add new classes to a course with students');
    }

    if (course) {
      const courseClass = CourseClass.create(courseClassDTO);
      courseClass.course = course;
      return CourseClass.save(courseClass);
    }
  }

  @Post('/:id/classes')
  async updateClass(
    @Param('id') courseId: number,
    @Body() courseClassDTO: CourseClassDTO
  ) {
    const course = await Course.findOne(courseId);

    if (course) {
      const courseClass = CourseClass.create(courseClassDTO);
      courseClass.course = course;
      return CourseClass.save(courseClass);
    }
  }

  @Get('/:id/classes')
  async getClasses(@Param('id') courseId: number) {
    const course = await Course.findOne(courseId, { relations: ['classes'] });
    if (course) {
      return course.classes;
    }
  }
}

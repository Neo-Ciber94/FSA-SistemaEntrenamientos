import {
  Body,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam,
  Res,
} from 'routing-controllers';
import { Course } from '../entities/Course';
import { User } from '../entities/User';
import { Response } from 'express';
import { CourseDTO, CourseNew } from '../types';
import { AbstractBaseController } from './AbstractBaseController';

@JsonController('/courses')
export class CourseController {
  @Get()
  getAllCourses() {
    return Course.find();
  }

  @Get('/:id')
  getCourseById(@Param('id') id: number) {
    return Course.findOne(id);
  }

  @Get()
  getCoursesByTeacher(@QueryParam('teacher') teacherId: number) {
    return Course.createQueryBuilder()
      .select()
      .where(':teacherId = teacher.id', { teacherId })
      .getMany();
  }

  @Post()
  async createCourse(@Body() newCourse: CourseNew, @Res() response: Response) {
    const teacher = await User.findOne(newCourse.teacherId);

    if (teacher == null) {
      return response.status(404).send('teacher not found');
    }

    const course = Course.create(newCourse);
    course.teacher = teacher;
    return await Course.save(course);
  }

  @Put()
  async updateCourse(@Body() newCourse: CourseNew, @Res() response: Response) {
    const teacher = await User.findOne(newCourse.teacherId);

    if (teacher == null) {
      return response.status(404).send('teacher not found');
    }

    const course = await Course.findOne(newCourse.id!);

    if (course == null) {
      return response.status(404).send('course not found');
    }

    return Course.save(course);
  }
}

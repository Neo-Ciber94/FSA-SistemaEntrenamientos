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
import { CourseClassDTO, CourseClassNew } from '../types';
import { Includes } from './Includes';
import { loadRelationsAndQuery } from '../utils';

@JsonController('/courses')
export class CourseClassController {
  private readonly includes = new Includes(['course', 'tasks']);

  @Get('/:id/classes')
  async getAllClasses(
    @Param('id') courseId: number,
    @Res() response: Response,
    @QueryParam('include') include?: string
  ) {
    const result = this.includes.getRelations(response, include);
    if (result.type === 'invalid') {
      return result.error;
    }

    const course = await Course.findOne(courseId);
    if (!course) {
      return undefined;
    }

    const courseClasses = await CourseClass.find({
      relations: result.relations,
      where: { course },
    });

    return courseClasses;
  }

  @Get('/:id/classes/:classId')
  async getClassById(
    @Param('id') courseId: number,
    @Param('classId') classId: number,
    @Res() response: Response,
    @QueryParam('include') include?: string
  ) {
    const result = this.includes.getRelations(response, include);
    if (result.type === 'invalid') {
      return result.error;
    }

    const courseClass = await loadRelationsAndQuery(
      CourseClass.getRepository(),
      'courseClass',
      result.relations
    )
      .where('courseClass.courseId = :courseId AND courseClass.id = :classId', {
        courseId,
        classId,
      })
      .getOne();

    return courseClass;
  }

  @Post('/:id/classes')
  async addClass(
    @Param('id') courseId: number,
    @Body() courseClassDTO: CourseClassNew,
    @Res() response: Response
  ) {
    const course = await Course.findOne(courseId, { relations: ['students'] });

    if (course?.id !== courseClassDTO.courseId) {
      throw new Error('Course id missmatch');
    }

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
    @Body() courseClassDTO: CourseClassNew
  ) {
    const course = await Course.findOne(courseId);

    if (course?.id !== courseClassDTO.courseId) {
      throw new Error('Course id missmatch');
    }
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

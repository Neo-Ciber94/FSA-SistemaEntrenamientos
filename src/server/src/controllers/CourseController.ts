import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam,
  QueryParams,
  Res,
} from 'routing-controllers';
import { Course } from '../entities/Course';
import { User } from '../entities/User';
import { Response } from 'express';
import { CourseNew, RoleName } from '../types';
import { CourseStudent } from '../entities/CourseStudent';
import { Includes } from './Includes';
import { loadRelationsAndQuery } from '../utils';

@JsonController('/courses')
export class CourseController {
  readonly includes = new Includes(['teacher', 'classes', 'students']);

  @Get()
  async getAllCourses(
    @Res() response: Response,
    @QueryParam('userId') userId?: number,
    @QueryParam('include') include?: string
  ) {
    const result = this.includes.getRelations(response, include);
    if (result.type === 'invalid') {
      return result.error;
    }

    let courses: Course[] | null = null;

    if (userId) {
      const user = await User.findOne(userId, {
        relations: ['role', ...result.relations],
      });
      if (user == null) {
        return null;
      }

      switch (user.role.name) {
        case RoleName.Student:
          {
            courses = await loadRelationsAndQuery(
              CourseStudent.getRepository(),
              'courseStudent',
              ['user', ...result.relations]
            )
              .where('courseStudent.userId = :id', { id: userId })
              .getMany()
              .then((e) => e.map((e) => e.course));
          }
          break;
        case RoleName.Teacher:
          {
            courses = await loadRelationsAndQuery(
              Course.getRepository(),
              'course',
              result.relations
            )
              .where('teacherId = :id', { id: userId })
              .getMany();
          }
          break;
        default:
          break;
      }
    }

    if (courses == null) {
      courses = await Course.find({ relations: result.relations });
    }

    return courses;
  }

  @Get('/:id')
  getCourseById(
    @Param('id') id: number,
    @Res() response: Response,
    @QueryParam('include') include?: string
  ) {
    const result = this.includes.getRelations(response, include);
    if (result.type === 'invalid') {
      return result.error;
    }

    return Course.findOne(id, { relations: result.relations });
  }

  @Post()
  async createCourse(@Body() newCourse: CourseNew, @Res() response: Response) {
    const teacher = await User.findOne(newCourse.teacherId);

    if (teacher == null) {
      return response.status(404).send('teacher not found');
    }

    const course = Course.create(newCourse);
    course.teacher = teacher;

    console.log(course);
    return Course.save(course);
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

    const courseToUpdate = Course.create(newCourse);
    return Course.save(courseToUpdate);
  }

  @Delete('/:id')
  async deleteCourse(@Param('id') id: number, @Res() response: Response) {
    const course = await Course.findOne(id, { relations: ['students'] });
    if (!course) {
      return null;
    }

    if (course.students.length > 0) {
      return response.status(400).send('Cannot delete a course with students');
    }

    await Course.delete(course);
    return course;
  }
}

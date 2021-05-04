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

@JsonController('/courses')
export class CourseController {
  readonly includes = new Includes(['teacher', 'classes', 'students']);

  @Get()
  async getAllCourses(
    @Res() response: Response,
    @QueryParam('userId') userId?: number,
    @QueryParam('include') include?: string
  ) {
    const includes = this.includes.getRelations(response, include);
    if (includes.type === 'invalid') {
      return includes.error;
    }

    if (userId) {
      const user = await User.findOne(userId, {
        relations: ['role', ...includes.relations],
      });
      if (user == null) {
        return null;
      }

      switch (user.role.name) {
        case RoleName.Student: {
          const result = CourseStudent.createQueryBuilder()
            .where('userId = :id', { id: userId })
            .loadAllRelationIds({ relations: ['user', ...includes.relations] })
            .getMany()
            .then((e) => e.map((e) => e.user));

          return result;
        }
        case RoleName.Teacher: {
          const result = Course.createQueryBuilder()
            .loadAllRelationIds({ relations: includes.relations })
            .where('teacherId = :id', { id: userId })
            .getMany();

          return result;
        }
        default:
          break;
      }
    }

    return Course.find({ relations: includes.relations });
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

  @Delete('/:id')
  async deleteCourse(@Param('id') id: number) {
    const course = await Course.findOne(id);
    if (!course) {
      return null;
    }

    await Course.delete(course);
    return course;
  }
}

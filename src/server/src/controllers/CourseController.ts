import { Response } from 'express';
import {
  Body,
  BodyParam,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  Res,
} from 'routing-controllers';
import { CourseClass, StudentCourse, User } from '../entities';
import { Course } from '../entities/Course';
import { CourseClassDTO, RoleName } from '../types';
import { applyMixins } from '../utils/applyMixins';
import { AbstractBaseController } from './AbstractBaseController';

@JsonController('/courses')
export class CourseController extends AbstractBaseController<Course> {
  constructor() {
    super(Course.getRepository());
  }

  // Classes
  @Get('/:id/classes')
  async getAllClasses(@Param('id') courseId: number) {
    const course = await Course.findOne(courseId, { relations: ['classes'] });
    if (course) {
      return course.classes;
    }
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
    @Body() courseClassDTO: CourseClassDTO
  ) {
    const course = await Course.findOne(courseId);

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

  // Students
  @Post('/:id/students')
  async addStudent(
    @Param(':id') courseId: number,
    @BodyParam('userId') userId: number,
    @Res() response: Response
  ) {
    const user = await User.findOne(userId, { relations: ['role'] });
    const course = await Course.findOne(courseId);

    if (user && course) {
      if (user.role.name !== RoleName.Student) {
        return response.status(400).send('A student was expected');
      }

      const student = StudentCourse.create({ user });
      student.course = course;
      return StudentCourse.save(student);
    }
  }
}

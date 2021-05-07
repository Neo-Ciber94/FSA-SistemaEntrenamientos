import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
} from 'routing-controllers';

import { ClassTask, Course, CourseClass, Lesson } from '../entities';
import { LessonDTO, LessonNew, TaskType } from '../types';

@JsonController('/courses/:courseId/classes/:classId/lessons')
export class ClassLessonController {
  @Get()
  async getAllLessons(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number
  ) {
    // const course = await Course.findOne(courseId);
    // const courseClass = await CourseClass.findOne(classId, {
    //   relations: ['lessons'],
    // });

    // if (course && courseClass) {
    //   return courseClass.lessons;
    // }

    const lessons = await Lesson.createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.classTask', 'classTask')
      .leftJoinAndSelect('classTask.courseClass', 'courseClass')
      .leftJoinAndSelect('courseClass.course', 'course')
      .andWhere('courseClass.courseId = course.id')
      .where('course.id = :courseId AND courseClass.id = :classId', {
        courseId,
        classId,
      })
      .getMany();

    return lessons;
  }

  @Get('/:id')
  async getLessonById(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number,
    @Param('id') lessonId: number
  ) {
    // const course = await Course.findOne(courseId);
    // const courseClass = await CourseClass.findOne(classId, {
    //   relations: ['lessons'],
    // });

    // if (course && courseClass) {
    //   return courseClass.lessons.find((e) => e.id === lessonId);
    // }

    const lesson = await Lesson.createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.classTask', 'classTask')
      .leftJoinAndSelect('classTask.courseClass', 'courseClass')
      .leftJoinAndSelect('courseClass.course', 'course')
      .andWhere('courseClass.courseId = course.id')
      .where(
        'course.id = :courseId AND courseClass.id = :classId AND lesson.id = :lessonId',
        {
          courseId,
          classId,
          lessonId,
        }
      )
      .getOne();

    return lesson;
  }

  @Post()
  async createLesson(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number,
    @Body() lessonDTO: LessonNew
  ) {
    const course = await Course.findOne(courseId);
    const courseClass = await CourseClass.findOne(classId, {
      relations: ['course'],
    });

    if (course && courseClass && course.id === courseClass.courseId) {
      const newLesson = Lesson.create(lessonDTO);

      const order = await ClassTask.nextOrder(classId);
      const newTask = ClassTask.create({
        taskType: TaskType.Lesson,
        courseClass,
        order,
      });

      newLesson.classTask = newTask;

      await ClassTask.save(newTask);
      return Lesson.save(newLesson);
    }
  }

  @Put()
  async updateLesson(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number,
    @Body() lessonDTO: LessonNew
  ) {
    const course = await Course.findOne(courseId);
    const courseClass = await CourseClass.findOne(classId);
    const lessonToUpdate = await Lesson.findOne(lessonDTO.id);

    if (
      course &&
      courseClass &&
      lessonToUpdate &&
      lessonToUpdate.id === lessonDTO.id
    ) {
      const newEntity = Lesson.create(lessonDTO);
      return Lesson.save(newEntity);
    }
  }

  @Delete('/:id')
  async deleteLesson(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number,
    @Param('id') lessonId: number
  ) {
    const course = await Course.findOne(courseId);
    const courseClass = await CourseClass.findOne(classId);
    const lessonToDelete = await Lesson.findOne(lessonId);

    if (
      course &&
      courseClass &&
      course.id === courseClass.courseId &&
      lessonToDelete
    ) {
      await Lesson.delete(lessonToDelete);
      return lessonToDelete;
    }
  }
}

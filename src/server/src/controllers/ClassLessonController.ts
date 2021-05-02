import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
} from 'routing-controllers';
import { Course, CourseClass, Lesson } from '../entities';
import { LessonDTO } from '../types';

@JsonController('/courses/:courseId/classes/:classId/lessons')
export class ClassLessonController {
  @Get()
  async getAllLessons(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number
  ) {
    const course = await Course.findOne(courseId);
    const courseClass = await CourseClass.findOne(classId, {
      relations: ['lessons'],
    });

    if (course && courseClass) {
      return courseClass.lessons;
    }
  }

  @Get('/:id')
  async getLessonById(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number,
    @Param('id') lessonId: number
  ) {
    const course = await Course.findOne(courseId);
    const courseClass = await CourseClass.findOne(classId, {
      relations: ['lessons'],
    });

    if (course && courseClass) {
      return courseClass.lessons.find((e) => e.id === lessonId);
    }
  }

  @Post()
  async createLesson(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number,
    @Body() lessonDTO: LessonDTO
  ) {
    const course = await Course.findOne(courseId);
    const courseClass = await CourseClass.findOne(classId);

    if (course && courseClass) {
      const newLesson = Lesson.create(lessonDTO);
      newLesson.lessonClass = courseClass;
      return Lesson.save(newLesson);
    }
  }

  @Put()
  async updateLesson(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number,
    @Body() lessonDTO: LessonDTO
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

    if (course && courseClass && lessonToDelete) {
      await Lesson.delete(lessonToDelete);
      return lessonToDelete;
    }
  }
}

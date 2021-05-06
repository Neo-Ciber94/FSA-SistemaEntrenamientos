import {
  BodyParam,
  Get,
  JsonController,
  Param,
  Post,
  Res,
} from 'routing-controllers';
import { Response } from 'express';
import { Course, User, CourseStudent } from '../entities';
import { RoleName, TaskType } from '../types';
import { MIN_NUMBER_OF_CLASS_ASSESSMENTS } from '../config';

@JsonController('/courses')
export class CourseStudentController {
  @Get('/:id/students')
  async getAllStudents(@Param('id') courseId: number) {
    const course = await Course.findOne(courseId, { relations: ['students'] });

    if (course) {
      return course.students;
    }
  }

  @Get('/:id/students/:studentId')
  async getStudentById(
    @Param('id') courseId: number,
    @Param('studentId') studentId: number
  ) {
    const course = await Course.findOne(courseId, { relations: ['students'] });

    if (course) {
      return course.students.find((s) => s.id === studentId);
    }
  }

  @Post('/:id/students')
  async addStudent(
    @Param(':id') courseId: number,
    @BodyParam('userId') userId: number,
    @Res() response: Response
  ) {
    const course = await Course.findOne(courseId, {
      relations: ['classes', 'classes.tasks'],
    });

    if (course && !canAcceptStudents(course)) {
      return response
        .status(400)
        .send(
          `courses classes require at least ${MIN_NUMBER_OF_CLASS_ASSESSMENTS} assessments per class to accept students`
        );
    }

    const user = await User.findOne(userId, { relations: ['role'] });

    if (user && course) {
      if (user.role.name !== RoleName.Student) {
        return response.status(400).send('A student was expected');
      }

      const student = CourseStudent.create({ user });
      student.course = course;
      return CourseStudent.save(student);
    }
  }

  @Post('/:courseId/students/:studentId/complete')
  async markAsCourseComplete(
    @Param('courseId') courseId: number,
    @Param('studentId') studentId: number,
    @Res() response: Response
  ) {
    const course = await Course.findOne(courseId, {
      relations: ['classes', 'classes.tasks'],
    });
    const student = await CourseStudent.findOne(studentId, {
      relations: ['assessmentAnswers'],
    });

    if (course && student) {
      // If course is already completed
      if (student.isCompleted) {
        return response.status(400).send('student course is already completed');
      }

      // Check if the student actually complete the course,
      // a course is considered complete if all the assessments were taken
      let numberOfCourseAssessments = 0;
      for (const c of course.classes) {
        numberOfCourseAssessments += c.tasks.filter(
          (e) => e.taskType === TaskType.Assessment
        ).length;
      }

      if (numberOfCourseAssessments !== student.assessmentAnswers.length) {
        return response
          .status(400)
          .send("student didn't complete all the classes");
      }

      student.isCompleted = true;
      await CourseStudent.save(student);
      return response.sendStatus(200);
    }
  }
}

/**
 * Check if the course is able to accept any students
 */
function canAcceptStudents(course: Course) {
  const classes = course.classes;
  console.assert(classes, 'classes courses are not loaded');

  for (const classCourse of classes) {
    const assessments = classCourse.tasks.filter(
      (e) => e.taskType === TaskType.Assessment
    );
    if (assessments.length < MIN_NUMBER_OF_CLASS_ASSESSMENTS) {
      return false;
    }
  }

  return true;
}

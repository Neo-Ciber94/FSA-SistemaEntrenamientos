import {
  Body,
  Get,
  JsonController,
  Param,
  Put,
  QueryParam,
  Res,
} from 'routing-controllers';
import {
  Course,
  CourseClass,
  ClassTask,
  Lesson,
  Assessment,
} from '../entities';
import {
  AssessmentDTO,
  ClassTaskDTO,
  ClassTaskMove,
  LessonDTO,
  TaskType,
} from '../types';
import { Response } from 'express';

@JsonController('/courses/:courseId/classes/:classId/tasks')
export class ClassTaskController {
  @Get()
  async getClassTasks(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number,
    @QueryParam('type') taskType?: TaskType
  ) {
    const course = await Course.findOne(courseId);
    const courseClass = await CourseClass.findOne(classId);

    if (course && courseClass && course.id === courseClass.courseId) {
      if (taskType) {
        const result = await ClassTask.find({ where: { taskType } });
        return mapToClassTaskDTO(result);
      } else {
        const result = await ClassTask.find();
        return mapToClassTaskDTO(result);
      }
    }
  }

  @Put('/move')
  async moveTask(
    @Param('courseId') courseId: number,
    @Param('classId') classId: number,
    @Body() taskMove: ClassTaskMove,
    @Res() response: Response
  ) {
    const task = await ClassTask.findOne(taskMove.classTaskId);
    const course = await Course.findOne(courseId);
    const courseClass = await CourseClass.findOne(classId, {
      relations: ['tasks'],
    });

    console.log(task);
    if (
      task &&
      course &&
      courseClass &&
      task.courseClassId === courseClass.id &&
      course.id === courseClass.courseId
    ) {
      const courseTasks = courseClass.tasks;

      console.log('MOVING...');
      if (taskMove.order > courseTasks.length || taskMove.order < 0) {
        return response
          .status(400)
          .send(
            `Invalid task order, expected order between 0 and ${courseTasks.length}`
          );
      }

      // Nothing to do
      if (taskMove.order === task.order) {
        return response.sendStatus(200);
      }

      // Swapping orders
      const oldTask = courseTasks.find((e) => e.order === taskMove.order)!;
      const tempOrder = task.order;
      task.order = oldTask.order;
      oldTask.order = -1;

      await ClassTask.update(oldTask.id, oldTask);
      await ClassTask.update(task.id, task);

      oldTask.order = tempOrder;
      await ClassTask.update(oldTask.id, oldTask);

      console.log('Exit!');
      // Ok
      return response.status(200);
    }

    console.log('undefined');
  }
}

async function mapToClassTaskDTO(tasks: ClassTask[]): Promise<ClassTaskDTO[]>;
async function mapToClassTaskDTO(tasks: ClassTask): Promise<ClassTaskDTO>;
async function mapToClassTaskDTO(
  tasks: ClassTask | ClassTask[]
): Promise<ClassTaskDTO[] | ClassTaskDTO> {
  if (Array.isArray(tasks)) {
    const result: ClassTaskDTO[] = [];
    for (const t of tasks) {
      result.push(await mapToClassTaskDTO(t));
    }
    return result;
  } else {
    let classTask: Lesson | Assessment | undefined;

    switch (tasks.taskType) {
      case TaskType.Assessment:
        classTask = await Assessment.findOne({
          where: { classTaskId: tasks.id },
        });
        break;
      case TaskType.Lesson:
        classTask = await Lesson.findOne({
          where: { classTaskId: tasks.id },
        });
        break;
      default:
        throw new Error(`Invalid task type: ${tasks.taskType}`);
    }

    if (classTask == null) {
      throw new Error(`classTask is undefined: ${JSON.stringify(tasks)}`);
    }

    // Conversion is safe due ClassTask have the same fields than ClassTaskDTO except 'classTask'
    const ret = (tasks as unknown) as ClassTaskDTO;
    ret.task = (classTask as unknown) as LessonDTO | AssessmentDTO;
    return ret;
  }
}

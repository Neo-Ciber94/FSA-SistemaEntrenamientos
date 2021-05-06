import { Get, JsonController, Param, QueryParam } from 'routing-controllers';
import {
  Course,
  CourseClass,
  ClassTask,
  Lesson,
  Assessment,
} from '../entities';
import { AssessmentDTO, ClassTaskDTO, LessonDTO, TaskType } from '../types';

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
    let classTask: LessonDTO | AssessmentDTO | undefined;

    switch (tasks.taskType) {
      case TaskType.Assessment:
        classTask = ((await Lesson.findOne({
          where: { classTaskId: tasks.id },
        })) as unknown) as LessonDTO;
        break;
      case TaskType.Lesson:
        classTask = ((await Assessment.findOne({
          where: { classTaskId: tasks.id },
        })) as unknown) as AssessmentDTO;
        break;
    }

    if (classTask == null) {
      throw new Error('classTask is undefined');
    }

    // Conversion is safe due ClassTask have the same fields than ClassTaskDTO except 'classTask'
    const ret = (tasks as unknown) as ClassTaskDTO;
    ret.classTask = classTask;
    return ret;
  }
}

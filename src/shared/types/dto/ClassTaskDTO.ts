import { TaskType } from '../TaskType';
import { AssessmentDTO } from './AssessmentDTO';
import { CourseClassDTO } from './CourseClassDTO';
import { LessonDTO } from './LessonDTO';

interface ClassTaskBase {
  id: number;
  order: number;
  courseClassId: number;
  courseClass: CourseClassDTO;
}

interface ClassTaskLesson extends ClassTaskBase {
  taskType: TaskType.Lesson;
  task: LessonDTO;
}

interface ClassTaskAssessment extends ClassTaskBase {
  taskType: TaskType.Assessment;
  task: AssessmentDTO;
}

export type ClassTaskDTO = ClassTaskLesson | ClassTaskAssessment;

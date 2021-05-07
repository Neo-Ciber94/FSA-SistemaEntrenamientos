import { ClassTaskDTO, CourseClassDTO } from '.';

export interface LessonDTO {
  id: number;
  title: string;
  content: string;
  isMarkdown: boolean;
  courseClassId: number;
  courseClass: CourseClassDTO;
  classTaskId: number;
  classTask: ClassTaskDTO;
}

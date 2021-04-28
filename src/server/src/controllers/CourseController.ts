import { JsonController } from 'routing-controllers';
import { Course } from '../entities/Course';
import { AbstractBaseController } from './AbstractBaseController';

@JsonController('/courses')
export class CourseController extends AbstractBaseController<Course> {
  constructor() {
    super(Course.getRepository());
  }
}

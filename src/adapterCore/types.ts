import { LabCourseTask } from './course/classes';
import { LoginCasTask } from './loginCas';

export type TTask = LabCourseTask | LoginCasTask;

export interface ITaskContext {
  nextStepIndex?: number;
}

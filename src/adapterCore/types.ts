import { LabCourseTask } from './course/classes';
import { LoginCasTask } from './loginCas';

export type TTask = LabCourseTask | LoginCasTask;

export type TgetAccount = () => {
  account: string;
  passwd: string;
  loginedCasCookie?: string;
};

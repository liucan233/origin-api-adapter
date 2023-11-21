import { IRunableTask } from '../classes';
import { LoginSoaStep } from '../common/loginSoa';
import { CheckEnvStep } from './steps';
import { TCourseItem } from './types';

export class LabCourseTask extends IRunableTask<TCourseItem[]> {
  constructor() {
    super();
    this.stepArr.push(
      new LoginSoaStep(),
      new CheckEnvStep('登陆系统1', '进入实验系统1'),
    );
  }
}

import { IRunableTask } from '../classes';
import { CheckEnvStep, ErrorStep } from './steps';
import { TCourseItem } from './types';

export class LabCourseTask extends IRunableTask<TCourseItem[]> {
  constructor() {
    super();
    this.stepArr.push(new CheckEnvStep('登陆系统1', '进入实验系统1'));
    this.stepArr.push(new CheckEnvStep('登陆系统2', '进入实验系统2'));
    this.stepArr.push(new CheckEnvStep('登陆系统3', '进入实验系统3'));
    this.stepArr.push(new ErrorStep('登陆系统3', '进入实验系统3'));
    this.stepArr.push(new CheckEnvStep('登陆系统4', '进入实验系统4'));
    this.stepArr.push(new CheckEnvStep('登陆系统5', '进入实验系统5'));
    this.stepArr.push(new CheckEnvStep('登陆系统6', '进入实验系统6'));
  }
}

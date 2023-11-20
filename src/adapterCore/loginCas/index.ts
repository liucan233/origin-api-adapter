import { IRunableTask } from '../classes';
import { GetCaptchaStep } from './steps';

export class LoginCasTask extends IRunableTask<null> {
  constructor() {
    super();
    this.stepArr.push(new GetCaptchaStep());
  }
}

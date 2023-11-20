import { IRunableTask } from '../classes';
import {
  GetCaptchaStep,
  GetKeyPairStep,
  GetUserAccountStep,
  LoginCasStep,
} from './steps';

export class LoginCasTask extends IRunableTask<null> {
  constructor() {
    super();
    this.stepArr.push(new GetCaptchaStep());
    this.stepArr.push(new GetUserAccountStep());
    this.stepArr.push(new GetKeyPairStep());
    this.stepArr.push(new LoginCasStep());
  }
}

import { IRunableTask } from '../classes';
import {
  GetCaptchaStep,
  GetKeyPairStep,
  GetUserAccountStep,
  LoginCasStep,
} from './steps';

interface ITaskResult {
  casLoginedCookie: string;
  soaTicketUrl: string;
}

export class LoginCasTask extends IRunableTask<ITaskResult> {
  constructor() {
    super();
    this.stepArr.push(
      new GetCaptchaStep(),
      new GetUserAccountStep(),
      new GetKeyPairStep(),
      new LoginCasStep(),
    );
  }
}

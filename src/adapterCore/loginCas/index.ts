import { IRunableTask } from '../classes';
import {
  CheckTGCStep,
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
      new GetUserAccountStep(),
      new CheckTGCStep(),
      new GetCaptchaStep(),
      new GetKeyPairStep(),
      new LoginCasStep(),
    );
  }
}

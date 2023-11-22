import { IRunableTask } from '../classes';
import { TryHttpsStep } from '../common/TryHttpsStep';
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
      new TryHttpsStep(),
      new GetUserAccountStep(),
      new CheckTGCStep(),
      new GetCaptchaStep(),
      new GetKeyPairStep(),
      new LoginCasStep(),
    );
  }
}

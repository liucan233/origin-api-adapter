import { Helmet } from '@modern-js/runtime/head';
import './index.css';
import { useRef, useState } from 'react';
import { AdapterCore, supportedTask } from '@/adapterCore';

const TaskCtrl = () => {
  const [showRetry, setShowRetry] = useState(false);
  const adapterCoreRef = useRef<AdapterCore | null>(null);
  const [captcha, setCaptcha] = useState('');
  const [captchaImg, setCaptchaImg] = useState('');

  const resolveGetCaptchaTextRef = useRef<null | ((v: string) => any)>(null);

  const handleStart = () => {
    // 终止上一个执行
    adapterCoreRef.current?.abortAllTask();

    // 创建新任务
    const adapterCore = new AdapterCore({
      manual: {
        getAccount() {
          return {
            account: '1',
            passwd: '1',
          };
        },
        getCaptchaText(base64) {
          setCaptchaImg(base64);
          return new Promise<string>(resolve => {
            resolveGetCaptchaTextRef.current = resolve;
          });
        },
      },
    });
    adapterCoreRef.current = adapterCore;

    const task1 = adapterCore.addTask(supportedTask.getLoginCasTask());
    task1.onSuccess = () => console.log('task1成功');
    task1.onError = err => {
      setShowRetry(true);
      console.log(err);
    };

    // 监听任务执行情况
    task1.onProgressOrSkip = (c, a) =>
      console.log(task1.stepArr[c].name, `${c}/${a}`);

    const task2 = adapterCore.addTask(supportedTask.getLabCourseTask());
    task2.onSuccess = () => console.log('task2成功');
    task2.onError = err => {
      setShowRetry(true);
      console.log(err);
    };

    // 监听任务执行情况
    task2.onProgressOrSkip = (c, a) =>
      console.log(task2.stepArr[c].name, `${c}/${a}`);

    // 开始所有任务
    adapterCore.execAllTask();
  };
  return (
    <>
      {!showRetry && <button onClick={handleStart}>开始</button>}
      {showRetry && (
        <button
          onClick={() => {
            adapterCoreRef.current?.execAllTask(); // 失败时再次调用可以重试
            setShowRetry(false);
          }}
        >
          重试
        </button>
      )}
      <button onClick={() => adapterCoreRef.current?.abortAllTask()}>
        取消
      </button>
      {captchaImg && <img src={captchaImg} />}
      {captchaImg && (
        <input
          placeholder="验证码"
          value={captcha}
          onChange={e => setCaptcha(e.target.value)}
        />
      )}
      {captchaImg && (
        <button
          onClick={() => {
            resolveGetCaptchaTextRef.current?.(captcha);
            setCaptchaImg('');
          }}
        >
          提交验证码
        </button>
      )}
    </>
  );
};

const Index = () => (
  <div className="container-box">
    <Helmet>
      <link
        rel="icon"
        type="image/x-icon"
        href="https://lf3-static.bytednsdoc.com/obj/eden-cn/uhbfnupenuhf/favicon.ico"
      />
    </Helmet>
    <main>
      <TaskCtrl />
    </main>
  </div>
);

export default Index;

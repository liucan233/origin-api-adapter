import { Helmet } from '@modern-js/runtime/head';
import './index.css';
import { useRef } from 'react';
import { AdapterCore, supportedTask } from '@/adapterCore';

const TaskCtrl = () => {
  const adapterCoreRef = useRef<AdapterCore | null>(null);
  const handleStart = () => {
    // 终止上一个执行
    adapterCoreRef.current?.abortAllTask();

    // 创建新任务
    const adapterCore = new AdapterCore();
    adapterCoreRef.current = adapterCore;
    const task1 = adapterCore.addTask(supportedTask.getLabCourse());
    const task2 = adapterCore.addTask(supportedTask.getLabCourse());

    // 监听任务执行成功
    task1.promise.then(arr => {
      console.log('实验课获取成功', arr);
      console.log('第二个任务即将开始执行');
    });

    // 获取任务里的所有步骤
    console.log(
      '实验课获取步骤:',
      task1.stepArr.map(({ name, desc }) => ({ name, desc })),
    );

    // 监听任务执行情况
    task1.stepArr.forEach(({ name, promise }) => {
      promise.then(() => {
        console.log(name, '执行成功');
      });
    });

    // 监听任务执行成功
    task2.promise.then(arr => {
      console.log('第二个任务执行成功', arr);
    });

    // 监听任务执行情况
    task2.stepArr.forEach(({ name, promise }) => {
      promise.then(() => {
        console.log(name, '执行成功');
      });
    });

    // 开始所有任务
    adapterCore.execAllTask();
  };
  return (
    <>
      <button onClick={handleStart}>开始</button>
      <button onClick={() => adapterCoreRef.current?.abortAllTask()}>
        取消
      </button>
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

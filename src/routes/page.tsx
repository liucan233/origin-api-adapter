import { Helmet } from '@modern-js/runtime/head';
import './index.css';
import { useRef, useState } from 'react';
import { AdapterCore, supportedTask } from '@/adapterCore';

const TaskCtrl = () => {
  const [showRetry, setShowRetry] = useState(false);
  const adapterCoreRef = useRef<AdapterCore | null>(null);
  const handleStart = () => {
    // 终止上一个执行
    adapterCoreRef.current?.abortAllTask();

    // 创建新任务
    const adapterCore = new AdapterCore();
    adapterCoreRef.current = adapterCore;

    // 创建任务
    const task1 = adapterCore.addTask(supportedTask.getLabCourse());

    task1.onSuccess = () => console.log('task1成功');
    task1.onError = () => {
      setShowRetry(true);
      console.log('task1失败');
    };

    task1.onProgress = (c, a) => console.log(`task2进度: ${c}/${a}`);

    const task2 = adapterCore.addTask(supportedTask.getLabCourse());
    task2.onSuccess = () => console.log('task2成功');
    task2.onError = () => {
      setShowRetry(true);
      console.log('task2失败');
    };

    // 监听任务执行情况
    task2.onProgress = (c, a) => console.log(`task2进度: ${c}/${a}`);

    // 开始所有任务
    adapterCore.execAllTask();
  };
  return (
    <>
      <button onClick={handleStart}>开始</button>
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

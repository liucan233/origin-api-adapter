import { useContext } from '@modern-js/runtime/express';

export const get = async () => {
  console.log(this);
  return '';
  const res = await fetch(
    'https://lf3-static.bytednsdoc.com/obj/eden-cn/zq-uylkvT/ljhwZthlaukjlkulzlp/logo-2x-text-0104.png',
  );
  return res.arrayBuffer();
};

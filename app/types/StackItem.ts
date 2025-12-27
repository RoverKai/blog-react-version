export type StackRef = {
  /** 栈中的变量名 */
  key: string;

  /** 指向堆的地址（展示用） */
  address: `0x${string}`;

  /** 堆中的真实值 */
  value: string;

  /** 点击后跳转的路由 */
  path: string;
};

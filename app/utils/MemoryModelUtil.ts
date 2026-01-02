import type { StackRef } from "~/types/StackItem";

const memoryMap: StackRef[] = [
  {
    key: "name",
    address: "0x7fa1",
    value: "Kaijia Zhu",
    path: "",
  },
  {
    key: "profession",
    address: "0x7fa5",
    value: "Software Engineer",
    path: "",
  },
  {
    key: "projects",
    address: "0x7fa3",
    value: "Side Projects",
    path: "/projects",
  },
  {
    key: "blogs",
    address: "0x7fa2",
    value: "kaijia.xyz",
    path: "https://roverkai.github.io",
  },
  {
    key: "chat_with_me",
    address: "0x7fb1",
    value: "hallo",
    path: "/chatWithMe"
  }
];

const getAddressFromKey = (key: string) =>
  memoryMap.find((item) => item.key === key)?.address;

export {getAddressFromKey, memoryMap};
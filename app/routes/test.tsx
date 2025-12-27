import StackItem from "../components/StackItem";
import type { StackRef } from "~/types/StackItem";
import PageTransition from "~/components/PageTransition";
const memoryMap: StackRef[] = [
  {
    key: "name",
    address: "0x7fa1",
    value: "Kaijia Zhu",
    path: "/about",
  },
  {
    key: "blogs",
    address: "0x7fa2",
    value: "kaijia.xyz",
    path: "/blogs",
  },
  {
    key: "projects",
    address: "0x7fa3",
    value: "Side Projects",
    path: "/projects",
  },
];

const Test = () => {
  return (
    <PageTransition>
      <div className="flex font-mono gap-12">
        {/* Stack */}
        <div className="border p-4 w-48">
          <div className="mb-2 text-xs text-gray-500">Stack</div>

          {memoryMap.map((item) => (
            <StackItem key={item.key} item={item} />
          ))}
        </div>

        {/* Heap */}
        <div className="border p-4 w-96">
          <div className="mb-2 text-xs text-gray-500">Heap</div>
          <div className="text-xs text-gray-400">
            hover variable to inspect memory
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Test;

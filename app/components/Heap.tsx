import { getAddressFromKey } from "~/utils/MemoryModelUtil";
import type { ReactNode } from "react";

type HeapProps = {
  memoryMapKey: string,
  children: ReactNode,
}

const Heap = ({children, memoryMapKey}:HeapProps) => {
  return (
    <div className={`absolute h-full w-full p-4`}>
      <div className="text-xs text-gray-500 ">
        {getAddressFromKey(memoryMapKey)}
      </div>
      <div className="flex flex-col *:py-2 h-full">
        {children}
      </div>
    </div>
  );
};

export default Heap;

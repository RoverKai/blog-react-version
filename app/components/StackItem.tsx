import { useState } from "react";
import { useNavigate } from "react-router";
import type { StackRef } from "~/types/StackItem";

type StackItemProps = {
  item: StackRef;
};

function StackItem({ item }: StackItemProps) {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  return (
    <div
  onMouseEnter={() => setHover(true)}
  onMouseLeave={() => setHover(false)}
  onClick={() => navigate(item.path)}
  className="cursor-pointer mb-2 h-8"
>
  <div className="flex justify-between">
    <span>{item.key}</span>

    <span
      className={`
        text-gray-400 text-xs
        transition-all duration-300 ease-out
        ${hover
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-2 pointer-events-none"}
      `}
    >
      → {item.address}
    </span>
  </div>

  <div
    className={`
      ml-2 text-xs text-gray-500
      overflow-hidden
      transition-all duration-300 ease-out
      ${hover
        ? "opacity-100 max-h-20 translate-y-0"
        : "opacity-0 max-h-0 -translate-y-1"}
    `}
  >
    {item.value}
  </div>
</div>

  );
}

export default StackItem;

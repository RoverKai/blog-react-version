import { useState } from "react";
import { useNavigate } from "react-router";
import type { StackRef } from "~/types/StackItem";

type StackItemProps = {
  item: StackRef;
  onSelect?: (key: string) => void;
};

function StackItem({ item, onSelect }: StackItemProps) {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  const handleClick = () => {
    if ((item.key === 'blogs' || item.key === 'projects') && onSelect) {
      onSelect(item.key);
    } else {
      navigate(item.path);
    }
  };

  return (
    <div
  onMouseEnter={() => setHover(true)}
  onMouseLeave={() => setHover(false)}
  onClick={handleClick}
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

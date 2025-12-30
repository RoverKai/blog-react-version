import {
  useRef,
  useState,
  useLayoutEffect,
  type TransitionEventHandler,
} from "react";
import StackItem from "../components/StackItem";
import PageTransition from "~/components/PageTransition";
import { Link } from "react-router";
import { memoryMap } from "~/utils/MemoryModelUtil";
import Heap from "~/components/Heap";

const MemoryMap = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [transitionReady, setTransitionReady] = useState<boolean | null>(null);

  /** DOM refs */
  const inspectorRef = useRef<HTMLDivElement>(null);
  const blogRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);

  /** inspector 初始基准位置（只记录一次） */
  const basePosRef = useRef<{ left: number; top: number } | null>(null);

  const handleSelect = (key: string) => {
    setSelected((prev) => (prev === key ? null : key));
  };

  useLayoutEffect(() => {
    const inspector = inspectorRef.current;
    if (!inspector) return;

    if (!selected) {
      inspector.style.opacity = "0";
      return;
    }

    let target: HTMLElement | null = null;
    if (selected === "blogs") target = blogRef.current;
    if (selected === "projects") target = projectRef.current;
    if (!target) return;

    const rect = target.getBoundingClientRect();

    setTransitionReady(false);

    inspector.style.opacity = "1";
    inspector.style.top = `${rect.top}px`;
    inspector.style.left = `${rect.left}px`;
    inspector.style.width = `${rect.width}px`;
    inspector.style.height = `${rect.height}px`;
  }, [selected]);

  const handleTransitionEnd: TransitionEventHandler = (e) => {
    if (
      e.propertyName === "top" ||
      e.propertyName === "left" ||
      e.propertyName === "width" ||
      e.propertyName === "height"
    ) {
      setTransitionReady(true);
    }
  };

  return (
    <div className="relative h-full w-full flex justify-center items-center">
      <PageTransition>
        <div className="flex font-mono gap-12">
          {/* Stack */}
          <div className="border p-4 w-48">
            <div className="mb-2 text-xs text-gray-500">Stack</div>

            {memoryMap.map((item) => (
              <StackItem key={item.key} item={item} onSelect={handleSelect} />
            ))}
          </div>
        </div>

        {/* Inspector（唯一） */}
        <div
          onTransitionEnd={handleTransitionEnd}
          ref={inspectorRef}
          className="fixed top-0 left-0 border bg-white/80 backdrop-blur
            pointer-events-none transition-all duration-300 ease-out"
        />

        {/* Blog */}
        <div
          ref={blogRef}
          className={`absolute top-1/5 left-1/8 w-1/4 h-1/2
             ${selected === "blogs" ? "" : "hidden"}`}
        >
          <Heap memoryMapKey="blogs">
            <Link to={"https://roverkai.github.io/"}>git page</Link>
          </Heap>
        </div>

        {/* Project */}
        <div
          ref={projectRef}
          className={`absolute w-1/6 h-1/2 top-1/4 right-1/6 ${selected === "projects" ? "" : "hidden"}`}
        >
          <Heap memoryMapKey="projects">
            <Link to={"https://gitee.com/roverkai/same-wave"}>same-wave</Link>
            <Link to={"http://www.cshwxc.com"}>huiwang-material</Link>
          </Heap>
        </div>
      </PageTransition>
    </div>
  );
};

export default MemoryMap;
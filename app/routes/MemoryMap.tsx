import {
  useRef,
  useState,
  useLayoutEffect,
  type TransitionEventHandler,
  useEffect,
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
  const professionRef = useRef<HTMLDivElement>(null);

  const handleSelect = (key: string) => {
    setSelected((prev) => (prev === key ? null : key));
  };

  useLayoutEffect(() => {
    const inspector = inspectorRef.current;
    if (!inspector) return;

    inspector.style.opacity = "0";


    let target: HTMLElement | null = null;
    if (selected === "projects") target = projectRef.current;
    if (selected === "profession") target = professionRef.current;
    if (!target) return;

    setTransitionReady(false);

    const updateInspector = () => {
      const rect = target.getBoundingClientRect();
      inspector.style.opacity = "1";
      inspector.style.top = `${rect.top}px`;
      inspector.style.left = `${rect.left}px`;
      inspector.style.width = `${rect.width}px`;
      inspector.style.height = `${rect.height}px`;
    };

    updateInspector();

    const observer = new ResizeObserver(updateInspector);
    observer.observe(target);

    return () => observer.disconnect();
  }, [selected]);

  useEffect(() => {
    console.log(transitionReady);
  });

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

        {/* Inspector */}
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
          className={`absolute w-1/6 h-1/8 top-1/4 right-1/5 ${selected === "projects" ? "" : "hidden"}`}
        >
          <Heap memoryMapKey="projects">
            <Link to={"https://gitee.com/roverkai/same-wave"}>same-wave</Link>
            <Link to={"http://www.cshwxc.com"}>huiwang-material</Link>
          </Heap>
        </div>

        {/* profession */}
        <div
          ref={professionRef}
          className={`absolute left-2/5 bottom-1/6 h-1/8 w-1/4 ${selected === "profession" ? "" : "hidden"}`}
        >
          <Heap memoryMapKey="profession">
            <div className="flex justify-around h-full items-center *:cursor-pointer">
              <p>react</p>
              <p>vue</p>
              <p>java</p>
              <p>rust</p>
            </div>
          </Heap>
        </div>
      </PageTransition>
    </div>
  );
};

export default MemoryMap;

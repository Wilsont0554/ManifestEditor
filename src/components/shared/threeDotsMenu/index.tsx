import { useEffect, useRef, useState, type MouseEvent, useMemo } from "react";
import type { ReactNode } from "react";
import MenuList from "./MenuList";
import { twMerge } from "tailwind-merge";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Three dots button that toggles a popover menu
 */
export default function ThreeDotsMenuBtn({ children, className }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    /**
     * when the menu is open, listen for pointer events outside the menu to cloes it.
     * @param event 
     */
    function handlePointerDownOutside(event: PointerEvent) {
      if (
        wrapperRef.current && //menu wrapper is mounted
        !wrapperRef.current.contains(event.target as Node)  // the clicked element is not within the menu wrapper
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDownOutside);

    //clean up
    return () => {
      document.removeEventListener("pointerdown", handlePointerDownOutside);
    };
  }, [isOpen]);

  function toggleMenu(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen((open) => !open);
  }

  return (
    <div ref={wrapperRef} className={twMerge('relative', className)}>

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Open project actions"
        data-open={isOpen}
        onClick={toggleMenu}
        className="
          group/menu
          flex h-8 w-8 items-center justify-center
          rounded-full
          bg-white/65 backdrop-blur-md
          ring-1 ring-slate-900/10
          shadow-[0_2px_10px_-4px_rgb(15_23_42_/_0.35)]
          opacity-0 -translate-y-1 scale-95 pointer-events-none
          transition-all duration-100 ease-out
          group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto
          group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:pointer-events-auto
          data-[open=true]:opacity-100 data-[open=true]:translate-y-0 data-[open=true]:scale-100 data-[open=true]:pointer-events-auto
          data-[open=true]:bg-white data-[open=true]:ring-slate-900/25
          hover:bg-white hover:ring-slate-900/25 hover:-translate-y-px
          hover:shadow-[0_6px_18px_-6px_rgb(15_23_42_/_0.45)]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/40
          active:scale-95
        "
      >
        <span className="flex flex-col items-center gap-[3px]">
          <span className="block h-[3px] w-[3px] rounded-full bg-slate-700 transition-colors duration-150 group-hover/menu:bg-slate-900" />
          <span className="block h-[3px] w-[3px] rounded-full bg-slate-700 transition-colors duration-150 delay-[40ms] group-hover/menu:bg-slate-900" />
          <span className="block h-[3px] w-[3px] rounded-full bg-slate-700 transition-colors duration-150 delay-[80ms] group-hover/menu:bg-slate-900" />
        </span>
      </button>
      <MenuList isOpen={isOpen}>{children}</MenuList>
    </div>
  );
}

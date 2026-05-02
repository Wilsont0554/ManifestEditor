import type { MouseEvent, ReactNode } from "react";

type Props = {
  tone?: "neutral" | "danger";
  onSelect: (...args: any[]) => void;
  children: ReactNode;
};

/**
 * A single row inside {@link ThreeDotsMenu}. 
 * @Props - tone: the color tone of the menu item, can be "neutral" or "danger"
 * @Props - onSelect: callback function when the menu item is selected
 * @Props - children: the content of the menu item
 * @returns a menu item component to be rendered within the ThreeDotsMenu component
 */
export default function MenuItem(props: Props) {
  const { tone = "neutral", onSelect, children } = props;
  
  function handleClick(event: MouseEvent<HTMLLIElement>) {
    event.preventDefault();
    event.stopPropagation();
    onSelect();
  }
  const toneClasses =
    tone === "danger"
      ? "text-red-600 hover:bg-red-50 hover:text-red-700"
      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900";

  return (
    <li
      role="menuitem"
      onClick={handleClick}
      className={`
        block w-full px-3 py-1.5 text-left text-[13px] font-medium tracking-tight
        transition-colors duration-150
        ${toneClasses}
      `}
    >
      {children}
    </li>
  );
}
import { ReactNode, useEffect, useState } from "react";

type props = {
  children?: ReactNode;
  className?: string;
  label: string;
  labelClassName?: string;
  labelContainerClassName?: string;
  openState?: boolean;
  setOpenState?: (open: boolean) => void;
};

export default function DropDownField({
  children,
  className,
  label,
  labelClassName,
  labelContainerClassName
}: props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={`${className}`}>
      <button
        className={`
          flex items-center justify-between w-full 
          hover:text-slate-950
          ${isOpen ? "text-slate-950" : "text-slate-500"}
          ${labelContainerClassName}
          `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <label
          className={`block text-lg ${labelClassName}`}
        >
          {label}
        </label>
        {!isOpen ? (
          <svg
            version="1.2"
            xmlns="http://www.w3.org/2000/svg"
            overflow="visible"
            preserveAspectRatio="none"
            viewBox="0 0 24 24"
            width="1.5em"
            height="1.5em"
            style={{ transform: "rotate(180deg)", transition: "transform 0.3s" }}
          >
            <path
              d="M8.12 9.29 12 13.17l3.88-3.88a.996.996 0 1 1 1.41 1.41l-4.59 4.59a.996.996 0 0 1-1.41 0L6.7 10.7a.996.996 0 0 1 0-1.41c.39-.38 1.03-.39 1.42 0z"
              fill="currentColor"
            ></path>
          </svg>
        ) : (
          <svg
            version="1.2"
            xmlns="http://www.w3.org/2000/svg"
            overflow="visible"
            preserveAspectRatio="none"
            viewBox="0 0 24 24"
            width="1.5em"
            height="1.5em"
            style={{ transform: "rotate(0deg)", transition: "transform 0.3s" }}
          >
            <path
              d="M8.12 9.29 12 13.17l3.88-3.88a.996.996 0 1 1 1.41 1.41l-4.59 4.59a.996.996 0 0 1-1.41 0L6.7 10.7a.996.996 0 0 1 0-1.41c.39-.38 1.03-.39 1.42 0z"
              fill="currentColor"
            ></path>
          </svg>
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-screen" : "max-h-0"}`}
      >
      <hr className="my-2 border-t border-slate-300" />
      {children}
      </div>
    </section>
  );
}
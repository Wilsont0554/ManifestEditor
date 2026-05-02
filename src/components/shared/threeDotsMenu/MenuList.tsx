type Props = {
    isOpen: boolean;
    children?: React.ReactNode;
}

/**
 * Tooltip-style popover menu that floats below the three dots button
 */
export default function MenuList(props: Props) {
  const { isOpen, children } = props;
  return (
    <ul
      role="menu"
      data-open={isOpen}
      className="
        absolute right-0 top-[calc(100%+10px)]
        min-w-[9.5rem] origin-top-right
        rounded-lg border border-slate-200/80 bg-white/95 backdrop-blur-md
        shadow-[0_16px_36px_-12px_rgb(15_23_42_/_0.32)]
        py-1
        transition-all duration-200 ease-out
        data-[open=false]:opacity-0
        data-[open=false]:-translate-y-1
        data-[open=false]:scale-95
        data-[open=false]:pointer-events-none
      "
    >
      <span
        aria-hidden="true"
        className="absolute -top-[5px] right-3 h-2 w-2 rotate-45 rounded-[1px] border-l border-t border-slate-200/80 bg-white"
      />
      {children}
    </ul>
  );
}



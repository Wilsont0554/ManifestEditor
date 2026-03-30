import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type SoftActionButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
>;

function SoftActionButton({
  children,
  className = "",
  type = "button",
  ...props
}: SoftActionButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center gap-2 rounded-md bg-rose-50 px-4 py-2 text-base font-medium text-rose-600 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default SoftActionButton;

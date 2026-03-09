function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full min-w-56 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:shadow-[0_0_0_3px_rgba(148,163,184,0.25)] ${className}`}
      {...props}
    />
  );
}

export default Input;

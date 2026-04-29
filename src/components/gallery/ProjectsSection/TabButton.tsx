type Props = {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
};

/**
 * Vertical sidebar tab button for projects section.
 * @param active whether this tab is currently selected
 * @param label the visible tab name
 * @param count number to display in the badge (padded to 2 digits)
 * @param onClick handler fired when the user activates the tab
 */
export default function TabButton({ active, label, count, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative -ml-px flex w-full items-center justify-between border-l-2 py-2 pl-4 pr-3 text-sm transition-all ${
        active
          ? "border-slate-900 font-semibold text-slate-950"
          : "border-transparent font-medium text-slate-500 hover:border-slate-300 hover:text-slate-800"
      }`}
    >
      <span>{label}</span>
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums transition-colors ${
          active
            ? "bg-slate-900 text-white"
            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
        }`}
      >
        {String(count).padStart(2, "0")}
      </span>
    </button>
  );
}

import ManifestField from "../editors/manifest/shared/manifest-field"

type props = {
  data: string[] | number[];
  selected: string | number;
  label: string;
  onSelect: (value: string | number) => void;
  className?: string;
  buttonClassName?: string;
  isHorizontal?: boolean;
}

export default function DataSelection({ data, selected, onSelect, className, buttonClassName, isHorizontal }: props) {
    return (
          <ul className={`
            w-full 
            flex items-center
            ${isHorizontal ? "flex-row" : "flex-col"}
            border my-3 border-slate-400 text-base text-slate-900 
            focus:border-pink-500 focus:outline-none
            ${className}`}>
            {data.map((item) => (
              <button
                key={item}
                value={item}
                onClick={() => onSelect(item)}
                className={`
                  cursor-pointer
                  ${selected === item ? 'bg-white text-gray-900' : 'hover:bg-gray-100 bg-gray-200 text-gray-500' }
                  flex-1 w-full text-center px-3 py-1.5 border-slate-400
                  ${isHorizontal ? "border-r" : "border-b"}
                  last:border-0
                  ${buttonClassName}
                `}
              >
                {item}
              </button>
            ))}
          </ul>
    )
}
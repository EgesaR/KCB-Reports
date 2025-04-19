import { useState, useEffect, useRef } from "react";

interface MultiSelectProps {
  options: { value: string; title: string }[];
  placeholder?: string;
  onChange: (values: string[]) => void;
}

export default function MultiSelect({
  options,
  placeholder = "Select options",
  onChange,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    setSelected(newSelected);
    onChange(
      options
        .filter((option) => newSelected.includes(option.value))
        .map((opt) => opt.title)
    );
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="border border-neutral-300 dark:border-neutral-500 rounded p-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.length > 0
          ? options
              .filter((option) => selected.includes(option.value))
              .map((opt) => opt.title)
              .join(", ")
          : placeholder}
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-500 rounded shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer ${
                selected.includes(option.value)
                  ? "bg-gray-200 dark:bg-neutral-600"
                  : ""
              }`}
              onClick={() => toggleOption(option.value)}
            >
              {option.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

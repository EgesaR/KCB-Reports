import React, { useState, useMemo, useRef, useEffect } from "react";

interface Option {
  value: string;
  title: string;
  type?: string;
  color?: string;
  Icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: Option[];
  placeholder?: string;
  onChange?: (values: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  placeholder = "Search...",
  onChange,
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null); // Reference to the entire component

  // Close the dropdown when clicking or focusing outside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false); // Close the dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter options based on the search query
  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, options]);

  // Handle selection changes
  const handleSelect = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value) // Remove selection
      : [...selectedValues, value]; // Add selection

    setSelectedValues(newValues);

    if (onChange) {
      onChange(newValues); // Notify the parent component of the change
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md"
      tabIndex={-1} // Makes the component focusable
    >
      {/* Search bar with selected tags */}
      <div
        className="relative ps-2 pe-6 min-h-11.5 flex items-center flex-wrap w-full border border-gray-700 rounded-lg bg-gray-800 text-start text-sm text-gray-300 focus-within:border-blue-500 focus-within:ring-blue-500 p-2"
        onClick={() => setDropdownOpen(true)}
      >
        {selectedValues.map((value) => {
          const option = options.find((opt) => opt.value === value);
          return (
            <div
              key={value}
              className={`flex items-center px-2 py-1 mr-1 mb-1 rounded-full border ${
                option?.color || "border-gray-500 text-gray-300"
              }`}
            >
              {option?.Icon && (
                <option.Icon className={`text-lg mr-2 ${option?.color}`} />
              )}
              <span className={`text-sm font-medium ${option?.color}`}>
                {option?.title}
              </span>
              <button
                className="ml-2 text-sm hover:text-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(value);
                }}
              >
                &times;
              </button>
            </div>
          );
        })}
        <input
          type="text"
          placeholder={placeholder}
          className="flex-grow bg-transparent border-none focus:ring-0 outline-none text-sm text-gray-300 placeholder-gray-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Dropdown options */}
      {dropdownOpen && (
        <div className="absolute mt-2 z-50 w-full max-h-72 p-1 bg-gray-900 border border-gray-700 rounded-lg overflow-y-auto shadow-lg">
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className={`flex items-center py-2 px-4 text-sm cursor-pointer hover:bg-gray-700 rounded-lg ${
                option.disabled ? "opacity-50 pointer-events-none" : ""
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.Icon && (
                <option.Icon className={`text-lg mr-2 ${option.color}`} />
              )}
              <div>
                <div
                  className={`font-semibold ${option.color || "text-gray-300"}`}
                >
                  {option.title}
                </div>
                {option.type && (
                  <div className="text-xs text-gray-500">{option.type}</div>
                )}
              </div>
              {selectedValues.includes(option.value) && (
                <span className="ml-auto text-blue-400 font-semibold">✔</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;

import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Input = ({ type = "text", label, name = "" }) => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const validateInput = (value) => {
    if (type === "email") {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }
    if (type === "password") {
      // Password must be at least 6 characters
      return value.length >= 6;
    }
    return true; // For text fields, assume valid
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    setIsValid(validateInput(inputValue));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-full mb-6 relative">
      <input
        type={type === "password" && showPassword ? "text" : type}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full h-[42px] border rounded-lg px-2 outline-0 bg-transparent peer transition-all duration-300 ${
          isValid === false ? "border-red-500" : "border-gray-400"
        }`}
        name={name}
        required
      />
      <label
        className={`absolute left-2 bg-white text-gray-400 pointer-events-none text-base px-1 transition-transform duration-300 transform ${
          isFocused || value
            ? "-translate-y-2 text-sm"
            : "translate-y-[35%]"
        }`}
      >
        {label}
      </label>

      {/* Password visibility toggle */}
      {type === "password" && (
        <div className="absolute right-2 top-0 translate-y-[10%] text-gray-500">
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="text-gray-500 p-2 rounded-full"
          >
            {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
          </button>
        </div>
      )}

      {/* Validation messages */}
      {isValid === false && (
        <p className="text-red-500 text-xs mt-1">
          {type === "email"
            ? "Invalid email format"
            : type === "password"
            ? "Password must be at least 6 characters"
            : "Invalid input"}
        </p>
      )}
      {isValid && value && (
        <p className="text-green-500 text-xs mt-1">Valid {type}!</p>
      )}
    </div>
  );
};

export default Input;

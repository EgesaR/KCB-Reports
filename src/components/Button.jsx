import React, { useState } from 'react';

function Button({ children, className = '', onClick = () => {}, type = 'button' }) {
  const [ripples, setRipples] = useState([]);

  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = { id: Date.now(), x, y, size };
    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation ends
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 400);
  };

  return (
    <button
      type={type}
      className={`relative overflow-hidden text-sm font-medium ${className}`}
      onClick={(e) => {
        createRipple(e);
        onClick(e); // Safely call the onClick prop
      }}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-gray-400 opacity-50 animate-ripple"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
    </button>
  );
}

export default Button;

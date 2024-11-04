// input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Add any additional props if needed
}

export const Input: React.FC<InputProps> = React.forwardRef<HTMLInputElement, InputProps>(
  ({ ...props }, ref) => {
    return <input ref={ref} {...props} />;
  }
);

Input.displayName = 'Input'; // Optional, but good for debugging


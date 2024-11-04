// src/components/ui/checkbox.tsx

import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;  // Ensure you have this to label the checkbox
  className?: string; // Add className as an optional prop
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, className, ...props }) => {
  return (
    <label className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        {...props}
        className="mr-2" // Style for checkbox
      />
      {label}
    </label>
  );
};

export  {Checkbox};

// "@/components/ui/input.tsx"
"use client";

import React from "react";

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props}
      className={`border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${props.className ?? ""}`}
    />
  );
};

export default Input;
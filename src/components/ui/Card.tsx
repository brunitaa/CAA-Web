import React from "react";
interface CardProps {
  title?: string;
  value?: string | number;
  children?: React.ReactNode;
  className?: string;
}

export default function Card({
  title,
  value,
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-3xl shadow-2xl p-10 sm:p-12 ${className}`}
    >
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      {value !== undefined && (
        <p className="text-2xl font-bold mb-2">{value}</p>
      )}
      {children}
    </div>
  );
}

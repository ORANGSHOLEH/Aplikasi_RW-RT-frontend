"use client";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  disabled?: boolean;
}

export function Tooltip({ children, content, disabled = false }: TooltipProps) {
  if (disabled) return <>{children}</>;

  return (
    <div className="relative group">
      {children}
      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
        {content}
      </div>
    </div>
  );
}
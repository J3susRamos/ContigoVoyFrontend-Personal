import { ReactNode } from "react";

const ActionButton = ({
  onClick,
  icon,
  label,
  variant = "default"
}: {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  variant?: "default" | "primary" | "danger";
}) => {
  const variantClasses = {
    default: "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200",
    primary: "text-primary dark:text-[#bbbafe] hover:text-primary/80 dark:hover:text-[#bbbafe]/80",
    danger: "text-[#B158FF] hover:text-[#B158FF]/80"
  };

  return (
    <button
      className={`
        flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl 
        hover:bg-gray-50 dark:hover:bg-gray-800/50 
        transition-all duration-200 transform hover:scale-105 active:scale-95
        min-w-[80px] sm:min-w-[90px]
        ${variantClasses[variant]}
      `}
      onClick={onClick}
    >
      <div className="w-6 h-6 sm:w-7 sm:h-7 mb-1 sm:mb-2">
        {icon}
      </div>
      <span className="text-xs sm:text-sm font-medium">
        {label}
      </span>
    </button>
  );
};

export default ActionButton;
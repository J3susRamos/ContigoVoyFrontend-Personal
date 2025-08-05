import { useState, useMemo } from "react";
import { UserRole, ViewKey, BUTTON_CONFIGS, ROLE_PERMISSIONS } from "../types";

export default function useStadistics() {
  const [view, setView] = useState<ViewKey>("clientes");
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewLoading, setIsViewLoading] = useState(false);

  const allowedViews = useMemo(() => {
    return userRole ? ROLE_PERMISSIONS[userRole] : [];
  }, [userRole]);

  const visibleButtons = useMemo(() => {
    return BUTTON_CONFIGS.filter(btn => allowedViews.includes(btn.key));
  }, [allowedViews]);

  const handleViewChange = async (viewKey: ViewKey) => {
    if (allowedViews.includes(viewKey)) {
      setIsViewLoading(true);
      setView(viewKey);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsViewLoading(false);
    }
  };

  const getButtonClasses = (isActive: boolean) => {
    const baseClasses = "w-full md:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap shadow h-10 md:h-11 text-sm md:text-base font-semibold rounded-full px-4 md:px-8 py-2 transition-all duration-200 ease-in-out transform hover:scale-105";

    return isActive
      ? `${baseClasses} bg-white dark:bg-background text-primary dark:text-primary-foreground shadow-lg border-2 border-primary/20`
      : `${baseClasses} bg-transparent text-white dark:text-white hover:bg-white/10 dark:hover:bg-white/5 hover:text-white border-2 border-transparent hover:border-white/20`;
  };

  return {
    view,
    setView,
    userRole,
    setUserRole,
    dateRange,
    setDateRange,
    isLoading,
    setIsLoading,
    isViewLoading,
    allowedViews,
    visibleButtons,
    handleViewChange,
    getButtonClasses,
  };
}
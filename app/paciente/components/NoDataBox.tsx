export const NoDataBox = ({ info }: { info: string }) => {
  return (
    <div className="space-y-3 shadow-[inset_0_4px_6px_rgba(0,0,0,0.3)] content-center text-center py-2 bg-slate-200 dark:bg-slate-800   dark:text-gray-200 rounded-md h-20">
      {info}
    </div>
  );
};

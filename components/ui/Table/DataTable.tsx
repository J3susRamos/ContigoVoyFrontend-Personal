import React from "react";

interface DataTableProps<T> {
  headers: React.ReactNode[];
  data: T[];
  renderRow: (item: T) => React.ReactNode;
  renderCard?: (item: T) => React.ReactNode;
}

const DataTable = <T,>({
  headers,
  data,
  renderRow,
  renderCard,
}: DataTableProps<T>) => {
  return (
    <>
      <div className="hidden lg:block">
        <table
          className={`max-w-screen-2xl mx-auto w-full border-separate border-spacing-y-4 px-8 mt-5`}
        >
          <thead>
            <tr className="bg-[#6265f4] text-white h-12 text-center">
              <th className="py-3 pl-9 text-2xl font-light rounded-tl-full">
                O
              </th>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`font-normal text-lg px-4 py-3 ${
                    index === headers.length - 1 ? "rounded-tr-full" : ""
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-center text-[#7269ff] text-base font-normal">
            {data.map((item, index) => (
              <tr
                key={index}
                className="bg-white text-[#624ae3] text-lg rounded-full shadow-sm hover:bg-gray-50 transition-all cursor-pointer dark:bg-[#272627] dark:text-[#fefffe]"
              >
                {renderRow(item)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {renderCard && (
        <div className="lg:hidden p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#262727] rounded-lg shadow-md border border-gray-200 dark:border-border hover:shadow-lg transition-shadow duration-200"
              >
                {renderCard(item)}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default DataTable;

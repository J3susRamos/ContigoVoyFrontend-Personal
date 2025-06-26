import React from "react";

interface DataTableProps<T> {
  headers: React.ReactNode[];
  data: T[];
  renderRow: (item: T) => React.ReactNode;
}

const DataTable = <T,>({ headers, data, renderRow }: DataTableProps<T>) => {
  return (
    <table
      className={`max-w-screen-2xl mx-auto w-full border-separate border-spacing-y-4 px-8 mt-5`}
    >
      <thead>
        <tr className="bg-[#6265f4] text-white h-12 text-center">
          <th className="py-3 pl-9 text-2xl font-light rounded-tl-full">O</th>
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
  );
};

export default DataTable;

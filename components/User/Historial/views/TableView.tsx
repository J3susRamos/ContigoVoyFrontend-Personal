"use client";
import { ListaAtencion } from "@/interface";
import ActionButton from "../buttons/ActionButton";

interface TableProps {
  atencion: ListaAtencion[];
  headerColumns: { name: string; uid: string; sortable?: boolean }[];
  renderCellAction: (atencion: ListaAtencion, columnKey: keyof ListaAtencion | string) => React.ReactNode;
}

// Componente para la vista de tabla (desktop)
const TableView: React.FC<{
  atencion: ListaAtencion[];
  headerColumns: TableProps['headerColumns'];
  renderCellAction: TableProps['renderCellAction'];
  onVerMas: (item: ListaAtencion) => void;
}> = ({ atencion, headerColumns, renderCellAction, onVerMas }) => (
  <div className="w-full max-w-6xl mx-auto px-4">
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-4 min-w-[800px]">
        <thead>
          <tr>
            {headerColumns.map((column, index) => (
              <th
                key={column.uid}
                className={`
                  text-white font-medium text-base lg:text-lg text-center py-4 px-3
                  ${index === 0 ? 'rounded-l-2xl' : ''}
                  ${index === headerColumns.length - 1 ? 'rounded-r-2xl' : ''}
                `}
                style={{ background: "#7367F0" }}
              >
                {column.name}
              </th>
            ))}
            <th className="w-40 bg-transparent"></th>
          </tr>
        </thead>
        <tbody>
          {atencion.map((item, index) => (
            <tr key={index} className="group">
              {headerColumns.map((column, idx) => (
                <td
                  key={column.uid}
                  className={`
                    bg-white text-[#634AE2] font-medium text-sm lg:text-base text-center align-middle py-6 px-3 
                    transition-all duration-200 group-hover:shadow-lg
                    ${idx === 0 ? 'rounded-l-2xl' : ''}
                    ${idx === headerColumns.length - 1 ? 'rounded-r-2xl' : ''}
                  `}
                  style={{
                    boxShadow: "0 2px 12px rgba(99,74,226,0.08)",
                  }}
                >
                  {renderCellAction(item, column.uid)}
                </td>
              ))}
              <td className="text-center align-middle">
                <ActionButton item={item} onClick={() => onVerMas(item)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TableView;
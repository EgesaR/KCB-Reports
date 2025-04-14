import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any) => string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
}

export default function DataTable<T>({
  data,
  columns,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
    >
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="p-4 font-medium text-gray-600 dark:text-gray-300"
              >
                {col.label}
              </th>
            ))}
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <motion.tr
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="p-4 text-gray-800 dark:text-gray-200"
                >
                  {col.render
                    ? col.render(item[col.key])
                    : String(item[col.key])}
                </td>
              ))}
              <td className="p-4 flex gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  <FaTrash />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

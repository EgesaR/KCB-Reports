import Badge from "~/components/Badge";
import { motion } from "framer-motion"
import { useNavigate } from "@remix-run/react";
const Reports = () => {
  return (
    <div className="w-full h-screen text-white pt-12">
      <h1 className="text-3xl">Reports</h1>
      <ReportsLayout />
    </div>
  );
};

const ReportsLayout = () => {
  return (
    <table className="w-full table-auto mt-10 divide-y divide-gray-200 dark:divide-neutral-700">
      <thead>
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
          >
            Name
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
          >
            Age
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
          >
            Status
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <ReportBtn />
        <ReportBtn />
        <ReportBtn />
        <ReportBtn />
      </tbody>
    </table>
  );
};
const ReportBtn = () => {
  const navigate = useNavigate()
  return (
    <motion.tr
      className="hover:bg-gray-100 dark:hover:bg-neutral-700"
      whileTap={{ scale: 0.99 }}
      transition={{ ease: "easeInOut", duration: 0.2 }}
      onClick={() => navigate("/dashboard/reports/1")}
     >
      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
        <div className="flex gap-4 items-center">
          <label
            className="w-8 h-8 rounded-lg text-xs grid place-content-center
                 bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500
                 transition-colors duration-200"
          >
            EOT
          </label>
          <label className="text-[14px] font-semibold">
            End Of Term Examination
          </label>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
        45
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
        <Badge color="green">In progress</Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
        <button
          type="button"
          className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400"
        >
          Delete
        </button>
      </td>
    </motion.tr>
  );
}
export default Reports;

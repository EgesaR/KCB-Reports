import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const WatchBoard = () => {
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const baseURL = `http://${window.location.hostname}:5000`;

  // WebSocket for real-time system metrics
  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.hostname}:5000`);
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === 'systemMetrics') {
        setMetrics(data.data);
      }
    };
    return () => ws.close();
  }, []);

  // Fetch logs
  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseURL}/blockers/watch/logs`);
        setLogs(response.data.logs);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [baseURL]);

  // Table columns
  const columns = [
    {
      name: 'Request',
      selector: (row) => `${row.method} ${row.url}`,
      sortable: true,
    },
    {
      name: 'Response',
      selector: (row) => row.response,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${
            row.status >= 200 && row.status < 300
              ? 'bg-green-500 text-white'
              : row.status >= 400
              ? 'bg-red-500 text-white'
              : 'bg-yellow-500 text-black'
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      name: 'Timestamp',
      selector: (row) => new Date(row.timestamp).toLocaleString(),
      sortable: true,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-8">Performance Dashboard</h1>

      {/* System Metrics */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">System Metrics</h2>
        {metrics ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
          >
            {/* CPU Usage */}
            <div className="mb-4">
              <p className="mb-2 text-sm font-semibold">CPU Usage:</p>
              <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
                <motion.div
                  className="h-full bg-green-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${metrics.cpuUsage * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="mt-1 text-sm">{(metrics.cpuUsage * 100).toFixed(2)}%</p>
            </div>

            {/* Memory Usage */}
            <div className="mb-4">
              <p className="mb-2 text-sm font-semibold">Memory Usage:</p>
              <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: '0%' }}
                  animate={{
                    width: `${
                      ((metrics.totalMemory - metrics.freeMemory) / metrics.totalMemory) * 100
                    }%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="mt-1 text-sm">
                {(
                  ((metrics.totalMemory - metrics.freeMemory) / metrics.totalMemory) *
                  100
                ).toFixed(2)}
                %
              </p>
            </div>
          </motion.div>
        ) : (
          <p>Loading metrics...</p>
        )}
      </div>

      {/* Logs Table */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Request and Response Logs</h2>
        {isLoading ? (
          <p>Loading logs...</p>
        ) : (
          <DataTable
            columns={columns}
            data={logs}
            pagination
            striped
            responsive
            theme="light"
          />
        )}
      </div>
    </div>
  );
};

export default WatchBoard;

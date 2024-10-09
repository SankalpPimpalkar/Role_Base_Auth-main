import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";
import axios from "axios";
import convertISOToDate from "../../utils/formatDate";

const OrdersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Set the number of items per page

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = filteredTransactions.filter(
      (transaction) =>
        transaction._id.toLowerCase().includes(term) ||
        transaction.customer.toLowerCase().includes(term)
    );
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `http://localhost:4000/api/expense/getExpense`,
        {
          withCredentials: true,
        }
      );

      if (response.data) {
        setFilteredTransactions(response.data?.Expenses);
        console.log(response.data);
      }
    })();
  }, []);

  // Calculate current transactions for the current page
  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Transaction History
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Transaction..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Txn ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                SubHead
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Download Voucher
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Download Notesheet
              </th>
            </tr>
          </thead>

          <tbody className="divide divide-gray-700">
            {currentTransactions.map((transaction) => (
              <motion.tr
                key={transaction?._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {transaction?._id.slice(0, 10)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {convertISOToDate(transaction?.updatedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {transaction?.subHead}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  ₹ {parseInt(transaction?.total).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.status === "verified"
                        ? "bg-green-100 text-green-800"
                        : transaction.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : transaction.status === "approved"
                        ? "bg-blue-100 text-blue-800"
                        : transaction.status === "completed"
                        ? "bg-purple-100 text-purple-800"
                        : transaction.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800" // Default case if status does not match
                    }`}
                  >
                    {transaction?.status}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button className="text-indigo-400 hover:text-indigo-300 mr-2">
                    <Eye size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          className={`px-4 py-2 text-white bg-blue-600 rounded ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div className="text-gray-400">
          Page {currentPage} of {totalPages}
        </div>
        <button
          className={`px-4 py-2 text-white bg-blue-600 rounded ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default OrdersTable;

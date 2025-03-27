import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const ShowExpense = () => {
  const { backendUrl, token, slotDateFormat, expenseData, setExpenseData } = useContext(AppContext);
  const { projectId } = useParams();

  const [selectedImage, setSelectedImage] = useState(null); // To store the selected image URL
  const [imageModalOpen, setImageModalOpen] = useState(false); // To control the image modal visibility
  const [updateExpense, setUpdateExpense] = useState(null); // For update modal
  const [searchQuery, setSearchQuery] = useState(''); // For search bar
  const [totalExpense, setTotalExpense] = useState(0); // Total expense state

  const [updatedData, setUpdatedData] = useState([]); // Updated history data

  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [image, setImage] = useState(null);

  // Fetch expense data
  const getExpenseData = async (projectId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/expense-data',
        { projectId },
        { headers: { token } }
      );
      if (data.success) {
        setExpenseData(data.expenses);

        // Calculate total expense
        const total = data.expenses.reduce((acc, expense) => acc + Number(expense.totalPayment), 0);
        setTotalExpense(total);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch updated expense history
  const getUpdatedExpense = async (expenseId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/updatedData',
        { expenseId },
        { headers: { token } }
      );
      if (data.success) {
        setUpdatedData(data.updatedHistory);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle "Update" click
  const handleUpdate = (expense) => {
    setUpdateExpense(expense); // Open update modal with selected expense data
  };

  // Handle search
  const filteredExpenses = expenseData.filter(
    (expense) =>
      expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update expense
  const updateButton = async (expenseId, e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('expenseId', expenseId);
    formData.append('amount', amount);
    formData.append('entryDate', entryDate);
    formData.append('paymentMethod', paymentMethod);

    if (image) {
      formData.append('image', image);
    }

    try {
      const { data } = await axios.post(backendUrl + '/api/update-expense', formData, { headers: { token } });
      if (data.success) {
        toast.success(data.message);
        getExpenseData(projectId); // Refresh expense data
        setUpdateExpense(null); // Close the modal
        setAmount('');
        setEntryDate('');
        setPaymentMethod('');
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch expense data on component mount
  useEffect(() => {
    if (token && projectId) {
      getExpenseData(projectId);
    }
  }, [token, projectId]);

  // Calculate total expense whenever expenseData changes
  useEffect(() => {
    if (expenseData && expenseData.length > 0) {
      const total = expenseData.reduce((acc, expense) => acc + Number(expense.totalPayment), 0);
      setTotalExpense(total);
    }
  }, [expenseData]);

  return (
    <div className="container mx-auto p-4 min-h-[80vh]">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Expense List</h2>

      {/* Total Expense */}
      <div className="mt-5 mb-5 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-blue-100">
        <p className="text-lg font-medium text-gray-700 flex items-center justify-between">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Total Expense:
          </span>
          <span className="text-lg font-bold text-blue-600 bg-white px-4 py-2 rounded-lg shadow-inner">
            ${totalExpense.toFixed(2)}
          </span>
        </p>
      </div>
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Expense Table */}
      <div className="overflow-x-auto min-h-[70vh] max-h-[70vh] overflow-y-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deposited Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredExpenses.reverse().map((expense, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{expense.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{expense.category}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{expense.phoneNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-700">$ {expense.amount}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{`$${expense.totalPayment - expense.amount}`}</td>
                <td className="px-6 py-4 text-sm text-gray-700">$ {expense.totalPayment}</td>
                <td className="flex flex-col gap-2 px-6 py-4 text-sm">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    onClick={() => handleUpdate(expense)}
                  >
                    <span>Update</span>
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    onClick={() => getUpdatedExpense(expense._id)}
                  >
                    <span>Updated History</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {updateExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Update Expense</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Deposited Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Entry Date</label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">select payment method</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Credit Card</option>
                  <option value="Online">UPI</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                onClick={(e) => updateButton(updateExpense._id, e)}
              >
                Update
              </button>
            </form>
            <button
              className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              onClick={() => setUpdateExpense(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}


      {/* Update History Modal */}
      {updatedData.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 overflow-y-auto max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-800">Update History</h3>
            </div>

            {/* Table for Update History */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deposited Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {updatedData.map((update, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">${update.amount}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{update.paymentMethod}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {slotDateFormat(new Date(update.entryDate).toLocaleDateString())}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {update.image && (
                          <button
                            className="text-blue-500 hover:text-blue-700 underline focus:outline-none"
                            onClick={() => {
                              setSelectedImage(update.image);
                              setImageModalOpen(true);
                            }}
                          >
                            Show Image
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Close Button */}
            <div className="p-6 border-t border-gray-200">
              <button
                className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors focus:outline-none"
                onClick={() => setUpdatedData([])}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Image Modal */}
      {imageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-800">Image Preview</h3>
            </div>
            <div className="p-6">
              <img
                src={selectedImage}
                alt="Update"
                className="rounded-lg w-full h-auto shadow-sm"
              />
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors focus:outline-none"
                onClick={() => setImageModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowExpense;

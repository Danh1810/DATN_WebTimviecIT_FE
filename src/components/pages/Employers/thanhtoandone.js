import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../services/axios";
import { useNavigate } from "react-router-dom";

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get("/lstt/detail", {
          params: { id: id },
        }); // URL API để lấy dữ liệu); // Adjust the URL to your API endpoint
        console.log("🚀 ~ fetchTransaction ~ response:", response);
        setTransaction(response.data); // Assuming you are fetching only one transaction for this example
      } catch (error) {
        console.error("There was an error fetching the transaction!", error);
      }
    };

    fetchTransaction();
  }, []);
  const handleButtonClick = () => {
    navigate("/ntd/muabaidang");
  };
  if (!transaction) {
    return <div>Loading...</div>;
  }
  console.log("🚀 ~ TransactionHistory ~ transaction:", transaction);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transaction Details</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Employer
          </label>
          <div className="mt-1 text-gray-900">
            {transaction.employer ? transaction.employer.name : "N/A"}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Type
          </label>
          <div className="mt-1 text-gray-900">{transaction.loaiThanhtoan}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <div className="mt-1 text-gray-900">{transaction.trangthai}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <div className="mt-1 text-gray-900">{transaction.sotien}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Date
          </label>
          <div className="mt-1 text-gray-900">
            {new Date(transaction.Ngaythanhtoan).toLocaleDateString()}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <div className="mt-1 text-gray-900">{transaction.Soluongmua}</div>
        </div>
      </div>
      <button
        onClick={handleButtonClick}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Click Me
      </button>
    </div>
  );
};

export default TransactionHistory;

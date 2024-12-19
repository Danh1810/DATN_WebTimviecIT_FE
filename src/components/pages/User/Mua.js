import React, { useState, useEffect } from "react";
import axios from "../../services/axios";

const Thanhtoan = () => {
  const id = localStorage.getItem("id");
  const [formData, setFormData] = useState({
    id: id,
    sotien: "",
    soluong: "",
    goimua: "",
  });
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const defaultPrice = 100000;
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    if (name === "soluong") {
      // Tính toán số tiền dựa trên số lượng
      newFormData.sotien = value * defaultPrice;
    }

    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Make the POST request to the backend
      const response = await axios.post(
        "/create_payment_url", // Full backend URL
        formData,
        { withCredentials: true } // Include credentials (if cookies/session are used)
      );
      console.log("🚀 ~ handleSubmit ~ response:", response);

      // Check the response for the payment URL
      if (response.paymentUrl) {
        console.log("Redirecting to:", response.paymentUrl);
        window.location.href = response.paymentUrl; // Redirect to VNPay URL
      } else {
        setError("Failed to initiate payment. Please try again.");
      }
    } catch (error) {
      // Log error for debugging and display user-friendly message
      console.error("Error during payment initiation:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred while processing your request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded shadow-md"
    >
      <div>
        <label className="block font-semibold mb-1">Số lượng</label>
        <input
          type="number"
          name="soluong"
          value={formData.soluong}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Nhập số lượng"
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Số tiền</label>
        <input
          type="number"
          name="sotien"
          value={formData.sotien}
          readOnly
          className="w-full p-2 border rounded bg-gray-100"
          placeholder="Số tiền sẽ tự động tính"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Chọn gói mua</label>
        <select
          name="goimua"
          value={formData.goimua}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-gray-50"
        >
          <option value="" disabled>
            -- Chọn gói mua --
          </option>
          <option value="goi3">Gói Nộp hồ sơ</option>
        </select>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? "Đang xử lý..." : "Thanh toán"}
      </button>
    </form>
  );
};

export default Thanhtoan;

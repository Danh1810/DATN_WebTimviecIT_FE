import React, { useState, useEffect } from "react";
import axios from "../../services/axios";

const RegisterForm = () => {
  const id = localStorage.getItem("id");
  const [formData, setFormData] = useState({
    id: id,
    sotien: "",
    soluong: "",
    MaTT: "",
    goimua: "",
  });
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchPaymentTypes = async () => {
    try {
      const response = await axios.get("/thanhtoan");
      setPaymentTypes(response.data);
    } catch (error) {
      console.error("Error fetching payment types:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("thanhtoan/create", formData);
      const { data } = response;

      if (data.code === 0) {
        // Redirect to MoMo payment URL
        window.location.href = data.data.payUrl || data.data.redirectUrl;
      } else {
        setError("Failed to initiate payment. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while processing payment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentTypes();
  }, []);

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
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Nhập số tiền"
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
          <option value="goi1">Gói 1</option>
          <option value="goi2">Gói 2</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">
          Chọn phương thức thanh toán
        </label>
        <div className="bg-gray-100 shadow-md p-4 rounded-lg space-y-2">
          {paymentTypes.length === 0 ? (
            <div className="text-center text-gray-500">
              Không có phương thức thanh toán khả dụng.
            </div>
          ) : (
            paymentTypes.map((hs) => (
              <div
                key={hs.id}
                className="flex justify-between items-center p-2 border rounded-lg"
              >
                <div>{hs.ten}</div>
                <input
                  type="radio"
                  name="MaTT"
                  value={hs.id}
                  onChange={handleChange}
                  className="cursor-pointer"
                />
              </div>
            ))
          )}
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? "Đang xử lý..." : "Đăng"}
      </button>
    </form>
  );
};

export default RegisterForm;

import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function PaymentTypeManagement() {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [newPaymentType, setNewPaymentType] = useState({ ten: "" });

  // Fetch payment types from the backend
  const fetchPaymentTypes = async () => {
    try {
      const response = await axios.get("/thanhtoan");
      setPaymentTypes(response.data);
    } catch (error) {
      console.error("Error fetching payment types:", error);
    }
  };

  useEffect(() => {
    fetchPaymentTypes();
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular");
    doc.setFontSize(18);
    doc.text("Payment Type List", 14, 20);
    doc.setFontSize(12);

    const headers = [["ID", "Payment Type Name"]];
    const rows = paymentTypes.map((type) => [type.id, type.ten]);

    doc.autoTable({
      head: headers,
      body: rows,
      startY: 30,
      theme: "striped",
      styles: {
        font: "Roboto-Regular",
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133], // Màu nền tiêu đề bảng
        textColor: 255,
        fontSize: 11,
        fontStyle: "bold",
      },
    });

    doc.save("payment_type_list.pdf");
  };

  // Handle input change for adding a new payment type
  const handleNewPaymentTypeChange = (e) => {
    setNewPaymentType({ ...newPaymentType, ten: e.target.value });
  };

  // Handle adding a new payment type
  const handleAddPaymentType = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/thanhtoan", newPaymentType);
      setPaymentTypes([...paymentTypes, response.data]);
      setNewPaymentType({ ten: "" });
    } catch (error) {
      console.error("Error adding payment type:", error);
      alert("Error adding payment type.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Thanh toán</h1>

      {/* Export to PDF Button */}
      <div className="text-right mb-4">
        <button
          onClick={exportToPDF}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export to PDF
        </button>
      </div>

      {/* Add New Payment Type Form */}
      <form
        onSubmit={handleAddPaymentType}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">Thêm thanh toán</h2>
        <div>
          <label className="block font-semibold mb-1">Tên thanh toán </label>
          <input
            type="text"
            name="ten"
            value={newPaymentType.ten}
            onChange={handleNewPaymentTypeChange}
            className="w-full p-2 border rounded"
            placeholder="Enter payment type name"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        >
          Thêm
        </button>
      </form>

      {/* Payment Types Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Tên thanh toán</th>
            </tr>
          </thead>
          <tbody>
            {paymentTypes.map((type) => (
              <tr key={type.id} className="border-b">
                <td className="px-4 py-2">{type.id}</td>
                <td className="px-4 py-2">{type.ten}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentTypeManagement;

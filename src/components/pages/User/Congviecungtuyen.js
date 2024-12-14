import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Form, Link } from "react-router-dom"; // Import Link for routing
import { SignalWifiStatusbarNull } from "@mui/icons-material";

function JobApplicationForm() {
  const id = localStorage.getItem("id");
  const [applications, setApplications] = useState([]);
  const [ph, setph] = useState(null);

  const [hoso, sethoso] = useState([]);

  const fetchhoso = async () => {
    try {
      const response = await axios.get("/Ut/ntv", { params: { id: id } });
      console.log("🚀 ~ fetchhoso ~ response:", response.data);
      const hoso = response.data; // Safely access the nested `hoso` array
      sethoso(hoso);
    } catch (error) {
      console.error("Error fetching CV data:", error);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular");
    doc.setFontSize(18);
    doc.text("Application List", 14, 20);
    doc.setFontSize(12);

    const headers = [["ID", "Job ID", "Employer ID", "Date", "File"]];
    const rows = applications.map((app) => [
      app.id,
      app.MaTTD,
      app.MaNTV,
      new Date(app.NgayNop).toLocaleDateString(),
      app.file ? "Yes" : "No",
    ]);

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
    doc.save("application_list.pdf");
  };
  const Xemphanhoi = (id) => {
    const ph = hoso.find((hs) => hs.id === id)?.ungtuyen11;
    console.log("🚀 ~ Xemphanhoi ~ ph:", ph);

    setph(ph);
  };

  useEffect(() => {
    fetchhoso();
    // fetchJobPosts();
    // fetchEmployers();
    // fetchApplications();
  }, []);

  return (
    <div className="container mx-auto p-4  min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Công việc đã Ứng tuyển
      </h2>
      <div className="bg-white-100 p-4 rounded">
        <table className="table-auto w-full text-left">
          <thead>
            <tr className="text-gray-600 font-medium">
              <th className="px-4 py-2">Tên Công Việc</th>
              <th className="px-4 py-2">Tên hồ sơ đã nộp</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2">Phản hồi</th>
            </tr>
          </thead>
          <tbody>
            {hoso.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-4 text-center text-gray-500 bg-gray-50"
                >
                  Bạn chưa ứng tuyển công việc nào
                </td>
              </tr>
            ) : (
              hoso.map((hs) => (
                <tr
                  className="text-gray-800 hover:bg-gray-50 transition"
                  key={hs.id}
                >
                  <td className="border-t px-4 py-3">{hs.UT_TTD.tieude}</td>
                  <td className="border-t px-4 py-3">{hs.UT_NTV.tenhoso}</td>
                  <td className="border-t px-4 py-3">{hs.trangthai}</td>
                  <td className="border-t px-4 py-3">
                    <button
                      onClick={() => Xemphanhoi(hs.id)}
                      className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                    >
                      Xem phản hồi
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Separate Modal Component */}
        {ph && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Phản hồi
              </h3>
              {ph.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Bạn chưa nhận được phản hồi nào
                </p>
              ) : (
                ph.map((pho) => (
                  <div
                    key={pho.id}
                    className="mb-3 p-3 bg-gray-50 rounded-lg text-gray-700"
                  >
                    <p className="mb-2">{pho.noiDung}</p>
                    <p className="text-sm text-gray-500">
                      Ngày: {new Date(pho.ngayPhanHoi).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
              <button
                onClick={() => setph(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setph(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobApplicationForm;

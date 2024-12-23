import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
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
      console.log("🚀 ~ fetchhoso ~ hoso:", hoso[0].UT_TTD);
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
  const [downloading, setDownloading] = useState(null);

  const handleDownload = async (cloudinaryUrl, fileName) => {
    try {
      setDownloading(fileName);
      // For Cloudinary URLs, we can use them directly
      window.open(cloudinaryUrl, "_blank");
      setDownloading(null);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Không thể tải xuống file. Vui lòng thử lại sau.");
      setDownloading(null);
    }
  };

  // Extract filename from Cloudinary URL
  const getFileName = (cloudinaryUrl) => {
    try {
      const urlParts = cloudinaryUrl.split("/");
      const fileNameWithExtension = urlParts[urlParts.length - 1];
      return fileNameWithExtension.split(".")[0]; // Remove extension if present
    } catch {
      return "file";
    }
  };
  const Xemphanhoi = (id) => {
    console.log("🚀 ~ Xemphanhoi ~ id:", id);
    const ph = hoso.find((hs) => hs.id === id);
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
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative flex flex-col max-h-[90vh]">
              {/* Header - Fixed */}
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-800">
                  Phản hồi
                </h3>
                <button
                  onClick={() => setph(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                  aria-label="Đóng"
                >
                  ✕
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                {ph.ungtuyen11.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Bạn chưa nhận được phản hồi nào
                  </p>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      <p className="text-gray-800 font-medium">
                        Nhà tuyển dụng: {ph.UT_TTD?.employer?.ten || "N/A"}
                      </p>
                      <p className="text-gray-800 font-medium">
                        SDT liên hệ: {ph.UT_TTD?.employer?.sdt || "N/A"}
                      </p>
                      <p className="text-gray-800 font-medium">Các phản hồi</p>
                    </div>

                    <div className="space-y-4">
                      {ph.ungtuyen11.map((item, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg text-gray-700 border border-gray-100"
                        >
                          <div
                            className="mb-2"
                            dangerouslySetInnerHTML={{
                              __html: item.noiDung || "Thông tin không có sẵn.",
                            }}
                          />

                          <p className="text-sm text-gray-500">
                            Ngày:{" "}
                            {new Date(item.ngayPhanHoi).toLocaleDateString()}
                          </p>

                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-600">
                              File phản hồi
                            </label>
                            <p className="text-gray-900">
                              {item.filedinhkem ? "Có" : "Không"}
                            </p>

                            {item.filedinhkem && (
                              <button
                                onClick={() =>
                                  window.open(item.filedinhkem, "_blank")
                                }
                                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                              >
                                Xem
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Footer - Fixed */}
              <div className="p-6 border-t">
                <div className="flex justify-end">
                  <button
                    onClick={() => setph(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobApplicationForm;

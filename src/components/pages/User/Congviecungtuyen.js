import React, { useState, useEffect } from "react";
import axios from "../../services/axios";

function JobApplicationForm() {
  const id = localStorage.getItem("id");
  const [hoso, setHoso] = useState([]);
  const [ph, setPh] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  const fetchHoso = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/Ut/ntv", { params: { id } });
      setHoso(response.data);
      setError(null);
    } catch (error) {
      setError("Error fetching data. Please try again.");
      console.error("Error fetching CV data:", error);
    } finally {
      setLoading(false);
    }
  };

  const Xemphanhoi = (id) => {
    const ph = hoso.find((hs) => hs.id === id);
    setPh(ph);
  };

  useEffect(() => {
    fetchHoso();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = hoso.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(hoso.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
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
            {currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-4 text-center text-gray-500 bg-gray-50"
                >
                  Bạn chưa ứng tuyển công việc nào
                </td>
              </tr>
            ) : (
              currentItems.map((hs) => (
                <tr
                  className="text-gray-800 hover:bg-gray-50 transition"
                  key={hs.id}
                >
                  <td className="border-t px-4 py-3">
                    {hs.UT_TTD?.tieude || "N/A"}
                  </td>
                  <td className="border-t px-4 py-3">
                    {hs.UT_NTV?.tenhoso || "N/A"}
                  </td>
                  <td className="border-t px-4 py-3">
                    {hs.trangthai || "N/A"}
                  </td>
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

        {/* Pagination */}
        {hoso.length > itemsPerPage && (
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Modal */}
        {ph && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative flex flex-col max-h-[90vh]">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-800">
                  Phản hồi
                </h3>
                <button
                  onClick={() => setPh(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {!ph.ungtuyen11?.length ? (
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
                          {item.filedinhkem && (
                            <div className="mt-3">
                              <button
                                onClick={() =>
                                  window.open(item.filedinhkem, "_blank")
                                }
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                              >
                                Xem file đính kèm
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="p-6 border-t">
                <div className="flex justify-end">
                  <button
                    onClick={() => setPh(null)}
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

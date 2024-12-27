import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Luucongviec = () => {
  const id = localStorage.getItem("id");
  const [jobSeekers, setJobSeekers] = useState([]);
  const [lcv, setlcv] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const fetchJobSeekers = async () => {
    try {
      const response = await axios.get("/ngtviec");
      setJobSeekers(response.data);
    } catch (error) {
      console.error("Error fetching job seekers:", error);
    }
  };

  const fetchJobPosts = async () => {
    try {
      const response = await axios.get("/tintd");
      setJobPosts(response.data);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };

  const fetchlcv = async () => {
    try {
      const response = await axios.get("/ngtviec/lcv", { params: { id: id } });
      const lcv = response.data[0]?.LCV_NTV || [];
      setlcv(lcv);
    } catch (error) {
      console.error("Error fetching CV data:", error);
    }
  };

  const XoaTinTD = async (id) => {
    try {
      await axios.delete("/lcv", {
        params: { id: id },
      });
      toast.success("Xóa thành công");
      fetchlcv();
    } catch (error) {
      toast.error(`Lỗi xóa: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchlcv();
    fetchJobSeekers();
    fetchJobPosts();
  }, []);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = lcv.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(lcv.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <div className="container mx-auto p-4 min-h-screen">
        {currentItems.map((item) => {
          const jobPost = jobPosts.find((rec) => rec.id === item.MaTTD);
          if (!jobPost) return null;

          return (
            <Link key={jobPost.id} to={`/tintuyendung/${jobPost.id}`}>
              <div className="border rounded-lg p-4 mb-4 shadow-md flex items-center justify-between hover:shadow-lg transition-shadow">
                <div className="flex items-start">
                  <div className="mr-4">
                    <img
                      src={jobPost.employer?.logo || "/default-logo.png"}
                      alt="Company Logo"
                      className="w-12 h-12 object-contain rounded"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">
                      {jobPost.tieude || "Không có tiêu đề"}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {jobPost.employer?.ten || "Tên nhà tuyển dụng không có"}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <span className="mr-4">
                        💰{" "}
                        <span className="font-medium">
                          {jobPost.mucluong || "Thỏa thuận"}
                        </span>
                      </span>
                      <span className="mr-4">
                        📍 {jobPost.diaChiLamviec || "Địa chỉ không có"}
                      </span>
                      <span>
                        📅{" "}
                        {jobPost.Ngayhethan
                          ? new Date(jobPost.Ngayhethan).toLocaleDateString()
                          : "Không xác định"}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      XoaTinTD(item.id);
                    }}
                    className="flex items-center text-red-500 hover:text-red-600 font-medium"
                  >
                    ❤️ Hủy lưu
                  </button>
                </div>
              </div>
            </Link>
          );
        })}

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-2 border border-gray-300 text-sm font-medium ${
                  currentPage === number
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(lcv.length / itemsPerPage)}
              className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Luucongviec;

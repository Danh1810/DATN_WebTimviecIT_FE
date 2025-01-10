import React, { useState, useEffect, useCallback } from "react";
import axios from "../../services/axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// Constants
const ITEMS_PER_PAGE = 5;
const DEFAULT_LOGO = "/default-logo.png";

// Separate JobCard component
const JobCard = ({ jobPost, onDelete, itemId }) => {
  const handleDelete = (e) => {
    e.preventDefault();
    onDelete(itemId);
  };

  return (
    <Link to={`/tintuyendung/${jobPost.id}`}>
      <div className="border rounded-lg p-4 mb-4 shadow-md flex items-center justify-between hover:shadow-lg transition-shadow">
        <div className="flex items-start">
          <div className="mr-4">
            <img
              src={jobPost.employer?.logo || DEFAULT_LOGO}
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
        <button
          onClick={handleDelete}
          className="flex items-center text-red-500 hover:text-red-600 font-medium"
        >
          ❤️ Hủy lưu
        </button>
      </div>
    </Link>
  );
};

// Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-4">
      <nav className="inline-flex rounded-md shadow">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Trước
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
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
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Sau
        </button>
      </nav>
    </div>
  );
};

const Luucongviec = () => {
  const id = localStorage.getItem("id");
  const [jobPosts, setJobPosts] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchJobPosts = useCallback(async () => {
    try {
      const [jobPostsRes, savedJobsRes] = await Promise.all([
        axios.get("/tintd"),
        axios.get("/ngtviec/lcv", { params: { id } }),
      ]);

      setJobPosts(jobPostsRes.data);
      setSavedJobs(savedJobsRes.data[0]?.LCV_NTV || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    }
  }, [id]);

  const handleDelete = async (itemId) => {
    try {
      await axios.delete("/lcv", { params: { id: itemId } });
      toast.success("Xóa thành công");
      fetchJobPosts();
    } catch (error) {
      toast.error("Không thể xóa. Vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    fetchJobPosts();
  }, [fetchJobPosts]);

  // Pagination logic
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = savedJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(savedJobs.length / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto p-4 min-h-screen">
      {currentItems.map((item) => {
        const jobPost = jobPosts.find((job) => job.id === item.MaTTD);
        if (!jobPost) return null;

        return (
          <JobCard
            key={jobPost.id}
            jobPost={jobPost}
            onDelete={handleDelete}
            itemId={item.id}
          />
        );
      })}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Luucongviec;

import React, { useState, useEffect } from "react";
import axios from "../services/axios";
import { Logout } from "../services/auth/logout";
import { logout } from "../slice/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function Example() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const userid = localStorage.getItem("id");
  const auth = useSelector((state) => state.auth);
  console.log("🚀 ~ Example ~ auth:", auth.isAuth);

  const handleSearchcv = () => {
    if (keyword.trim()) {
      // Điều hướng tới trang /results và truyền từ khóa qua query parameter
      navigate(`/ser?keyword=${keyword}`);
    }
  };
  const [formData, setFormData] = useState({
    MaTTD: "",
    Userid: "",
  });

  const handleSearch = async (id) => {
    if (!auth.isAuth) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    const dataToSend = {
      MaTTD: id,
      Userid: userid,
    };

    console.log("🚀 ~ handleSearch ~ Data to send:", dataToSend);

    try {
      const response = await axios.post("/lcv", dataToSend, {
        headers: {
          "Content-Type": "application/json", // Set header to handle JSON payload
        },
      });
      toast.success("Lưu thành công"); // Notify success
      fetchJobPosts(); // Reload the job posts
      console.log("🚀 ~ handleSearch ~ response:", response.data);
    } catch (error) {
      console.error("🚀 ~ handleSearch ~ error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      toast.error(`Lỗi duyệt: ${errorMessage}`);
    }
  };

  const [employers, setEmployers] = useState([]);
  const fetchEmployers = async () => {
    try {
      const response = await axios.get("/nhatd");
      console.log("🚀 ~ fetchEmployers ~ response:", response);
      setEmployers(response.data);
    } catch (error) {
      console.error("Error fetching employers:", error);
    }
  };

  const [jobPosts, setJobPosts] = useState([]);
  const fetchJobPosts = async () => {
    try {
      const response = await axios.get("/tintd");
      console.log("🚀 ~ fetchJobPosts ~ response:", response.data);
      setJobPosts(response.data);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const itemsPerPage = 8; // Number of items per page

  // Calculate total pages
  const totalPages = Math.ceil(jobPosts.length / itemsPerPage);

  // Get the items for the current page
  const currentItems = jobPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    fetchEmployers();
    fetchJobPosts();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center h-[25vh] from-teal-100 via-teal-300 to-teal-500  bg-gray-400	">
        <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-xl flex items-center space-x-4 p-4">
          {/* Search Input */}
          <div className="flex items-center w-full">
            <input
              className="block w-full h-12 appearance-none bg-transparent text-lg text-gray-700 placeholder:text-gray-400 focus:outline-none sm:text-lg sm:leading-6 border border-gray-300 rounded-l-md px-4"
              placeholder="Tìm kiếm công việc"
              aria-label="Search components"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          {/* Search Button */}
          <div className="ml-4">
            <button
              onClick={handleSearchcv}
              className="w-48 h-12 px-10 text-white bg-pink-500 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <a className="text-3xl font-semibold leading-6 text-blue-900">
          VIỆC LÀM TỐT NHẤT
        </a>
      </div>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 bg-slate-100 lg:max-w-7xl lg:px-8">
          {/* Job Post Grid */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {currentItems.map((product) => (
              <Link
                key={product.id}
                to={`/tintuyendung/${product.id}`} // URL dẫn đến trang chi tiết
                className={`group border border-gray-300 rounded-lg p-4 flex flex-col ${
                  product.noibat === true
                    ? "bg-red-100 border-red-500"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start ">
                  <div className="flex justify-center items-center w-24 h-24 bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
                    <img
                      src={product.employer.logo} // Đường dẫn logo công ty
                      alt="Company Logo"
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <button
                    className="text-gray-400 hover:text-blue-500"
                    aria-label="Save Job"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent link navigation when clicking the button
                      handleSearch(product.id); // Pass the product ID to the function
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                      />
                    </svg>
                  </button>
                </div>

                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {product.tieude}
                </h3>
                <p className="mt-2 text-sm text-gray-700">
                  {product.employer.diachi}
                </p>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 px-4 py-2 border rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-6">Các công ty nổi bật</h2>

          <div className="flex space-x-4 overflow-x-auto scrollbar-custom scroll-smooth">
            {employers.map((company) => (
              <Link key={company.id} to={`/ct/${company.id}`}>
                <div className="bg-white shadow-md rounded-lg p-4 w-60 flex-shrink-0">
                  <img
                    src={company.logo}
                    alt={company.ten}
                    className="h-16 mx-auto mb-4"
                  />
                  <h3 className="text-center font-medium text-gray-800">
                    {company.ten}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-8 lg:px-10 bg-slate-200 rounded-lg shadow-md">
        <a className="text-3xl font-semibold leading-6 text-blue-900 block mb-8 text-center">
          VIỆC LÀM MỚI NHẤT
        </a>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobPosts.map((product) => (
            <Link key={product.id} to={`/tintuyendung/${product.id}`}>
              <div
                className={`border rounded-lg p-5 shadow-md ${
                  product.id === 3
                    ? "bg-red-100 border-red-500"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {product.tieude}
                  </h3>
                  {product.id === 3 && (
                    <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Nổi bật
                    </span>
                  )}

                  <button
                    className="text-gray-400 hover:text-blue-500"
                    aria-label="Save Job"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent link navigation when clicking the button
                      handleSearch(product.id); // Pass the product ID to the function
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center mb-3">
                  <img
                    src={product.employer.logo}
                    alt={`${product.employer.ten} logo`}
                    className="w-12 h-12 object-contain mr-3"
                  />
                  <p className="text-sm text-gray-600">
                    {product.employer.ten}
                  </p>
                </div>

                {/* <div className="flex items-center text-blue-600 font-medium text-lg mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                  aria-label="Salary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 1.75c3.5 0 6.25 2.75 6.25 6.25s-2.75 6.25-6.25 6.25S5.75 11.5 5.75 8 8.5 1.75 12 1.75z"
                  />
                </svg>
                {product.mucluong}
              </div> */}

                {/* <div className="flex items-center text-gray-600 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                  aria-label="Location"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 12l7.5 7.5L21 7.5"
                  />
                </svg>
                {product.diachi}
              </div> */}

                <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 mr-1"
                      aria-label="Days Left"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 12l7.5 7.5L21 7.5"
                      />
                    </svg>
                    {new Date(product.Ngayhethan).toLocaleDateString()}
                  </span>
                </div>

                {/* Skills/Tags Section */}
                <div className="flex flex-wrap gap-2">
                  {product.levels.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                    >
                      {skill.ten}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

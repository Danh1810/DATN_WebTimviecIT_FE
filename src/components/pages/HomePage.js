import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import SaveIcon from "@mui/icons-material/Save";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import { getJobpost } from "../services/jb.service";
import axios from "../services/axios";

const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const items = ["Da Nang", "Ha Noi", "HoChiMinh", "Can Tho"];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const products = [
    { name: "Theo Kỹ Năng" },
    { name: "Theo cấp bậc" },
    { name: "Theo địa điểm" },
    { name: "Integrations" },
    { name: "Automations" },
  ];

  const handleClickOutside = (event) => {
    if (
      event.target.closest("#dropdown-button") === null &&
      event.target.closest("#dropdown-menu") === null
    ) {
      setIsOpen(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const [employers, setEmployers] = useState([]);
  const fetchEmployers = async () => {
    try {
      const response = await axios.get("/nhatd");
      setEmployers(response.data);
    } catch (error) {
      console.error("Error fetching employers:", error);
    }
  };

  const [jobPosts, setJobPosts] = useState([]);
  const fetchJobPosts = async () => {
    try {
      const response = await axios.get("/tintd");
      setJobPosts(response.data);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };
  useEffect(() => {
    fetchEmployers();
    fetchJobPosts();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center h-[25vh] from-teal-100 via-teal-300 to-teal-500 bg-purple-700">
        <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-xl flex items-center space-x-4 p-4">
          {/* Search Input */}
          <div className="flex items-center w-full">
            <input
              className="block w-full h-12 appearance-none bg-transparent text-lg text-gray-700 placeholder:text-gray-400 focus:outline-none sm:text-lg sm:leading-6 border border-gray-300 rounded-l-md px-4"
              placeholder="Tìm kiếm công việc"
              aria-label="Search components"
              type="text"
            />
            <div className="relative">
              <button
                id="dropdown-button"
                onClick={toggleDropdown}
                aria-expanded={isOpen}
                className="inline-flex items-center w-64 px-4 h-12 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
              >
                <span className="mr-2">Địa điểm</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 ml-2 -mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div
                id="dropdown-menu"
                className={`absolute right-0 w-64 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1 ${
                  isOpen ? "" : "hidden"
                }`}
              >
                <input
                  id="dropdown-search-input"
                  className="block w-full px-4 py-2 text-gray-800 border rounded-md border-gray-300 focus:outline-none"
                  type="text"
                  placeholder="Search items"
                  autoComplete="off"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                {items
                  .filter((item) => item.toLowerCase().includes(searchTerm))
                  .map((item, index) => (
                    <a
                      key={index}
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md"
                    >
                      {item}
                    </a>
                  ))}
              </div>
            </div>
            <div className="relative">
              <button
                id="dropdown-button"
                onClick={toggleDropdown}
                aria-expanded={isOpen}
                className="inline-flex items-center w-64 px-4 h-12 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
              >
                <span className="mr-2">Địa điểm</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 ml-2 -mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div
                id="dropdown-menu"
                className={`absolute right-0 w-64 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1 ${
                  isOpen ? "" : "hidden"
                }`}
              >
                <input
                  id="dropdown-search-input"
                  className="block w-full px-4 py-2 text-gray-800 border rounded-md border-gray-300 focus:outline-none"
                  type="text"
                  placeholder="Search items"
                  autoComplete="off"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                {items
                  .filter((item) => item.toLowerCase().includes(searchTerm))
                  .map((item, index) => (
                    <a
                      key={index}
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md"
                    >
                      {item}
                    </a>
                  ))}
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="ml-4">
            <button className="w-48 h-12 px-10 text-white bg-pink-500 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <a className="text-3xl font-semibold leading-6 text-blue-900">
          {" "}
          VIỆC LÀM TỐT NHẤT
        </a>
      </div>

      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {jobPosts.map((product) => (
              <a
                key={product.id}
                className="group border border-gray-300 rounded-lg p-4"
              >
                <div className="flex justify-center items-center w-24 h-24 bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
                  <img
                    src={product.employer.logo} // Đường dẫn logo công ty
                    alt="Company Logo"
                    className="object-contain w-full h-full"
                  />
                </div>

                <h3 className="mt-1 text-lg font-medium text-gray-900">
                  {product.tieude}
                </h3>
                <p className="mt-4 text-sm text-gray-700">
                  {product.employer.diachi}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-6">Các công ty nổi bật</h2>

          <div className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth">
            {employers.map((company) => (
              <div
                key={company.id}
                className="bg-white shadow-md rounded-lg p-4 w-60 flex-shrink-0"
              >
                <img
                  src={company.logo}
                  alt={company.ten}
                  className="h-16 mx-auto mb-4"
                />
                <h3 className="text-center font-medium text-gray-800">
                  {company.ten}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-8 lg:px-10 bg-blue-500 rounded-lg shadow-md">
        <a className="text-3xl font-semibold leading-6 text-blue-900 block mb-8 text-center">
          VIỆC LÀM MỚI NHẤT
        </a>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobPosts.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-lg p-5 shadow-md bg-white"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {product.tieude}
                </h3>
                <button
                  className="text-gray-400 hover:text-blue-500"
                  aria-label="Save Job"
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
                      d="M3.75 12l7.5 7.5L21 7.5"
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
                <p className="text-sm text-gray-600">{product.employer.ten}</p>
              </div>

              <div className="flex items-center text-blue-600 font-medium text-lg mb-3">
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
              </div>

              <div className="flex items-center text-gray-600 mb-3">
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
              </div>

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
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/axios";

function App() {
  const [employers, setEmployers] = useState(null);
  const [jobPosts, setJobPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("company");
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/nhatd/id", { params: { id } });
        setEmployers(response.data || {});
        console.log("🚀 ~ fetchJobPosts ~ response:", response.data);
      } catch (error) {
        console.error("Error fetching employer data:", error);
      }
    };

    const fetchJobPosts = async () => {
      try {
        const response = await axios.get("/tintd/ntd/detail", {
          params: { id },
        });
        setJobPosts(response.data || []);
      } catch (error) {
        console.error("Error fetching job posts:", error);
      }
    };

    fetchData();
    fetchJobPosts();
  }, [id]);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Main Content */}
      <main className="container mx-auto flex flex-col lg:flex-row gap-6 mt-8">
        {/* Left Section */}
        <div className="flex-1">
          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <img
              src="https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages02.vietnamworks.com%2Fcompanyprofile%2Fbanner-default-company.png&w=1920&q=75"
              alt="Company Banner"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold">{employers?.ten || "N/A"}</h2>
              <p className="text-gray-600 mt-2">Brewing a Better Vietnam</p>
              <div className="mt-4 flex items-center space-x-4">
                <span className="text-gray-700">
                  {jobPosts.length} vị trí tuyển dụng
                </span>
                <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                  Theo dõi
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (Aside) */}
        <aside className="lg:w-1/3 bg-white shadow-md rounded-md p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Thông tin chung</h3>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li>
                <strong>Lĩnh vực:</strong> {employers?.linhvuc || "N/A"}
              </li>
              <li>
                <strong>Email:</strong> {employers?.email || "N/A"}
              </li>
              <li>
                <strong>Số điện thoại:</strong> {employers?.sdt || "N/A"}
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Thông tin liên hệ</h3>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li>
                <strong>Website:</strong>{" "}
                <a
                  href={employers?.website || "#"}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {employers?.website || "N/A"}
                </a>
              </li>
              <li>
                <strong>Địa chỉ:</strong> {employers?.diachi || "N/A"}
              </li>
            </ul>
          </div>
        </aside>
      </main>

      {/* Tab Section */}
      <div className="container mx-auto bg-white shadow-md rounded-md mt-8">
        {/* Tab Header */}
        <div className="flex border-b">
          {["company", "jobs"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-3 text-center font-semibold transition-colors duration-200 ${
                activeTab === tab
                  ? "text-red-500 border-b-2 border-red-500"
                  : "text-gray-700 hover:text-red-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "company" ? "Thông tin công ty" : "Vị trí tuyển dụng"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "company" ? (
            <div>
              <h3 className="text-xl font-bold mb-4">Về chúng tôi</h3>
              <p
                className="text-gray-700 "
                dangerouslySetInnerHTML={{
                  __html: employers?.thongtin || "Thông tin không có sẵn.",
                }}
              ></p>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold mb-4">Các vị trí tuyển dụng</h3>
              <ul className="space-y-4">
                {jobPosts.map((jb) => (
                  <li key={jb.id} className="border-b pb-4">
                    <h4 className="font-semibold">{jb.tieude}</h4>
                    <p className="text-gray-600">{jb.diaChiLamviec}</p>
                    <button className="mt-2 text-blue-500 hover:underline">
                      Xem chi tiết
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

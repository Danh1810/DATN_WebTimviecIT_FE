import React, { useState } from "react";

function JobDetails() {
  const [activeTab, setActiveTab] = useState("details");

  const similarJobs = [
    {
      title: "Front end ",
      company: "Công ty TNHH ABC",
      location: "Hà Nội",
      salary: "8 - 12 triệu",
      deadline: "10/11/2024",
    },
    {
      title: "Front end",
      company: "Công ty XYZ",
      location: "Đà Nẵng",
      salary: "10 - 15 triệu",
      deadline: "15/11/2024",
    },
    {
      title: "Front endp",
      company: "Công ty TNHH DEF",
      location: "TP. HCM",
      salary: "12 - 18 triệu",
      deadline: "20/11/2024",
    },
  ];

  return (
    <div className="p-6 bg-gray-50">
      {/* Main Container with Sidebar */}
      <div className="max-w-7xl mx-auto flex gap-8">
        {/* Main Content */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <nav className="flex space-x-6">
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-2 font-semibold ${
                  activeTab === "details"
                    ? "text-blue-600 border-b-4 border-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Chi tiết tuyển dụng
              </button>
              <button
                onClick={() => setActiveTab("company")}
                className={`pb-2 font-semibold ${
                  activeTab === "company"
                    ? "text-blue-600 border-b-4 border-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Công ty
              </button>
            </nav>
          </div>

          {activeTab === "details" ? (
            <>
              {/* Job Details Content */}
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Thông tin chung
              </h2>

              {/* Job Info Grid */}
              <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-lg">
                {/* Info Entries */}
                {[
                  { icon: "calendar", text: "Ngày đăng: 04/10/2024" },
                  { icon: "badge", text: "Cấp bậc: Intern" },
                  { icon: "user-group", text: "Số lượng tuyển: 2" },
                  {
                    icon: "briefcase",
                    text: "Hình thức làm việc: Toàn thời gian cố định",
                  },
                  { icon: "academic-cap", text: "Yêu cầu bằng cấp: Cao đẳng" },
                  { icon: "star", text: "Yêu cầu kinh nghiệm: 2 năm" },
                  {
                    icon: "office-building",
                    text: "Ngành nghề: Kỹ sư ITý",
                    colSpan: 2,
                  },
                ].map((entry, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 ${
                      entry.colSpan ? "col-span-2" : ""
                    }`}
                  >
                    <svg
                      className="w-5 h-5 text-purple-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 12h0"
                      />
                    </svg>
                    <span>{entry.text}</span>
                  </div>
                ))}
              </div>

              {/* Job Description */}
              <div className="mt-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Mô tả công việc
                </h2>
                <p className="text-gray-700">
                  - Lập sổ sách kế toán, báo cáo thuế hàng tháng, quý, báo cáo
                  tài chính, quyết toán năm cho các DN...
                  <br />
                  - Tư vấn cho khách hàng về cách hạch toán, cân đối, tư vấn
                  luật thuế...
                  <br />
                  - Khai báo thuế hàng tháng cho các Doanh nghiệp mà Cty đã ký
                  Hợp đồng
                  <br />
                  - Thống kê tổng hợp Lập sổ sách kế toán.
                  <br />- Tham gia thực hiện hồ sơ nghiệm thu, quyết toán.
                </p>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">
                  Nộp hồ sơ
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-400">
                  Lưu
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Company Info */}
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Thông tin công ty
              </h2>
              <p className="text-gray-700">
                Công ty TNHH Kế Toán Cát Tường là một công ty hàng đầu trong
                lĩnh vực IT tại TP.HCM.
              </p>
            </>
          )}

          {/* Action Buttons */}
        </div>

        {/* Similar Jobs Sidebar */}
        <aside className="w-64 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Việc làm tương tự
          </h3>
          {similarJobs.map((job, index) => (
            <div key={index} className="mb-4 p-3 border rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800">
                {job.title}
              </h4>
              <p className="text-sm text-gray-600">{job.company}</p>
              <p className="text-sm text-gray-600">Khu vực: {job.location}</p>
              <p className="text-sm text-gray-600">Mức lương: {job.salary}</p>
              <p className="text-sm text-gray-600">
                Hạn nộp hồ sơ: {job.deadline}
              </p>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

export default JobDetails;

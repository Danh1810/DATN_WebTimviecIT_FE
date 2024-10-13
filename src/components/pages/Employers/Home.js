import React, { useState } from 'react';

const Dashboard = () => {
  // State để quản lý mục được chọn (ví dụ: "Analytics")
  const [selectedMenu, setSelectedMenu] = useState('Overview');

  return (
    
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Nhà Tuyển Dụng</h2>
        </div>
        <nav className="mt-6">
          <a
            href="#"
            onClick={() => setSelectedMenu('Overview')}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${selectedMenu === 'Overview' ? 'bg-gray-700' : ''}`}
          >
            Overview
          </a>
          <a
            href="#"
            onClick={() => setSelectedMenu('Analytics')}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${selectedMenu === 'Analytics' ? 'bg-gray-700' : ''}`}
          >
            Analytics
          </a>
          <a
            href="#"
            onClick={() => setSelectedMenu('Reports')}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${selectedMenu === 'Reports' ? 'bg-gray-700' : ''}`}
          >
            Reports
          </a>
          <a
            href="#"
            onClick={() => setSelectedMenu('Settings')}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${selectedMenu === 'Settings' ? 'bg-gray-700' : ''}`}
          >
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4">
          <div className="flex justify-between">
            <h1 className="text-xl font-bold">{selectedMenu}</h1>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Add New Item
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Hiển thị bảng khi chọn Analytics */}
          {selectedMenu === 'Analytics' && (
            <div className="bg-white shadow-lg rounded-lg p-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Add New Item
            </button>
              <h2 className="text-lg font-semibold mb-4">Analytics Data</h2>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2">Metric</th>
                    <th className="py-2">Value</th>
                    <th className="py-2">Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">Visitors</td>
                    <td className="py-2">5,432</td>
                    <td className="py-2 text-green-500">+12%</td>
                  </tr>
                  <tr>
                    <td className="py-2">Revenue</td>
                    <td className="py-2">$9,876</td>
                    <td className="py-2 text-green-500">+8%</td>
                  </tr>
                  <tr>
                    <td className="py-2">Signups</td>
                    <td className="py-2">432</td>
                    <td className="py-2 text-red-500">-3%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Hiển thị các thẻ thông tin khi chọn Overview */}
          {selectedMenu === 'Overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white shadow-lg rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Users</h3>
                <p className="text-2xl font-bold">1,245</p>
                <p className="text-green-500">+12% from last month</p>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Revenue</h3>
                <p className="text-2xl font-bold">$12,456</p>
                <p className="text-green-500">+5% from last month</p>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Orders</h3>
                <p className="text-2xl font-bold">345</p>
                <p className="text-red-500">-3% from last month</p>
              </div>
            </div>
          )}

          {/* Hiển thị các nội dung khác dựa trên state */}
          {selectedMenu === 'Reports' && (
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Reports Data</h2>
              <p>Hiển thị dữ liệu báo cáo tại đây...</p>
            </div>
          )}
          {selectedMenu === 'Settings' && (
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Settings</h2>
              <p>Hiển thị cài đặt tại đây...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

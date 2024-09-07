
const DashboardPage = () => {
  return (
    

    <div className="flex h-screen">
    
      <div className="w-64 bg-blue-900 text-white">
        <div className="p-4 text-2xl font-bold">Dashboard</div>
        <ul>
          <li className="p-4 hover:bg-blue-700">
            <a href="#" className="block">
              Home
            </a>
          </li>
          <li className="p-4 hover:bg-blue-700">
            <a href="#" className="block">
              Profile
            </a>
          </li>
          <li className="p-4 hover:bg-blue-700">
            <a href="#" className="block">
              Settings
            </a>
          </li>
          <li className="p-4 hover:bg-blue-700">
            <a href="#" className="block">
              Logout
            </a>
          </li>
        </ul>
      </div>

      
      <div className="flex-1 flex flex-col">
      
        <header className="bg-white shadow p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600">Notifications</button>
              <button className="text-gray-600">Profile</button>
            </div>
          </div>
        </header>

    
        <main className="flex-1 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="bg-white p-4 shadow rounded-lg">
              <h2 className="text-xl font-bold mb-4">Users</h2>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 bg-gray-200 text-left">Name</th>
                    <th className="py-2 px-4 bg-gray-200 text-left">Email</th>
                    <th className="py-2 px-4 bg-gray-200 text-left">Role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">John Doe</td>
                    <td className="border px-4 py-2">john@example.com</td>
                    <td className="border px-4 py-2">Admin</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Jane Smith</td>
                    <td className="border px-4 py-2">jane@example.com</td>
                    <td className="border px-4 py-2">Editor</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Bob Johnson</td>
                    <td className="border px-4 py-2">bob@example.com</td>
                    <td className="border px-4 py-2">User</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white p-4 shadow rounded-lg">
              <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 bg-gray-200 text-left">Order ID</th>
                    <th className="py-2 px-4 bg-gray-200 text-left">Date</th>
                    <th className="py-2 px-4 bg-gray-200 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">#001</td>
                    <td className="border px-4 py-2">2024-08-10</td>
                    <td className="border px-4 py-2">Completed</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">#002</td>
                    <td className="border px-4 py-2">2024-08-09</td>
                    <td className="border px-4 py-2">Pending</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">#003</td>
                    <td className="border px-4 py-2">2024-08-08</td>
                    <td className="border px-4 py-2">Shipped</td>
                  </tr>
                </tbody>
              </table>
            </div>

           
            <div className="bg-white p-4 shadow rounded-lg">
              <h2 className="text-xl font-bold mb-4">Sales</h2>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 bg-gray-200 text-left">Product</th>
                    <th className="py-2 px-4 bg-gray-200 text-left">Quantity</th>
                    <th className="py-2 px-4 bg-gray-200 text-left">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">Product A</td>
                    <td className="border px-4 py-2">50</td>
                    <td className="border px-4 py-2">$500</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Product B</td>
                    <td className="border px-4 py-2">30</td>
                    <td className="border px-4 py-2">$300</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Product C</td>
                    <td className="border px-4 py-2">20</td>
                    <td className="border px-4 py-2">$200</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}



export default DashboardPage
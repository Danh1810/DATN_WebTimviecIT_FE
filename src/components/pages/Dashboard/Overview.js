const Overview = () => {
  return (
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
  );
};

export default Overview;

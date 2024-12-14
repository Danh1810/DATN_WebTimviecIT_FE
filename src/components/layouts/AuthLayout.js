function Layout({ children }) {
  return (
    <div>
      <nav className="bg-purple-700 text-white flex items-center justify-between p-4">
        <div
          onClick={() => (window.location.href = "/home")}
          className="flex items-center space-x-4"
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREfsesMJwwXL8130hzXhA8LtGBG1HMN6lKLA&s"
            alt="Company Logo"
            className="h-8"
          />
          <span className="text-xl font-bold">Việc Làm IT</span>
        </div>
      </nav>
      {children}
    </div>
  );
}

export default Layout;

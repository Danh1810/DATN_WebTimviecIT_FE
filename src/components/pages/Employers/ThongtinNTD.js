import React, { useState, useEffect } from "react";
import axios from "../../services/axios";

function EmployerManagement() {
  const id = localStorage.getItem("id");
  console.log("🚀 ~ ProfileForm ~ id:", id);
  const [previewImage, setPreviewImage] = useState(null);
  const [employer, setEmployer] = useState({
    ten: "",
    email: "",
    sdt: "",
    diachi: "",
    website: "",
    linhvuc: "",
    logo: "",
    MaND: id,
  });

  const [employers, setEmployers] = useState(null);
  const [availableMaNDs, setAvailableMaNDs] = useState([]);
  const [isEditing, setIsEditing] = useState(true); // Tracks edit/view mode

  //   const fetchEmployers = async () => {
  //     try {
  //       const response = await axios.get("/nhatd");
  //       setEmployers(response.data);
  //     } catch (error) {
  //       console.error("Error fetching employers:", error);
  //     }
  //   };

  //   const fetchMaNDs = async () => {
  //     try {
  //       const response = await axios.get("/nguoidung");
  //       setAvailableMaNDs(response.data);
  //     } catch (error) {
  //       console.error("Error fetching MaND options:", error);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchEmployers();
  //     fetchMaNDs();
  //   }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployer((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setEmployer((prev) => ({ ...prev, [name]: files[0] }));
      setPreviewImage(URL.createObjectURL(files[0]));
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/nhatd/detail", {
          params: { id: id },
        });

        if (!response.data || Object.keys(response.data).length === 0) {
          setEmployers(null);
        } else {
          setEmployers(response.data);
        }
      } catch (error) {
        console.error(error); // Gửi lỗi đi
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields before submitting
    if (!employer.ten || !employer.email || !employer.sdt) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    // Create a FormData object to handle multipart/form-data
    const formDataToSend = new FormData();
    formDataToSend.append("ten", employer.ten);
    formDataToSend.append("email", employer.email);
    formDataToSend.append("sdt", employer.sdt);
    formDataToSend.append("diachi", employer.diachi);
    formDataToSend.append("linhvuc", employer.linhvuc);
    formDataToSend.append("logo", employer.logo); // Assuming logo is a file (if it's a URL, it can be directly appended as string)
    formDataToSend.append("website", employer.website);
    formDataToSend.append("MaND", id);

    try {
      // Send the form data via a POST request
      const response = await axios.post("/nhatd", formDataToSend);

      // Handle successful response and update the state
      console.log("Employer added successfully:", response.data);
      setEmployers(response.data.data);

      // Reset the form state
      setEmployer({
        ten: "",
        email: "",
        sdt: "",
        diachi: "",
        website: "",
        linhvuc: "",
        logo: "",
      });

      // Switch to view mode after saving
      setIsEditing(false);
    } catch (error) {
      // Log and handle the error
      console.error("Error adding employer:", error);

      // Display a user-friendly error message
      alert(
        error.response?.data?.message ||
          "Đã xảy ra lỗi khi thêm nhà tuyển dụng. Vui lòng thử lại!"
      );
    }
  };
  console.log("employers", employers);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Thông tin nhà tuyển dụng
      </h1>

      <div className="text-right mb-4"></div>
      {!employers ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="mb-6 flex flex-col items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden border mb-4">
              <img
                src={
                  previewImage ||
                  employer.logo ||
                  "https://res.cloudinary.com/dlxczbtva/image/upload/v1704720124/oneweedshop/vcgfoxlfcoipwxywcimv.jpg"
                }
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="file"
              name="logo"
              onChange={handleFileChange}
              className="text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-1">
                Tên nhà tuyển dụng
              </label>
              <input
                type="text"
                name="ten"
                value={employer.ten}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Nhập tên"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={employer.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Nhập email"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Số điện thoại</label>
              <input
                type="text"
                name="sdt"
                value={employer.sdt}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Địa chỉ</label>
              <input
                type="text"
                name="diachi"
                value={employer.diachi}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Website</label>
              <input
                type="text"
                name="website"
                value={employer.website}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Link website"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Lĩnh vực</label>
              <input
                type="text"
                name="linhvuc"
                value={employer.linhvuc}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Link website"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Lưu
          </button>
        </form>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6 flex flex-col items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden border mb-4">
              <img
                src={
                  employers.logo ||
                  "https://res.cloudinary.com/dlxczbtva/image/upload/v1704720124/oneweedshop/vcgfoxlfcoipwxywcimv.jpg"
                }
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-1">
                Tên nhà tuyển dụng
              </label>
              <p className="w-full p-2 border rounded bg-gray-100">
                {employers.ten || "Chưa nhập"}
              </p>
            </div>
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <p className="w-full p-2 border rounded bg-gray-100">
                {employers.email || "Chưa nhập"}
              </p>
            </div>
            <div>
              <label className="block font-semibold mb-1">Số điện thoại</label>
              <p className="w-full p-2 border rounded bg-gray-100">
                {employers.sdt || "Chưa nhập"}
              </p>
            </div>
            <div>
              <label className="block font-semibold mb-1">Địa chỉ</label>
              <p className="w-full p-2 border rounded bg-gray-100">
                {employers.diachi || "Chưa nhập"}
              </p>
            </div>
            <div>
              <label className="block font-semibold mb-1">Website</label>
              <p className="w-full p-2 border rounded bg-gray-100">
                {employers.website || "Chưa nhập"}
              </p>
            </div>
            <div>
              <label className="block font-semibold mb-1">Lĩnh vực</label>
              <p className="w-full p-2 border rounded bg-gray-100">
                {employers.linhvuc || "Chưa nhập"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Chỉnh sửa
          </button>
        </div>
      )}
    </div>
  );
}

export default EmployerManagement;

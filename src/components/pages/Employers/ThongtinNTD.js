import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "../../services/axios";
import { toast } from "react-toastify";
import Quill from "quill";
import "react-toastify/dist/ReactToastify.css";
import "quill/dist/quill.snow.css";
import { Editor } from "@tinymce/tinymce-react";
function EmployerManagement() {
  const id = localStorage.getItem("id");
  console.log("🚀 ~ EmployerManagement ~ id:", id);
  const [previewImage, setPreviewImage] = useState(null);
  const [employer, setEmployer] = useState({
    ten: "",
    email: "",
    sdt: "",
    diachi: "",
    website: "",
    linhvuc: "",
    logo: "",
    thongtin: "",
    MaND: id,
  });
  const [employers, setEmployers] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Tracks edit mode
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployer((prev) => ({ ...prev, [name]: value }));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/nhatd/detail", {
        params: { id },
      });

      if (response.data && Object.keys(response.data).length > 0) {
        setEmployers(response.data);
        setIsEditing(false);
      } else {
        setEmployers(null);
        setIsEditing(true); // Allow new employer creation
      }
    } catch (error) {
      console.error("Error fetching employer data:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setEmployer((prev) => ({ ...prev, [name]: files[0] }));
      setPreviewImage(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (e) => {
    console.time("ntd");
    e.preventDefault();
    if (!employer.ten || !employer.email || !employer.sdt) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    const formData = new FormData();

    Object.entries(employer).forEach(([key, value]) => {
      formData.append(key, value);
    });
    try {
      const response = await axios.post("/nhatd", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEmployers(response.data.data);
      setEmployer({
        ten: "",
        email: "",
        sdt: "",
        diachi: "",
        website: "",
        linhvuc: "",
        logo: "",
      });
      setPreviewImage(null);
      alert("Thêm nhà tuyển dụng thành công!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error adding employer:", error);
      alert(
        error.response?.data?.message ||
          "Đã xảy ra lỗi khi thêm nhà tuyển dụng. Vui lòng thử lại!"
      );
    }
    console.timeEnd("ntd");
  };

  const handleEdit = () => {
    setEmployer(employers);
    setPreviewImage(employers.logo);
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(employer).forEach(([key, value]) => {
      // Only append the logo if it's a new file
      if (key === "logo" && value instanceof File) {
        formData.append(key, value);
      } else if (key !== "logo") {
        formData.append(key, value);
      }
    });
    console.log("🚀 ~ Object.entries ~ formData:", formData);
    try {
      const response = await axios.put("/nhatd/update", formData);
      console.log("🚀 ~ handleUpdate ~ response:", response);
      fetchData();
      setIsEditing(false);
      toast.success("Cập nhật thành công");
    } catch (error) {
      console.error("Error updating employer:", error);
      alert(
        error.response?.data?.message ||
          "Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại!"
      );
    }
  };
  const handleEditorChange = (content) => {
    setEmployer((prev) => ({ ...prev, thongtin: content }));
  };
  useEffect(() => {
    fetchData();
  }, []);
  console.log("🚀 ~ handleUpdate ~ response:");
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Thông tin nhà tuyển dụng
      </h1>

      {!employers || isEditing ? (
        <form
          onSubmit={isEditing ? handleUpdate : handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Image Upload Section */}
            <div className="flex flex-col items-center w-full md:w-1/3">
              <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-gray-300 mb-4 shadow-md">
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
              <div className="w-full">
                <label
                  htmlFor="logo-upload"
                  className="block w-full bg-blue-500 text-white text-center py-2 rounded cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  Tải ảnh logo
                  <input
                    id="logo-upload"
                    type="file"
                    name="logo"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Form Fields Section */}
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: "Tên nhà tuyển dụng",
                  name: "ten",
                  type: "text",
                  required: true,
                },
                {
                  label: "Email",
                  name: "email",
                  type: "email",
                  required: true,
                },
                {
                  label: "Số điện thoại",
                  name: "sdt",
                  type: "text",
                  required: true,
                },
                { label: "Địa chỉ", name: "diachi", type: "text" },
                { label: "Website", name: "website", type: "text" },
                { label: "Lĩnh vực", name: "linhvuc", type: "text" },
              ].map(({ label, name, type, required }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}{" "}
                    {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={employer[name]}
                    onChange={handleChange}
                    required={required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder={`Nhập ${label.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quill Editor Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thông tin chi tiết
            </label>
            <div>
              <Editor
                apiKey="hmiu80d3r5jkhc7nvtrs6d0v221yd3esxb0cc9qo6owjail8"
                value={employer.thongtin}
                onEditorChange={handleEditorChange}
                init={{
                  height: 300,
                  menubar: true,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic backcolor | \
                              alignleft aligncenter alignright alignjustify | \
                              bullist numlist outdent indent | removeformat | help",
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEmployer({
                  ten: "",
                  email: "",
                  sdt: "",
                  diachi: "",
                  website: "",
                  linhvuc: "",
                  logo: "",
                });
                setPreviewImage(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {isEditing ? "Cập nhật" : "Lưu"}
            </button>
          </div>
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
            {[
              { label: "Tên nhà tuyển dụng", value: employers.ten },
              { label: "Email", value: employers.email },
              { label: "Số điện thoại", value: employers.sdt },
              { label: "Địa chỉ", value: employers.diachi },
              { label: "Website", value: employers.website },
              { label: "Lĩnh vực", value: employers.linhvuc },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="block font-semibold mb-1">{label}</label>
                <p className="w-full p-2 border rounded bg-gray-100">
                  {value || "Chưa nhập"}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={handleEdit}
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

import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { toast } from "react-toastify";

function EmployerManagement() {
  const id = localStorage.getItem("id");
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
  const [isEditing, setIsEditing] = useState(false); // Tracks edit mode
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployer((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;

    if (files.length > 0) {
      const file = files[0];

      try {
        // Nén file trước khi lưu vào state
        const compressedFile = await compressImageWithCanvas(file, 500, 500);

        // Cập nhật state
        setEmployer((prev) => ({ ...prev, [name]: compressedFile }));
        setPreviewImage(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error("Error compressing image:", error);
        alert("Failed to process the image. Please try again.");
      }
    } else {
      // Xóa state khi không có file
      setEmployer((prev) => ({ ...prev, [name]: null }));
      setPreviewImage(null);
    }
  };

  // Hàm nén ảnh bằng Canvas
  const compressImageWithCanvas = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Tính toán kích thước mới
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              width = maxWidth;
              height = Math.round(maxWidth * (img.height / img.width));
            } else {
              height = maxHeight;
              width = Math.round(maxHeight * (img.width / img.height));
            }
          }

          // Resize ảnh
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Chuyển canvas thành Blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name, { type: file.type }));
              } else {
                reject(new Error("Failed to create Blob"));
              }
            },
            file.type,
            0.8 // Chất lượng ảnh (0.1 - 1.0)
          );
        };
        img.src = event.target.result;
      };

      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
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
      const response = await axios.post("/nhatd", formData);
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
                className="w-full h-full object-contain"
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
            {[
              { label: "Tên nhà tuyển dụng", name: "ten", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Số điện thoại", name: "sdt", type: "text" },
              { label: "Địa chỉ", name: "diachi", type: "text" },
              { label: "Website", name: "website", type: "text" },
              { label: "Lĩnh vực", name: "linhvuc", type: "text" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block font-semibold mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={employer[name]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder={`Nhập ${label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false); // Thoát khỏi chế độ chỉnh sửa
                setEmployer({
                  ten: "",
                  email: "",
                  sdt: "",
                  diachi: "",
                  website: "",
                  linhvuc: "",
                  logo: "",
                }); // Xóa dữ liệu form (nếu cần)
                setPreviewImage(null);
              }}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
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

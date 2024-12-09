import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../services/axios";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const hasRun = useRef(false); // Prevent duplicate execution

  useEffect(() => {
    if (hasRun.current) return; // Skip if already executed
    hasRun.current = true;

    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setMessage("Liên kết xác minh không hợp lệ!");
        setLoading(false);
        return;
      }

      try {
        console.log("Token:", token); // Log token for debugging
        const response = await axios.get(`/verify-email?token=${token}`);
        console.log("🚀 ~ verifyEmail ~ response:", response);
        setMessage(response.message || "Email đã được xác minh thành công!");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "Liên kết xác minh không hợp lệ hoặc đã hết hạn!";
        setMessage(errorMessage);
        console.error("Email verification error:", error); // Log error for debugging
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {loading ? (
        <p className="text-lg text-gray-700">Đang xác minh email...</p>
      ) : (
        <p
          className={`text-lg ${
            message.includes("thành công") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default VerifyEmail;

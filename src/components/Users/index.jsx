import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ProfileSidebar from "./ProfileSidebar";
import ProfileInfo from "./ProfileInfo";
import MembershipCard from "./MembershipCard";
import PasswordChange from "./PasswordChange";
import {
  User,
  Settings,
  Camera,
  Edit3,
  Save,
  X,
  Loader2,
  Cherry,
  Mountain,
  Waves,
  Leaf,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [section, setSection] = useState("profile");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        // Kiểm tra token có tồn tại không
        if (!token) {
          console.log("No token found, redirecting to login");
          navigate("/login");
          return;
        }

        // Kiểm tra token có hợp lệ không
        let decoded;
        try {
          decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          console.log("Decoded token:", decoded);
          console.log("Current time:", currentTime);
          console.log("Token exp:", decoded.exp);

          if (decoded.exp < currentTime) {
            console.log("Token expired, redirecting to login");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
            return;
          }
        } catch (tokenError) {
          console.log("Invalid token format, redirecting to login");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        console.log(
          "Making API request with token:",
          token.substring(0, 20) + "..."
        );
        console.log("User ID from token:", decoded.userId || decoded.id);

        // Thử cả 2 endpoints - profile trực tiếp hoặc user by ID
        let response;

        // Thử endpoint profile trước
        response = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Nếu profile endpoint không work, thử user endpoint với ID
        if (!response.ok && (decoded.userId || decoded.id)) {
          console.log("Profile endpoint failed, trying user endpoint");
          const userId = decoded.userId || decoded.id;
          response = await fetch(`http://localhost:5000/api/users/${userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        }

        console.log("API Response status:", response.status);

        if (!response.ok) {
          if (response.status === 401) {
            console.log("Unauthorized, token might be invalid");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
            return;
          }

          // Log error response
          const errorText = await response.text();
          console.log("Error response:", errorText);
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }

        const userData = await response.json();
        console.log("User data received:", userData);

        setUser(userData);
        setForm({
          username: userData.username || "",
          email: userData.email || "",
          fullName: userData.fullName || "",
          phone: userData.phone || "",
          address: userData.address || "",
          dateOfBirth: userData.dateOfBirth
            ? new Date(userData.dateOfBirth).toISOString().split("T")[0]
            : "",
        });
      } catch (err) {
        console.error("Error fetching user:", err);

        // Nếu là lỗi network hoặc server, không redirect ngay lập tức
        if (err.message.includes("fetch") || err.message.includes("network")) {
          console.log("Network error, retrying...");
          setLoading(false);
          return;
        }

        // Log chi tiết lỗi
        console.error("Full error details:", {
          message: err.message,
          stack: err.stack,
          name: err.name,
        });

        // Chỉ redirect khi có lỗi authentication
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Thêm function để debug token
  const debugToken = () => {
    const token = localStorage.getItem("token");
    console.log("=== TOKEN DEBUG ===");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Token exists:", !!token);
        console.log("Token length:", token.length);
        console.log("Token preview:", token.substring(0, 50) + "...");
        console.log("Decoded payload:", decoded);
        console.log(
          "User ID field:",
          decoded.userId || decoded.id || "NOT FOUND"
        );
        console.log("Email:", decoded.email);
        console.log("Role:", decoded.role);
        console.log("Expires:", new Date(decoded.exp * 1000));
        console.log("Is expired:", decoded.exp < Date.now() / 1000);
        console.log(
          "Time until expiry:",
          (decoded.exp - Date.now() / 1000) / 3600,
          "hours"
        );
      } catch (e) {
        console.log("Token decode error:", e);
      }
    } else {
      console.log("No token found in localStorage");
    }
    console.log("=================");
  };

  // Test API connection
  const testAPI = async () => {
    console.log("=== API TEST ===");
    try {
      const response = await fetch("http://localhost:5000/api/auth/test", {
        method: "GET",
      });
      console.log("Test API status:", response.status);
      const result = await response.text();
      console.log("Test API response:", result);
    } catch (error) {
      console.log("API test failed:", error);
    }
    console.log("===============");
  };

  // Gọi debug khi component mount
  useEffect(() => {
    debugToken();
    testAPI();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Thay đổi endpoint và cách xử lý update profile
  const handleSave = async () => {
    setLoading(true);
    try {
      console.log("Saving profile data:", form);

      // Lấy token từ localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không có token đăng nhập");
      }

      // 1. Cập nhật thông tin cơ bản (sử dụng đúng endpoint)
      const userResponse = await axios.put(
        `${API_URL}/api/users/${user._id}`, // Thay đổi endpoint này
        {
          username: form.username,
          email: form.email,
          fullName: form.fullName,
          phone: form.phone,
          gender: form.gender,
          address: form.address,
          dob: form.dob,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Profile updated:", userResponse.data);

      // 2. Xử lý avatar nếu có thay đổi
      if (avatar) {
        console.log("Updating avatar...");
        const formData = new FormData();
        formData.append("avatar", avatar);

        const avatarResponse = await axios.post(
          `${API_URL}/api/images/avatar/${user._id}`, // API endpoint avatar đúng
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Avatar updated:", avatarResponse.data);

        // Cập nhật user state với avatar mới
        setUser(avatarResponse.data.user);
        localStorage.setItem("user", JSON.stringify(avatarResponse.data.user));
      } else {
        // Cập nhật user state không có avatar mới
        setUser(userResponse.data.user);
        localStorage.setItem("user", JSON.stringify(userResponse.data.user));
      }

      setEditMode(false);
      toast.success("Cập nhật hồ sơ thành công");
    } catch (error) {
      console.error("Update error:", error);

      // Thêm thông tin chi tiết về lỗi
      if (error.response) {
        // Lỗi từ server với status code
        toast.error(
          `Cập nhật thất bại: ${
            error.response.data?.message || error.response.statusText
          }`
        );
      } else if (error.request) {
        // Không nhận được phản hồi từ server
        toast.error("Không thể kết nối đến server");
      } else {
        // Lỗi trong quá trình thiết lập request
        toast.error(`Lỗi: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (response.ok) {
        alert("Đổi mật khẩu thành công!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Password change error:", error);
      alert("Có lỗi xảy ra: " + error.message);
    }
  };

  // Enhanced loading state với debug tools
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-6"
        >
          {/* Japanese-inspired loading animation */}
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-3 border-slate-200 border-t-slate-600 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border-2 border-gray-300 border-b-gray-700 rounded-full"
            />
          </div>
          <div className="text-center">
            <h3
              className="text-xl font-light text-slate-700 mb-2"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              Đang tải thông tin...
            </h3>
            <p className="text-slate-500">Vui lòng chờ trong giây lát</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0, 1],
      },
    },
  };

  return (
    <>
      {/* Japanese CSS Styles */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

        .jp-text-primary {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 400;
          letter-spacing: -0.01em;
        }

        .jp-text-heading {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 600;
          letter-spacing: -0.02em;
        }

        .jp-text-light {
          font-family: "Inter", sans-serif;
          font-weight: 300;
          letter-spacing: 0.01em;
        }

        .jp-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.1);
          box-shadow: 0 4px 32px rgba(0, 0, 0, 0.04);
        }

        .jp-card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .jp-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
        }

        .jp-button {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: "Inter", sans-serif;
          font-weight: 500;
          letter-spacing: -0.01em;
        }

        .jp-input {
          font-family: "Inter", sans-serif;
          transition: all 0.2s ease;
          border: 2px solid rgba(148, 163, 184, 0.2);
        }

        .jp-input:focus {
          border-color: rgba(100, 116, 139, 0.4);
          box-shadow: 0 0 0 3px rgba(100, 116, 139, 0.1);
        }

        .jp-divider {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(148, 163, 184, 0.3),
            transparent
          );
          height: 1px;
        }

        .jp-zen-bg {
          background: linear-gradient(
            135deg,
            #f8fafc 0%,
            #f1f5f9 25%,
            #e2e8f0 50%,
            #f1f5f9 75%,
            #f8fafc 100%
          );
        }

        .jp-glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen jp-zen-bg pt-16 pb-20"
      >
        {/* Floating Japanese Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-20"
          >
            <Cherry className="h-24 w-24 text-pink-300" />
          </motion.div>

          <motion.div
            animate={{
              y: [0, 30, 0],
              x: [0, -15, 0],
              opacity: [0.08, 0.18, 0.08],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5,
            }}
            className="absolute top-40 right-32"
          >
            <Mountain className="h-32 w-32 text-slate-200" />
          </motion.div>

          <motion.div
            animate={{
              x: [0, 25, 0],
              opacity: [0.06, 0.16, 0.06],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 10,
            }}
            className="absolute bottom-32 left-1/3"
          >
            <Waves className="h-20 w-20 text-blue-200" />
          </motion.div>

          <motion.div
            animate={{
              y: [0, -15, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
            className="absolute bottom-20 right-1/4"
          >
            <Leaf className="h-16 w-16 text-green-200" />
          </motion.div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Minimalist Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="jp-card rounded-2xl p-12 max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-slate-700 p-4 rounded-xl shadow-sm">
                  <User className="h-7 w-7 text-white" />
                </div>
              </div>

              <h1 className="text-4xl lg:text-5xl jp-text-heading text-slate-800 mb-4">
                Thông tin tài khoản
              </h1>
              <h2 className="text-2xl jp-text-primary text-slate-600 mb-6">
                Quản lý hồ sơ cá nhân
              </h2>
              <div className="jp-divider w-24 mx-auto mb-6"></div>
              <p className="text-lg jp-text-light text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Quản lý thông tin cá nhân và cài đặt tài khoản của bạn
              </p>
            </div>
          </motion.div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - 1 column */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <ProfileSidebar
                user={user}
                previewUrl={previewUrl}
                section={section}
                setSection={setSection}
                editMode={editMode}
                handleAvatarChange={handleAvatarChange}
                cardVariants={cardVariants}
              />
            </motion.div>

            {/* Main Content - 3 columns */}
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={section}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {section === "profile" && (
                    <ProfileInfo
                      user={user}
                      form={form}
                      editMode={editMode}
                      setEditMode={setEditMode}
                      handleChange={handleChange}
                      handleSave={handleSave}
                      setForm={setForm}
                      setPreviewUrl={setPreviewUrl}
                      previewUrl={previewUrl}
                      setAvatar={setAvatar}
                      avatar={avatar}
                      cardVariants={cardVariants}
                    />
                  )}

                  {section === "membership" && (
                    <MembershipCard user={user} cardVariants={cardVariants} />
                  )}

                  {section === "password" && (
                    <PasswordChange
                      passwordForm={passwordForm}
                      handlePasswordChange={handlePasswordChange}
                      handlePasswordSubmit={handlePasswordSubmit}
                      cardVariants={cardVariants}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default UserProfile;

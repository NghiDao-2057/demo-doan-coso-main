import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Upload,
  X,
  Edit3,
  Save,
  RotateCcw,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Users,
  TrendingUp,
  Star,
  Clock,
  Cherry,
  Mountain,
  Waves,
} from "lucide-react";

function ProfileInfo({
  user,
  form,
  editMode,
  setEditMode,
  handleChange,
  handleSave,
  setForm,
  setPreviewUrl,
  previewUrl,
  setAvatar,
  avatar,
  cardVariants,
}) {
  const fileInputRef = useRef(null);

  // Add debug logging to track avatar data
  useEffect(() => {
    if (user?.avatar) {
      console.log("ProfileInfo received user avatar:", user.avatar);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
      setAvatar(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setPreviewUrl("");
    setAvatar(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Thêm function để xử lý việc hiển thị avatar
  const getAvatarUrl = () => {
    if (previewUrl) {
      return previewUrl;
    }

    if (user?.avatar?.url) {
      console.log("User avatar loaded:", user.avatar.url);
      return user.avatar.url;
    }

    return null;
  };

  const statsData = [
    {
      value: "12",
      label: "Lớp đã tham gia",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
    },
    {
      value: "3",
      label: "Lớp đang học",
      icon: Clock,
      color: "text-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
    },
    {
      value: "85%",
      label: "Tỷ lệ hoàn thành",
      icon: Star,
      color: "text-amber-600",
      bgColor: "from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
    },
    {
      value: "2",
      label: "Tháng tham gia",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
    },
  ];

  return (
    <>
      {/* Japanese Design System CSS */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

        .jp-zen-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.15);
          box-shadow: 0 4px 32px rgba(15, 23, 42, 0.04),
            0 1px 3px rgba(15, 23, 42, 0.12);
        }

        .jp-zen-card:hover {
          box-shadow: 0 8px 40px rgba(15, 23, 42, 0.08),
            0 4px 12px rgba(15, 23, 42, 0.15);
        }

        .jp-text-primary {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 400;
          letter-spacing: -0.01em;
          line-height: 1.5;
        }

        .jp-text-heading {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.3;
        }

        .jp-text-light {
          font-family: "Inter", sans-serif;
          font-weight: 300;
          letter-spacing: 0.01em;
          line-height: 1.6;
        }

        .jp-button {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: "Inter", sans-serif;
          font-weight: 500;
          letter-spacing: -0.01em;
        }

        .jp-input {
          transition: all 0.2s ease;
          border: 2px solid rgba(148, 163, 184, 0.2);
          font-family: "Inter", sans-serif;
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

        .jp-floating-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .jp-gradient-slate {
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
        }

        .jp-gradient-soft {
          background: linear-gradient(
            135deg,
            #f8fafc 0%,
            #f1f5f9 25%,
            #e2e8f0 50%,
            #f1f5f9 75%,
            #f8fafc 100%
          );
        }
      `}</style>

      {/* Floating Japanese Elements Background */}
      <div className="jp-floating-bg">
        <motion.div
          animate={{
            y: [0, -15, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20"
        >
          <Cherry className="h-12 w-12 text-pink-200" />
        </motion.div>

        <motion.div
          animate={{
            x: [0, 10, 0],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          className="absolute bottom-32 left-16"
        >
          <Mountain className="h-16 w-16 text-slate-200" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 8, 0],
            opacity: [0.06, 0.12, 0.06],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8,
          }}
          className="absolute top-1/2 right-8"
        >
          <Waves className="h-10 w-10 text-blue-200" />
        </motion.div>
      </div>

      <motion.div
        key="profile-info"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="jp-zen-card rounded-3xl overflow-hidden relative z-10"
      >
        {/* Header Section - Japanese Inspired */}
        <div className="relative jp-gradient-slate text-white overflow-hidden">
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                backgroundSize: "20px 20px",
              }}
            />
          </div>

          {/* Zen Wave Pattern */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <svg
              className="absolute -top-2 left-0 w-full h-12 opacity-20"
              viewBox="0 0 400 48"
            >
              <path
                d="M0,24 Q100,12 200,24 T400,24"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M0,32 Q150,20 300,32 T600,32"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </div>

          <div className="relative z-10 px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl jp-text-heading text-white mb-2">
                  Thông tin cá nhân
                </h3>
                <p className="text-white/80 jp-text-light text-sm">
                  Quản lý và cập nhật thông tin cá nhân của bạn
                </p>
              </div>

              {!editMode ? (
                <motion.button
                  onClick={() => setEditMode(true)}
                  className="jp-button flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl border border-white/30 transition-all duration-300 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Edit3 size={16} />
                  Chỉnh sửa
                </motion.button>
              ) : (
                <div className="flex space-x-3">
                  <motion.button
                    onClick={() => {
                      setEditMode(false);
                      setForm({
                        ...user,
                        dob: user.dob ? user.dob.split("T")[0] : "",
                      });
                      setPreviewUrl("");
                      setAvatar(null);
                    }}
                    className="jp-button flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl border border-white/30 transition-all duration-300 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw size={16} />
                    Hủy
                  </motion.button>
                  <motion.button
                    onClick={handleSave}
                    className="jp-button flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all duration-300 font-medium shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save size={16} />
                    Lưu
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Avatar Section - Japanese Zen Style */}
          <div className="mb-8 flex flex-col items-center">
            <div className="relative">
              <motion.div
                className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-slate-200 shadow-lg mb-4 relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {(() => {
                  const avatarUrl = getAvatarUrl();

                  if (avatarUrl) {
                    return (
                      <img
                        src={avatarUrl}
                        alt={previewUrl ? "Avatar preview" : "User avatar"}
                        className="w-full h-full object-cover"
                        onLoad={() =>
                          console.log("Avatar image loaded successfully")
                        }
                        onError={(e) => {
                          console.error("Failed to load avatar:", avatarUrl);
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user?.username || "User"
                          )}&background=64748b&color=ffffff&size=200`;
                        }}
                      />
                    );
                  } else {
                    return (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-600">
                        <User size={48} />
                      </div>
                    );
                  }
                })()}

                {/* Floating Ring Effect */}
                <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-pulse" />
              </motion.div>

              {editMode && (
                <div className="absolute bottom-4 right-0 flex space-x-2">
                  <motion.button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="jp-button bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-full shadow-lg transition-all duration-300"
                    title="Tải ảnh lên"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Upload size={16} />
                  </motion.button>

                  {(previewUrl || user.avatar?.url) && (
                    <motion.button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="jp-button bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-300"
                      title="Xóa ảnh"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                </div>
              )}
            </div>

            {editMode && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            )}

            <div className="text-center">
              <h4 className="text-xl jp-text-heading text-slate-800 mb-1">
                {user.fullName || user.username}
              </h4>
              <p className="text-slate-600 jp-text-light text-sm">
                {user.email}
              </p>
            </div>
          </div>

          {/* Form Fields - Japanese Grid Layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Full Name Field */}
            <div className="lg:col-span-2">
              <label className="block text-sm jp-text-heading text-slate-700 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2 text-slate-500" />
                Họ và tên
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName || ""}
                  onChange={handleChange}
                  className="jp-input w-full rounded-xl bg-white px-4 py-3 text-slate-800 focus:outline-none jp-text-primary"
                  placeholder="Nhập họ và tên của bạn"
                />
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 jp-text-primary">
                  {user.fullName || "Chưa cập nhật"}
                </div>
              )}
            </div>

            {/* Username field */}
            <div>
              <label className="block text-sm jp-text-heading text-slate-700 mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2 text-slate-500" />
                Tên người dùng
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="username"
                  value={form.username || ""}
                  onChange={handleChange}
                  className="jp-input w-full rounded-xl bg-white px-4 py-3 text-slate-800 focus:outline-none jp-text-primary"
                  placeholder="Tên người dùng"
                />
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 jp-text-primary">
                  {user.username}
                </div>
              )}
            </div>

            {/* Email field */}
            <div>
              <label className="block text-sm jp-text-heading text-slate-700 mb-3 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-slate-500" />
                Email
              </label>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={form.email || ""}
                  onChange={handleChange}
                  className="jp-input w-full rounded-xl bg-white px-4 py-3 text-slate-800 focus:outline-none jp-text-primary"
                  placeholder="Email của bạn"
                />
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 jp-text-primary">
                  {user.email}
                </div>
              )}
            </div>

            {/* Phone number field */}
            <div>
              <label className="block text-sm jp-text-heading text-slate-700 mb-3 flex items-center">
                <Phone className="h-4 w-4 mr-2 text-slate-500" />
                Số điện thoại
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="phone"
                  value={form.phone || ""}
                  onChange={handleChange}
                  className="jp-input w-full rounded-xl bg-white px-4 py-3 text-slate-800 focus:outline-none jp-text-primary"
                  placeholder="Số điện thoại"
                />
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 jp-text-primary">
                  {user.phone || "Chưa cập nhật"}
                </div>
              )}
            </div>

            {/* Date of birth field */}
            <div>
              <label className="block text-sm jp-text-heading text-slate-700 mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                Ngày sinh
              </label>
              {editMode ? (
                <input
                  type="date"
                  name="dob"
                  value={form.dob || ""}
                  onChange={handleChange}
                  className="jp-input w-full rounded-xl bg-white px-4 py-3 text-slate-800 focus:outline-none jp-text-primary"
                />
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 jp-text-primary">
                  {user.dob?.split("T")[0] || "Chưa cập nhật"}
                </div>
              )}
            </div>

            {/* Gender field */}
            <div>
              <label className="block text-sm jp-text-heading text-slate-700 mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2 text-slate-500" />
                Giới tính
              </label>
              {editMode ? (
                <select
                  name="gender"
                  value={form.gender || "other"}
                  onChange={handleChange}
                  className="jp-input w-full rounded-xl bg-white px-4 py-3 text-slate-800 focus:outline-none jp-text-primary"
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 jp-text-primary">
                  {user.gender === "male"
                    ? "Nam"
                    : user.gender === "female"
                    ? "Nữ"
                    : "Khác"}
                </div>
              )}
            </div>

            {/* Address Field */}
            <div className="lg:col-span-2">
              <label className="block text-sm jp-text-heading text-slate-700 mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                Địa chỉ
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="address"
                  value={form.address || ""}
                  onChange={handleChange}
                  className="jp-input w-full rounded-xl bg-white px-4 py-3 text-slate-800 focus:outline-none jp-text-primary"
                  placeholder="Địa chỉ của bạn"
                />
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 jp-text-primary">
                  {user.address || "Chưa cập nhật"}
                </div>
              )}
            </div>
          </div>

          {/* Account Statistics - Japanese Card Design */}
          <div className="mt-8 pt-8">
            <div className="jp-divider w-full mb-8"></div>

            <h4 className="text-xl jp-text-heading text-slate-800 mb-6 text-center">
              Thống kê tài khoản
            </h4>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statsData.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`text-center p-6 bg-gradient-to-br ${stat.bgColor} rounded-xl border ${stat.borderColor} hover:shadow-lg transition-all duration-300 group cursor-pointer`}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div
                    className={`text-2xl jp-text-heading font-bold ${stat.color} mb-2`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 jp-text-light">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default ProfileInfo;

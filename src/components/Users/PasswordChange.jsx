import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Eye,
  EyeOff,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  Key,
  Zap,
  Star,
} from "lucide-react";
import axios from "axios";

const PasswordChange = ({
  passwordForm,
  handlePasswordChange,
  handlePasswordSubmit,
  cardVariants,
}) => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setNotification({
        message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/users/change-password",
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotification({
        message: "Đổi mật khẩu thành công!",
        type: "success",
      });

      // Reset form
      handlePasswordChange({ target: { name: "currentPassword", value: "" } });
      handlePasswordChange({ target: { name: "newPassword", value: "" } });
      handlePasswordChange({ target: { name: "confirmPassword", value: "" } });
    } catch (error) {
      console.error("Error changing password:", error);
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu";
      setNotification({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }

    // Auto hide notification
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 5000);
  };

  return (
    <>
      {/* Enhanced Japanese Styles */}
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
          background: rgba(248, 250, 252, 0.8);
        }

        .jp-input:focus {
          border-color: rgba(100, 116, 139, 0.4);
          box-shadow: 0 0 0 3px rgba(100, 116, 139, 0.1);
          background: rgba(255, 255, 255, 1);
        }

        .jp-gradient-bg {
          background: linear-gradient(
            135deg,
            #f8fafc 0%,
            #f1f5f9 50%,
            #e2e8f0 100%
          );
        }

        .jp-security-pattern {
          background-image: radial-gradient(
            circle at 1px 1px,
            rgba(100, 116, 139, 0.05) 1px,
            transparent 0
          );
          background-size: 20px 20px;
        }

        @keyframes jp-float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .jp-float {
          animation: jp-float 3s ease-in-out infinite;
        }

        @keyframes jp-pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .jp-pulse-ring {
          animation: jp-pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955)
            infinite;
        }
      `}</style>

      <motion.div
        key="password"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={cardVariants}
        className="jp-card rounded-2xl overflow-hidden"
      >
        {/* Japanese Minimalist Header */}
        <div className="relative px-8 py-8 jp-gradient-bg jp-security-pattern">
          <div className="relative z-10">
            {/* Floating Security Icons */}
            <div className="absolute top-4 right-4 opacity-20">
              <motion.div className="jp-float">
                <Lock className="h-8 w-8 text-slate-600" />
              </motion.div>
            </div>
            <div className="absolute top-8 right-12 opacity-15">
              <motion.div className="jp-float" style={{ animationDelay: "1s" }}>
                <Key className="h-6 w-6 text-slate-500" />
              </motion.div>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                {/* Pulse Ring Effect */}
                <div className="absolute inset-0 w-16 h-16 border-2 border-slate-300 rounded-2xl jp-pulse-ring"></div>
              </div>
              <div>
                <h2 className="text-3xl jp-text-heading text-slate-800 mb-2">
                  Bảo mật tài khoản
                </h2>
                <p className="text-slate-600 jp-text-light">
                  Cập nhật mật khẩu để bảo vệ thông tin của bạn
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <Star className="h-4 w-4 text-amber-500 mr-2" />
                  <span className="text-slate-500 jp-text-light">
                    Bảo mật cấp độ cao
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Security Guidelines - Japanese Card Style */}
          <div className="mb-8 p-6 jp-card rounded-xl border border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h4 className="jp-text-heading font-semibold text-slate-800 mb-3">
                  Hướng dẫn bảo mật
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      icon: "🔢",
                      title: "8+ ký tự",
                      desc: "Độ dài tối thiểu",
                    },
                    {
                      icon: "🔤",
                      title: "Kết hợp ký tự",
                      desc: "Hoa, thường, số",
                    },
                    {
                      icon: "🚫",
                      title: "Tránh thông tin cá nhân",
                      desc: "Tên, ngày sinh, SĐT",
                    },
                    {
                      icon: "🔄",
                      title: "Thay đổi định kỳ",
                      desc: "3-6 tháng/lần",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <p className="jp-text-heading font-medium text-slate-800 text-sm">
                          {item.title}
                        </p>
                        <p className="jp-text-light text-xs text-slate-600">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notification */}
          <AnimatePresence>
            {notification.message && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className={`mb-6 p-4 rounded-xl border-2 ${
                  notification.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-red-50 text-red-800 border-red-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {notification.type === "success" ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="jp-text-primary font-medium">
                    {notification.message}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Current Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm jp-text-heading font-semibold text-slate-800 mb-4">
                Mật khẩu hiện tại
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative group">
                <input
                  name="currentPassword"
                  type={showPassword.current ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="jp-input w-full rounded-xl px-4 py-4 pr-12 text-slate-800 focus:outline-none transition-all duration-200"
                  placeholder="Nhập mật khẩu hiện tại"
                />
                <motion.button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword.current ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* New Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm jp-text-heading font-semibold text-slate-800 mb-4">
                Mật khẩu mới
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative group">
                <input
                  name="newPassword"
                  type={showPassword.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                  className="jp-input w-full rounded-xl px-4 py-4 pr-12 text-slate-800 focus:outline-none transition-all duration-200"
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                />
                <motion.button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </motion.button>
              </div>
            </motion.div>

            {/* Confirm New Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm jp-text-heading font-semibold text-slate-800 mb-4">
                Xác nhận mật khẩu mới
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative group">
                <input
                  name="confirmPassword"
                  type={showPassword.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="jp-input w-full rounded-xl px-4 py-4 pr-12 text-slate-800 focus:outline-none transition-all duration-200"
                  placeholder="Nhập lại mật khẩu mới"
                />
                <motion.button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword.confirm ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-4"
            >
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`jp-button w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
                  isSubmitting
                    ? "bg-slate-400 cursor-not-allowed text-white"
                    : "bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white shadow-lg hover:shadow-xl"
                }`}
                whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span className="jp-text-primary">Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span className="jp-text-primary">Cập nhật mật khẩu</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Password Strength Meter - Japanese Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 jp-card rounded-xl border border-slate-200"
          >
            <h4 className="jp-text-heading font-semibold text-slate-800 mb-6 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-slate-600" />
              Mức độ bảo mật
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: "📏",
                  text: "Độ dài phù hợp",
                  desc: "Tối thiểu 8 ký tự",
                  color: "emerald",
                },
                {
                  icon: "🔤",
                  text: "Kết hợp ký tự",
                  desc: "Chữ hoa và thường",
                  color: "blue",
                },
                {
                  icon: "🔢",
                  text: "Có chứa số",
                  desc: "Ít nhất 1 số",
                  color: "purple",
                },
                {
                  icon: "🔣",
                  text: "Ký tự đặc biệt",
                  desc: "!@#$%^&* ...",
                  color: "amber",
                },
              ].map((req, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`p-4 bg-gradient-to-br from-${req.color}-50 to-${req.color}-100 rounded-xl border border-${req.color}-200 hover:shadow-md transition-all duration-300 group cursor-pointer`}
                  whileHover={{ y: -2, scale: 1.02 }}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                      {req.icon}
                    </div>
                    <h5
                      className={`jp-text-heading font-semibold text-${req.color}-800 text-sm mb-1`}
                    >
                      {req.text}
                    </h5>
                    <p
                      className={`jp-text-light text-xs text-${req.color}-600`}
                    >
                      {req.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Security Tips */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-slate-600">💡</span>
                </div>
                <div>
                  <h5 className="jp-text-heading font-medium text-slate-800 mb-2">
                    Mẹo bảo mật
                  </h5>
                  <ul className="space-y-1 text-sm text-slate-600 jp-text-light">
                    <li>• Không sử dụng thông tin cá nhân dễ đoán</li>
                    <li>
                      • Tránh sử dụng mật khẩu giống với các tài khoản khác
                    </li>
                    <li>• Thay đổi mật khẩu định kỳ để đảm bảo an toàn</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default PasswordChange;

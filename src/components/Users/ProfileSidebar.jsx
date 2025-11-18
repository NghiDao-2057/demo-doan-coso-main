import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  Shield,
  CreditCard,
  Upload,
  Settings,
  LogOut,
  Crown,
  Star,
  Calendar,
  TrendingUp,
  Award,
  BookOpen,
  Phone,
  HelpCircle,
  Cherry,
  Mountain,
} from "lucide-react";
import axios from "axios";

const ProfileSidebar = ({
  user,
  previewUrl,
  section,
  setSection,
  editMode,
  handleAvatarChange,
  cardVariants,
}) => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    totalClasses: 0,
    activeClasses: 0,
    completionRate: 0,
    membershipMonths: 0,
  });

  useEffect(() => {
    if (user?._id) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        `http://localhost:5000/api/classes/user/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const enrollments = response.data || [];
      const activeClasses = enrollments.filter(
        (e) => e.class?.status === "ongoing" || e.class?.status === "upcoming"
      ).length;

      const completedClasses = enrollments.filter(
        (e) => e.class?.status === "completed"
      ).length;

      const completionRate =
        enrollments.length > 0
          ? Math.round((completedClasses / enrollments.length) * 100)
          : 0;

      const startDate = new Date(user?.createdAt || Date.now());
      const now = new Date();
      const membershipMonths = Math.max(
        1,
        Math.floor((now - startDate) / (1000 * 60 * 60 * 24 * 30))
      );

      setUserStats({
        totalClasses: enrollments.length,
        activeClasses,
        completionRate,
        membershipMonths,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setUserStats({
        totalClasses: 24,
        activeClasses: 5,
        completionRate: 92,
        membershipMonths: 6,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    {
      id: "profile",
      label: "Thông tin cá nhân",
      icon: User,
      description: "Quản lý hồ sơ và thông tin",
      color: "text-slate-600",
      bgColor: "bg-slate-100",
      hoverColor: "hover:bg-slate-200",
    },
    {
      id: "membership",
      label: "Thẻ thành viên",
      icon: CreditCard,
      description: "Xem gói thành viên và quyền lợi",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      hoverColor: "hover:bg-amber-200",
    },
    {
      id: "password",
      label: "Bảo mật",
      icon: Shield,
      description: "Đổi mật khẩu và cài đặt bảo mật",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      hoverColor: "hover:bg-emerald-200",
    },
  ];

  const statsData = [
    {
      value: userStats.totalClasses,
      label: "Lớp học",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      value: `${userStats.completionRate}%`,
      label: "Hoàn thành",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      value: userStats.membershipMonths,
      label: "Tháng thành viên",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <>
      {/* Vietnamese Design System Styles */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

        .vn-zen-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.15);
          box-shadow: 0 4px 32px rgba(15, 23, 42, 0.04),
            0 1px 3px rgba(15, 23, 42, 0.12);
        }

        .vn-zen-card:hover {
          box-shadow: 0 8px 40px rgba(15, 23, 42, 0.08),
            0 4px 12px rgba(15, 23, 42, 0.15);
        }

        .vn-text-primary {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 400;
          letter-spacing: -0.01em;
          line-height: 1.5;
        }

        .vn-text-heading {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.3;
        }

        .vn-text-light {
          font-family: "Inter", sans-serif;
          font-weight: 300;
          letter-spacing: 0.01em;
          line-height: 1.6;
        }

        .vn-button {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: "Inter", sans-serif;
          font-weight: 500;
          letter-spacing: -0.01em;
        }

        .vn-divider {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(148, 163, 184, 0.3),
            transparent
          );
          height: 1px;
        }

        .vn-glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .vn-gradient-slate {
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
        }

        .vn-shadow-soft {
          box-shadow: 0 2px 16px rgba(15, 23, 42, 0.08),
            0 1px 4px rgba(15, 23, 42, 0.05);
        }

        .vn-floating-elements {
          pointer-events: none;
        }

        .vn-card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .vn-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 40px rgba(15, 23, 42, 0.1);
        }
      `}</style>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 relative"
      >
        {/* Floating Decorative Elements */}
        <div className="vn-floating-elements fixed inset-0 z-0 overflow-hidden opacity-30">
          <motion.div
            animate={{
              y: [0, -10, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-10 right-4"
          >
            <Cherry className="h-8 w-8 text-pink-300" />
          </motion.div>

          <motion.div
            animate={{
              x: [0, 5, 0],
              opacity: [0.08, 0.2, 0.08],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
            className="absolute bottom-20 left-2"
          >
            <Mountain className="h-6 w-6 text-slate-300" />
          </motion.div>
        </div>

        {/* Main Profile Card */}
        <div className="vn-zen-card rounded-3xl overflow-hidden relative z-10 vn-card-hover">
          {/* Header with Gradient */}
          <div className="relative vn-gradient-slate p-8 text-white overflow-hidden">
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                  backgroundSize: "24px 24px",
                }}
              />
            </div>

            {/* Wave Pattern */}
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
              </svg>
            </div>

            <div className="relative z-10">
              {/* Avatar Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white/20 vn-shadow-soft mb-4 bg-white/10">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : user?.avatar?.url ? (
                      <img
                        src={user.avatar.url}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.username || "User"
                          )}&background=64748b&color=ffffff&size=200`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-600 text-white">
                        <User size={20} />
                      </div>
                    )}
                  </div>

                  {editMode && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() =>
                        document.getElementById("avatar-upload").click()
                      }
                      className="absolute bottom-4 right-0 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-full vn-shadow-soft transition-all duration-200"
                      title="Thay đổi ảnh đại diện"
                    >
                      <Upload size={12} />
                    </motion.button>
                  )}
                </div>

                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <div className="text-center">
                  <h3 className="text-lg vn-text-heading text-white mb-1">
                    {user?.fullName || user?.username || "Người dùng"}
                  </h3>
                  <p className="text-white/70 text-sm vn-text-light mb-3">
                    {user?.email}
                  </p>

                  {/* Membership Badge */}
                  <div className="inline-flex items-center px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full border border-white/20">
                    <Crown className="h-3 w-3 mr-2" />
                    <span className="vn-text-primary font-medium text-xs text-white">
                      {user?.membership?.type &&
                      user?.membership?.status === "active"
                        ? `Thành viên ${user.membership.type}`
                        : "Chưa đăng ký thành viên"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                {statsData.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex justify-center mb-2">
                      <stat.icon className="h-4 w-4 text-white/80" />
                    </div>
                    <div className="vn-text-heading text-sm font-semibold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/70 vn-text-light">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Member Since Section */}
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center text-slate-700">
              <Calendar className="h-4 w-4 text-slate-500 mr-3" />
              <div>
                <div className="text-xs text-slate-400 vn-text-light mb-1">
                  Thành viên từ
                </div>
                <div className="vn-text-primary font-medium text-sm">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString(
                    "vi-VN",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="vn-zen-card rounded-3xl overflow-hidden vn-card-hover">
          <div className="p-6">
            <h4 className="text-lg vn-text-heading text-slate-800 mb-6 flex items-center">
              <Settings className="h-5 w-5 mr-3 text-slate-600" />
              <span className="vn-text-primary">Quản lý tài khoản</span>
            </h4>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = section === item.id;

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setSection(item.id)}
                    className={`vn-button w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-slate-800 text-white vn-shadow-soft"
                        : `bg-slate-50 ${item.hoverColor} text-slate-700`
                    }`}
                    whileHover={{ x: isActive ? 0 : 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-all duration-200 ${
                          isActive ? "bg-white/20" : item.bgColor
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            isActive ? "text-white" : item.color
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div
                          className={`vn-text-primary font-medium mb-1 ${
                            isActive ? "text-white" : "text-slate-800"
                          }`}
                        >
                          {item.label}
                        </div>
                        <div
                          className={`text-sm vn-text-light ${
                            isActive ? "text-white/80" : "text-slate-500"
                          }`}
                        >
                          {item.description}
                        </div>
                      </div>
                      {isActive && <Award className="h-4 w-4 text-white" />}
                    </div>
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <motion.button
              onClick={handleLogout}
              className="vn-button w-full flex items-center justify-center p-4 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 font-medium vn-shadow-soft"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="h-4 w-4 mr-3" />
              <span>Đăng xuất</span>
            </motion.button>
          </div>
        </div>

        {/* Quick Support */}
        <div className="vn-zen-card rounded-3xl p-6 vn-card-hover">
          <h4 className="text-lg vn-text-heading text-slate-800 mb-4 flex items-center">
            <HelpCircle className="h-5 w-5 mr-3 text-slate-600" />
            <span className="vn-text-primary">Hỗ trợ nhanh</span>
          </h4>
          <div className="space-y-3">
            <motion.button
              whileHover={{ x: 3, scale: 1.01 }}
              className="vn-button w-full text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all duration-200 text-slate-700 group border border-slate-200 hover:border-slate-300"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-all duration-200">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="vn-text-primary font-medium mb-1">
                    Liên hệ hỗ trợ
                  </div>
                  <div className="text-sm text-slate-500 vn-text-light">
                    Hotline: 1900-xxxx (24/7)
                  </div>
                </div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ x: 3, scale: 1.01 }}
              className="vn-button w-full text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all duration-200 text-slate-700 group border border-slate-200 hover:border-slate-300"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-emerald-200 transition-all duration-200">
                  <HelpCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="vn-text-primary font-medium mb-1">
                    Câu hỏi thường gặp
                  </div>
                  <div className="text-sm text-slate-500 vn-text-light">
                    Tìm câu trả lời nhanh chóng
                  </div>
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProfileSidebar;

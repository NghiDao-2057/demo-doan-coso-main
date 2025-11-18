import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Crown,
  Star,
  Calendar,
  Gift,
  Award,
  Shield,
  Clock,
  Users,
  Zap,
  Heart,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  Diamond,
  Gem,
  BadgeCheck,
  Flame,
  Coins,
  Trophy,
  MapPin,
  Phone,
  Mail,
  Wifi,
  CreditCard as CardIcon,
  User,
  Activity,
} from "lucide-react";
import axios from "axios";

const BenefitItem = ({ children }) => (
  <motion.li
    className="flex items-start group hover:transform hover:translate-x-1 transition-all duration-300"
    whileHover={{ scale: 1.02 }}
  >
    <div className="relative mr-3 mt-0.5">
      <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
      <div className="absolute -inset-1 bg-emerald-600/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    <span className="text-slate-700 vn-text-primary group-hover:text-slate-800 transition-colors duration-300">
      {children}
    </span>
  </motion.li>
);

// Enhanced Vietnamese CSS Animation Styles
const addCardStyles = () => {
  if (!document.getElementById("vn-membership-styles")) {
    const style = document.createElement("style");
    style.id = "vn-membership-styles";
    style.textContent = `
      @keyframes vn-float {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
        50% { transform: translateY(-8px) rotate(3deg); opacity: 1; }
      }
      
      .vn-float {
        animation: vn-float 4s ease-in-out infinite;
      }
      
      @keyframes vn-shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      .vn-shimmer-effect {
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        animation: vn-shimmer 3s infinite;
      }
      
      @keyframes vn-pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(100, 116, 139, 0.15); }
        50% { box-shadow: 0 0 40px rgba(100, 116, 139, 0.25); }
      }
      
      .vn-pulse-glow {
        animation: vn-pulse-glow 4s ease-in-out infinite;
      }

      @keyframes vn-zen-wave {
        0%, 100% { transform: translateX(-100%) skewX(-2deg); opacity: 0; }
        50% { transform: translateX(100%) skewX(-2deg); opacity: 0.4; }
      }
      
      .vn-zen-wave {
        animation: vn-zen-wave 8s ease-in-out infinite;
      }

      @keyframes vn-particle {
        0% { opacity: 0; transform: translateY(10px) scale(0.8) rotate(0deg); }
        50% { opacity: 1; transform: translateY(-5px) scale(1.1) rotate(180deg); }
        100% { opacity: 0; transform: translateY(-20px) scale(0.8) rotate(360deg); }
      }
      
      .vn-particle {
        animation: vn-particle 4s ease-in-out infinite;
      }

      @keyframes vn-gradient-shift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      
      .vn-gradient-animate {
        background-size: 200% 200%;
        animation: vn-gradient-shift 6s ease infinite;
      }
    `;
    document.head.appendChild(style);
  }
};

const MembershipCard = ({ user, cardVariants }) => {
  const navigate = useNavigate();
  const [showMembershipDetails, setShowMembershipDetails] = useState(false);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBenefits, setShowBenefits] = useState(false);
  const [hasActiveMembership, setHasActiveMembership] = useState(false);
  const [userStats, setUserStats] = useState({
    totalClasses: 0,
    activeClasses: 0,
    completionRate: 0,
    membershipMonths: 0,
  });

  // Enhanced Benefits data
  const standardBenefits = [
    "🏋️ Truy cập tất cả thiết bị tập luyện cơ bản",
    "👥 Tham gia lớp học nhóm không giới hạn",
    "🚿 Sử dụng phòng thay đồ và tủ khóa",
    "💪 Hỗ trợ kỹ thuật và tư vấn cơ bản từ HLV",
    "🎁 Nhận ưu đãi đặc biệt trong các dịp lễ",
    "📱 Ứng dụng theo dõi tiến độ tập luyện miễn phí",
  ];

  const vipBenefits = [
    "💎 Truy cập không giới hạn tất cả thiết bị cao cấp",
    "👨‍💼 Lớp học cá nhân 1-1 với PT chuyên nghiệp",
    "🏛️ Quyền sử dụng phòng VIP và khu spa thư giãn",
    "🥗 Tư vấn dinh dưỡng chuyên sâu và thực đơn cá nhân",
    "⭐ Ưu tiên đặt lịch và hỗ trợ khách hàng 24/7",
    "🥤 Miễn phí đồ uống protein và khăn tập cao cấp",
    "👫 Quyền mang 2 người bạn tham quan miễn phí/tháng",
    "🏆 Tham gia chương trình tích điểm VIP độc quyền",
  ];

  const platinumBenefits = [
    ...vipBenefits,
    "🌟 Dịch vụ concierge cá nhân 24/7",
    "🎯 Phòng tập riêng biệt và thiết bị độc quyền",
    "🥇 Ưu tiên tuyệt đối trong mọi dịch vụ và sự kiện",
    "🏅 Chương trình huấn luyện Olympic do chuyên gia thiết kế",
  ];

  const diamondBenefits = [
    ...platinumBenefits,
    "💎 Dịch vụ VIP tối cao với butler cá nhân",
    "👑 Quyền lợi độc quyền và trải nghiệm đặc biệt",
    "🏆 Thành viên của câu lạc bộ tinh hoa",
    "✈️ Du lịch wellness hàng năm miễn phí",
  ];

  // Enhanced Vietnamese minimalist configurations
  const membershipConfigs = {
    Standard: {
      cardGradient: "from-slate-600 via-slate-700 to-slate-800",
      glowEffect: "from-slate-300 via-gray-300 to-slate-400",
      textColor: "text-white",
      primaryColor: "text-slate-200",
      secondaryColor: "text-slate-100",
      icon: CreditCard,
      badge: "bg-slate-700",
      benefits: standardBenefits,
      tier: "Tiêu chuẩn",
      accentColor: "border-slate-300",
      statsBg: "bg-slate-50",
      buttonStyle: "bg-slate-700 hover:bg-slate-600",
      pattern: "opacity-10",
    },
    VIP: {
      cardGradient:
        "from-amber-500 via-yellow-600 to-orange-600 vn-gradient-animate",
      glowEffect: "from-amber-400 via-yellow-400 to-orange-400",
      textColor: "text-white",
      primaryColor: "text-amber-100",
      secondaryColor: "text-yellow-100",
      icon: Crown,
      badge: "bg-amber-600",
      benefits: vipBenefits,
      tier: "Thành viên VIP",
      accentColor: "border-amber-300",
      statsBg: "bg-amber-50",
      buttonStyle: "bg-amber-600 hover:bg-amber-700",
      pattern: "opacity-15",
    },
    Platinum: {
      cardGradient:
        "from-emerald-600 via-teal-700 to-cyan-700 vn-gradient-animate",
      glowEffect: "from-emerald-400 via-teal-400 to-cyan-400",
      textColor: "text-white",
      primaryColor: "text-emerald-100",
      secondaryColor: "text-teal-100",
      icon: Diamond,
      badge: "bg-emerald-600",
      benefits: platinumBenefits,
      tier: "Bạch kim",
      accentColor: "border-emerald-300",
      statsBg: "bg-emerald-50",
      buttonStyle: "bg-emerald-600 hover:bg-emerald-700",
      pattern: "opacity-20",
    },
    Diamond: {
      cardGradient:
        "from-purple-700 via-violet-800 to-indigo-800 vn-gradient-animate",
      glowEffect: "from-purple-400 via-violet-400 to-fuchsia-400",
      textColor: "text-white",
      primaryColor: "text-purple-100",
      secondaryColor: "text-violet-100",
      icon: Gem,
      badge: "bg-purple-700",
      benefits: diamondBenefits,
      tier: "Kim cương",
      accentColor: "border-purple-300",
      statsBg: "bg-purple-50",
      buttonStyle: "bg-purple-700 hover:bg-purple-600",
      pattern: "opacity-25",
    },
  };

  useEffect(() => {
    addCardStyles();
    fetchMembershipData();
    fetchUserStats();
  }, [user]);

  const fetchMembershipData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      setHasActiveMembership(false);
      setMembership(null);

      if (token && user?._id) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/memberships/user/${user._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data && response.data.status === "active") {
            setHasActiveMembership(true);
            setMembership({
              id: response.data._id || response.data.id,
              type: response.data.type,
              startDate: response.data.startDate,
              endDate: response.data.endDate,
              isActive: true,
              status: response.data.status,
              benefits:
                membershipConfigs[response.data.type]?.benefits ||
                standardBenefits,
            });
            return;
          }
        } catch (apiError) {
          if (apiError.response?.status === 404) {
            setHasActiveMembership(false);
          }
        }
      }

      if (user?.membership && user.membership.status === "active") {
        setHasActiveMembership(true);
        const membershipData = {
          id:
            user.membership.id ||
            "MEM" + Math.floor(10000 + Math.random() * 90000),
          type: user.membership.type,
          startDate: user.membership.startDate,
          endDate: user.membership.endDate,
          isActive: true,
          status: user.membership.status,
          benefits:
            membershipConfigs[user.membership.type]?.benefits ||
            standardBenefits,
        };
        setMembership(membershipData);
      } else {
        setHasActiveMembership(false);
        setMembership(null);
      }
    } catch (err) {
      console.error("Error fetching membership:", err);
      setError("Không thể tải thông tin thẻ thành viên");
      setHasActiveMembership(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !user?._id) return;

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

  if (loading) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="vn-card rounded-2xl p-8"
      >
        <div className="text-center py-16">
          <div className="relative mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-3 border-slate-300 border-t-slate-600 rounded-full mx-auto"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-16 h-16 border-2 border-slate-100 border-b-slate-500 rounded-full mx-auto"
            />
          </div>
          <h4 className="text-slate-800 text-xl vn-text-heading mb-3">
            Đang tải thông tin thẻ thành viên
          </h4>
          <p className="text-slate-600 vn-text-light">
            Vui lòng chờ trong giây lát...
          </p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="vn-card rounded-2xl p-8"
      >
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-10 w-10 text-red-500" />
          </div>
          <h4 className="text-red-600 text-xl vn-text-heading mb-3">
            Có lỗi xảy ra
          </h4>
          <p className="text-red-500 vn-text-light">{error}</p>
        </div>
      </motion.div>
    );
  }

  // No Membership State - Enhanced Design
  if (!hasActiveMembership || !membership) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* No Membership Card */}
        <div className="vn-card rounded-2xl overflow-hidden vn-pulse-glow">
          <div className="relative p-12 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, #64748b 1px, transparent 0)`,
                  backgroundSize: "40px 40px",
                }}
              ></div>
            </div>

            <div className="relative z-10 text-center">
              <div className="relative mb-8">
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto border border-slate-300 shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CreditCard className="h-12 w-12 text-slate-500" />
                </motion.div>
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-white text-sm font-bold">!</span>
                </motion.div>
              </div>

              <h3 className="text-3xl vn-text-heading text-slate-800 mb-3">
                Thẻ thành viên
              </h3>
              <h4 className="text-xl vn-text-primary text-slate-700 mb-6">
                Chưa được kích hoạt
              </h4>
              <p className="text-slate-600 mb-10 vn-text-light max-w-2xl mx-auto leading-relaxed text-lg">
                Đăng ký thẻ thành viên để trải nghiệm đầy đủ các tiện ích và
                quyền lợi cao cấp tại phòng gym
              </p>

              {/* Enhanced Benefits Preview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                {[
                  {
                    icon: "🏋️",
                    title: "Thiết bị hiện đại",
                    desc: "Máy móc cao cấp chất lượng",
                    color: "blue",
                  },
                  {
                    icon: "👥",
                    title: "Lớp học đa dạng",
                    desc: "HLV chuyên nghiệp 5⭐",
                    color: "emerald",
                  },
                  {
                    icon: "💪",
                    title: "Hỗ trợ cá nhân",
                    desc: "Tư vấn 1-1 chuyên sâu",
                    color: "purple",
                  },
                  {
                    icon: "🎁",
                    title: "Ưu đãi độc quyền",
                    desc: "Khuyến mãi hấp dẫn",
                    color: "amber",
                  },
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className={`p-6 bg-gradient-to-br from-${benefit.color}-50 to-${benefit.color}-100 rounded-2xl border border-${benefit.color}-200 text-center hover:shadow-xl transition-all duration-500 group cursor-pointer`}
                    whileHover={{ y: -8, scale: 1.05 }}
                  >
                    <div className="text-3xl mb-4 group-hover:scale-125 transition-transform duration-300">
                      {benefit.icon}
                    </div>
                    <h4
                      className={`vn-text-heading font-bold text-${benefit.color}-800 mb-2`}
                    >
                      {benefit.title}
                    </h4>
                    <p
                      className={`text-sm text-${benefit.color}-600 vn-text-light`}
                    >
                      {benefit.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.button
                  onClick={() => navigate("/membership")}
                  className="vn-button bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white px-10 py-5 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group text-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Crown className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                  Đăng ký thành viên
                  <Sparkles className="h-5 w-5 ml-2 group-hover:rotate-180 transition-transform duration-500" />
                </motion.button>

                <motion.button
                  onClick={() => navigate("/classes")}
                  className="vn-button bg-slate-100 hover:bg-slate-200 text-slate-800 px-10 py-5 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center text-lg border-2 border-slate-200 hover:border-slate-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Target className="h-6 w-6 mr-3" />
                  Xem lớp học
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Membership Packages */}
        <motion.div
          className="vn-card rounded-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center mb-8">
            <h4 className="text-2xl vn-text-heading font-bold text-slate-800 mb-3">
              Gói thành viên phổ biến
            </h4>
            <p className="text-slate-600 vn-text-light">
              Lựa chọn gói phù hợp với nhu cầu của bạn
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Standard",
                nameVi: "Tiêu chuẩn",
                price: "299,000₫",
                color: "from-slate-500 to-slate-600",
                popular: false,
                features: ["Thiết bị cơ bản", "Lớp nhóm", "Phòng thay đồ"],
              },
              {
                name: "VIP",
                nameVi: "VIP",
                price: "599,000₫",
                color: "from-amber-500 to-yellow-600",
                popular: true,
                features: ["Tất cả Standard", "PT cá nhân", "Spa cao cấp"],
              },
              {
                name: "Platinum",
                nameVi: "Bạch kim",
                price: "999,000₫",
                color: "from-emerald-500 to-teal-600",
                popular: false,
                features: ["Tất cả VIP", "Phòng riêng", "Concierge 24/7"],
              },
            ].map((pkg, index) => (
              <motion.div
                key={index}
                className={`relative p-8 bg-gradient-to-br ${pkg.color} text-white rounded-2xl cursor-pointer hover:shadow-2xl transition-all duration-500 group overflow-hidden`}
                whileHover={{ scale: 1.05, y: -10 }}
                onClick={() => navigate("/membership")}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                {pkg.popular && (
                  <motion.div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🔥 Phổ biến nhất
                  </motion.div>
                )}

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 vn-shimmer-effect"></div>
                </div>

                <div className="relative z-10 text-center">
                  <h5 className="vn-text-heading font-bold text-2xl mb-2">
                    {pkg.nameVi}
                  </h5>
                  <p className="text-sm opacity-90 mb-4">{pkg.name}</p>
                  <p className="vn-text-primary text-3xl font-bold mb-6">
                    {pkg.price}
                  </p>

                  <div className="space-y-3 mb-6">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-sm opacity-75 group-hover:opacity-100 transition-opacity">
                    Nhấn để xem chi tiết →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Active Membership Display - Enhanced
  const config =
    membershipConfigs[membership.type] || membershipConfigs.Standard;
  const IconComponent = config.icon;
  const daysLeft = membership?.endDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(membership.endDate) - new Date()) / (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  return (
    <>
      {/* Enhanced Global Vietnamese Styles */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

        .vn-text-primary {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 400;
          letter-spacing: -0.01em;
        }

        .vn-text-heading {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 600;
          letter-spacing: -0.02em;
        }

        .vn-text-light {
          font-family: "Inter", sans-serif;
          font-weight: 300;
          letter-spacing: 0.01em;
        }

        .vn-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.1);
          box-shadow: 0 4px 32px rgba(0, 0, 0, 0.04);
        }

        .vn-card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .vn-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.1);
        }

        .vn-button {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: "Inter", sans-serif;
          font-weight: 500;
          letter-spacing: -0.01em;
        }
      `}</style>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Enhanced Vietnamese Style Membership Card */}
        <div className="relative group px-4 py-4">
          {" "}
          {/* Thêm padding để tạo không gian cho scale */}
          <div
            className={`absolute -inset-7 bg-gradient-to-r ${config.glowEffect} rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-all duration-700 vn-pulse-glow`}
          ></div>
          <motion.div
            className="relative overflow-hidden"
            style={{ aspectRatio: "1.586" }}
            whileHover={{
              scale: 1.02, // Giảm scale từ 1.03 xuống 1.02
              rotateY: 2, // Giảm rotation
              rotateX: 2, // Giảm rotation
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration: 0.3, // Thêm duration cho smooth hơn
            }}
          >
            <div
              className={`
              relative w-full h-full
              bg-gradient-to-br ${config.cardGradient}
              rounded-2xl shadow-2xl overflow-hidden
              border border-white/20
              transform-gpu will-change-transform
            `}
              style={{
                backfaceVisibility: "hidden", // Tối ưu performance
                perspective: "1000px",
              }}
            >
              {/* Enhanced Wave Pattern */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                {" "}
                {/* Thêm rounded-2xl */}
                <div className="absolute top-0 left-0 w-full h-12 vn-zen-wave opacity-30">
                  <svg viewBox="0 0 400 48" className="w-full h-full">
                    <path
                      d="M0,24 Q100,12 200,24 T400,24"
                      stroke="rgba(255,255,255,0.5)"
                      strokeWidth="2"
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
                {/* Enhanced Particles */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute bg-white/25 rounded-full vn-particle"
                    style={{
                      width: `${2 + Math.random() * 3}px`,
                      height: `${2 + Math.random() * 3}px`,
                      left: `${15 + i * 7}%`,
                      top: `${25 + i * 4}%`,
                      animationDelay: `${i * 0.4}s`,
                    }}
                  />
                ))}
              </div>

              {/* Enhanced Card Content */}
              <div className="relative z-10 p-8 h-full flex flex-col justify-between rounded-2xl">
                {" "}
                {/* Thêm rounded-2xl */}
                {/* Top Section */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/25 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white vn-text-heading text-lg tracking-wider font-bold">
                        FITNESS CLUB
                      </h3>
                      <p
                        className={`${config.primaryColor} vn-text-light tracking-wide`}
                      >
                        {config.tier}
                      </p>
                    </div>
                  </div>

                  {membership?.isActive && (
                    <motion.div
                      className="bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Đang hoạt động
                    </motion.div>
                  )}
                </div>
                {/* Middle Section */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CardIcon className="h-5 w-5 text-white/80" />
                    <p className="text-white/90 vn-text-primary tracking-wide font-medium">
                      MÃ THÀNH VIÊN
                    </p>
                  </div>
                  <p className="text-white font-mono text-xl tracking-[0.15em] font-bold">
                    {membership?.id}
                  </p>
                </div>
                {/* Bottom Section */}
                <div className="flex items-end justify-between">
                  <div className="space-y-2">
                    <p className="text-white/80 text-sm vn-text-light tracking-wide uppercase">
                      Họ và tên
                    </p>
                    <p className="text-white vn-text-primary tracking-wide uppercase font-semibold">
                      {user?.fullName || user?.username || "THÀNH VIÊN"}
                    </p>
                  </div>

                  <div className="text-right space-y-2">
                    <p className="text-white/80 text-sm vn-text-light tracking-wide">
                      Hết hạn
                    </p>
                    <p className="text-white font-mono font-semibold">
                      {new Date(membership?.endDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Chip */}
              <div className="absolute top-12 left-8">
                <div className="w-8 h-6 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md shadow-lg"></div>
              </div>

              {/* Enhanced Contactless */}
              <div className="absolute top-12 right-8">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Wifi className="h-6 w-6 text-white/60 rotate-90" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Information Cards - Vietnamese Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Member Information */}
          <motion.div
            className="vn-card rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center mb-6">
              <div
                className={`w-10 h-10 ${config.buttonStyle} rounded-lg flex items-center justify-center mr-4`}
              >
                <Users className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-lg vn-text-heading text-slate-800">
                Thông tin thành viên
              </h4>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                <Mail className="h-4 w-4 text-slate-600 mr-3" />
                <div>
                  <p className="text-sm text-slate-600 vn-text-light">Email</p>
                  <p className="vn-text-primary font-medium text-slate-900">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                <Calendar className="h-4 w-4 text-slate-600 mr-3" />
                <div>
                  <p className="text-sm text-slate-600 vn-text-light">
                    Ngày kích hoạt
                  </p>
                  <p className="vn-text-primary font-medium text-slate-900">
                    {new Date(membership?.startDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                <Clock className="h-4 w-4 text-slate-600 mr-3" />
                <div>
                  <p className="text-sm text-slate-600 vn-text-light">
                    Thời gian còn lại
                  </p>
                  <p className="vn-text-primary font-medium text-slate-900">
                    {daysLeft} ngày
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Statistics */}
          <motion.div
            className="vn-card rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <div
                className={`w-10 h-10 ${config.buttonStyle} rounded-lg flex items-center justify-center mr-4`}
              >
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-lg vn-text-heading text-slate-800">
                Thống kê hoạt động
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  value: userStats.totalClasses,
                  label: "Tổng lớp học",
                  icon: "📚",
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  value: userStats.activeClasses,
                  label: "Đang tham gia",
                  icon: "⚡",
                  color: "text-yellow-600",
                  bg: "bg-yellow-50",
                },
                {
                  value: `${userStats.completionRate}%`,
                  label: "Tỷ lệ hoàn thành",
                  icon: "⭐",
                  color: "text-green-600",
                  bg: "bg-green-50",
                },
                {
                  value: userStats.membershipMonths,
                  label: "Tháng thành viên",
                  icon: "👑",
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className={`text-center p-4 ${stat.bg} rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-300 vn-card-hover`}
                  whileHover={{ y: -1, scale: 1.02 }}
                >
                  <div className="text-xl mb-2">{stat.icon}</div>
                  <div
                    className={`text-xl vn-text-heading font-bold ${stat.color} mb-1`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 vn-text-light">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Benefits Section */}
        <motion.div
          className="vn-card rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 ${config.buttonStyle} rounded-lg flex items-center justify-center mr-4`}
                >
                  <Gift className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg vn-text-heading text-slate-800">
                    Quyền lợi thành viên
                  </h4>
                  <p className="text-sm text-slate-600 vn-text-light">
                    {config.tier} quyền lợi
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => setShowBenefits(!showBenefits)}
                className={`w-8 h-8 ${config.buttonStyle} rounded-lg flex items-center justify-center text-white`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRight
                  className={`h-4 w-4 transition-transform duration-300 ${
                    showBenefits ? "rotate-90" : ""
                  }`}
                />
              </motion.button>
            </div>

            {showBenefits && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <ul className="space-y-3">
                    {config.benefits
                      .slice(0, Math.ceil(config.benefits.length / 2))
                      .map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <BenefitItem>{benefit}</BenefitItem>
                        </motion.div>
                      ))}
                  </ul>
                  <ul className="space-y-3">
                    {config.benefits
                      .slice(Math.ceil(config.benefits.length / 2))
                      .map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay:
                              (index + Math.ceil(config.benefits.length / 2)) *
                              0.1,
                          }}
                        >
                          <BenefitItem>{benefit}</BenefitItem>
                        </motion.div>
                      ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="grid md:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => navigate("/classes")}
            className="vn-button bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Target className="h-4 w-4 mr-2" />
            Đăng ký lớp học
          </motion.button>

          <motion.button
            onClick={() => setShowMembershipDetails(!showMembershipDetails)}
            className="vn-button bg-slate-100 hover:bg-slate-200 text-slate-800 p-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Award className="h-4 w-4 mr-2" />
            Xem chi tiết
          </motion.button>
        </motion.div>

        {/* Details Modal */}
        {showMembershipDetails && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowMembershipDetails(false)}
          >
            <motion.div
              className="vn-card rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div
                  className={`w-12 h-12 ${config.buttonStyle} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl vn-text-heading text-slate-800 mb-1">
                  {config.tier}
                </h4>
                <p className="text-slate-600 vn-text-light">
                  Chi tiết thẻ thành viên
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "Loại thẻ",
                    value: membership?.type,
                    icon: Award,
                  },
                  {
                    label: "Ngày kích hoạt",
                    value: new Date(membership?.startDate).toLocaleDateString(
                      "vi-VN"
                    ),
                    icon: Calendar,
                  },
                  {
                    label: "Ngày hết hạn",
                    value: new Date(membership?.endDate).toLocaleDateString(
                      "vi-VN"
                    ),
                    icon: Clock,
                  },
                  {
                    label: "Trạng thái",
                    value: membership?.isActive ? "Đang hoạt động" : "Hết hạn",
                    icon: Shield,
                    valueClass: membership?.isActive
                      ? "text-green-600"
                      : "text-red-600",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <item.icon className="h-4 w-4 text-slate-600 mr-3" />
                      <p className="vn-text-primary font-medium text-slate-700">
                        {item.label}
                      </p>
                    </div>
                    <span
                      className={`vn-text-primary font-semibold ${
                        item.valueClass || "text-slate-900"
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowMembershipDetails(false)}
                className="mt-6 w-full vn-button bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-medium transition-all duration-200"
              >
                Đóng
              </button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default MembershipCard;

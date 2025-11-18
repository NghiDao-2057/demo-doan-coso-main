import React from "react";
import { motion } from "framer-motion";
import pricingPlansData from "../../data/pricingPlansData";
import {
  Crown,
  Star,
  Sparkles,
  CheckCircle,
  Zap,
  Heart,
  Award,
  Shield,
  TrendingUp,
  Calendar,
  AlertCircle,
  Clock,
  Gift,
  Users,
  Gem,
  ArrowRight,
  Target,
  Trophy,
} from "lucide-react";

const PricingPlans = ({
  selectedPlan,
  onSelectPlan,
  filterCategory = "basic",
  onFilterChange,
  message,
  isUpgrade = false,
  containerClassName = "",
  readOnly = false,
}) => {
  // Format price để hiển thị đẹp hơn
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const getFilteredPlans = () => {
    return pricingPlansData.filter((plan) => plan.category === filterCategory);
  };

  // Simplified Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
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
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { x: 30, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "basic":
        return Star;
      case "standard":
        return Crown;
      case "vip":
        return Sparkles;
      default:
        return Award;
    }
  };

  const getDurationText = (duration) => {
    switch (duration) {
      case 30:
        return "1 tháng";
      case 90:
        return "3 tháng";
      case 180:
        return "6 tháng";
      case 365:
        return "1 năm";
      default:
        return `${duration} ngày`;
    }
  };

  const getCategoryColors = (category) => {
    switch (category) {
      case "basic":
        return {
          primary: "bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600",
          secondary: "bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100",
          accent: "text-blue-600",
          glow: "shadow-blue-500/25",
          border: "border-blue-200/30",
        };
      case "standard":
        return {
          primary:
            "bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600",
          secondary:
            "bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100",
          accent: "text-emerald-600",
          glow: "shadow-emerald-500/25",
          border: "border-emerald-200/30",
        };
      case "vip":
        return {
          primary:
            "bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600",
          secondary:
            "bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100",
          accent: "text-purple-600",
          glow: "shadow-purple-500/25",
          border: "border-purple-200/30",
        };
      default:
        return {
          primary: "bg-gradient-to-br from-gray-500 via-slate-500 to-gray-600",
          secondary: "bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100",
          accent: "text-gray-600",
          glow: "shadow-gray-500/25",
          border: "border-gray-200/30",
        };
    }
  };

  const filteredPlans = getFilteredPlans();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* CSS-only Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-purple-600/20 rounded-full blur-xl"
          style={{
            animation: "float 20s ease-in-out infinite",
          }}
        ></div>

        <div
          className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-xl"
          style={{
            animation: "float 25s ease-in-out infinite 5s",
          }}
        ></div>

        <div
          className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-green-600/20 rounded-full blur-xl"
          style={{
            animation: "float 15s ease-in-out infinite 10s",
          }}
        ></div>
      </div>

      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-20px) rotate(90deg) scale(1.1);
          }
          50% {
            transform: translateY(0px) rotate(180deg) scale(1.2);
          }
          75% {
            transform: translateY(20px) rotate(270deg) scale(1.1);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        .shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        /* Scrollbar styling */
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #8b5cf6, #ec4899);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, #7c3aed, #db2777);
        }
      `}</style>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`relative z-10 ${containerClassName}`}
      >
        {/* Hero Header Section */}
        <motion.div variants={itemVariants} className="text-center pt-20 pb-12">
          <h1 className="text-6xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
              Chọn Gói
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Hoàn Hảo
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Khám phá những gói membership được thiết kế đặc biệt cho hành trình
            fitness của bạn
          </p>

          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mt-8"></div>
        </motion.div>

        {/* Modern Category Filters - Only 3 options */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-2 border border-white/20 shadow-2xl">
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    key: "basic",
                    label: "Cơ Bản",
                    icon: Star,
                    color: "from-blue-400 to-cyan-400",
                  },
                  {
                    key: "standard",
                    label: "Tiêu Chuẩn",
                    icon: Crown,
                    color: "from-emerald-400 to-green-400",
                  },
                  {
                    key: "vip",
                    label: "VIP",
                    icon: Sparkles,
                    color: "from-purple-400 to-pink-400",
                  },
                ].map((filter) => {
                  const IconComponent = filter.icon;
                  const isActive = filterCategory === filter.key;

                  return (
                    <button
                      key={filter.key}
                      onClick={() => onFilterChange(filter.key)}
                      className={`relative p-4 rounded-2xl transition-all duration-300 transform ${
                        isActive
                          ? `bg-gradient-to-br ${filter.color} text-white shadow-2xl scale-105`
                          : "text-white/70 hover:text-white hover:bg-white/10 hover:scale-102"
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <IconComponent className="h-6 w-6" />
                        <span className="text-sm font-bold">
                          {filter.label}
                        </span>
                      </div>

                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-yellow-900" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Message Display */}
        {message && message.text && (
          <div
            className={`mb-12 mx-6 p-6 rounded-3xl backdrop-blur-2xl border shadow-2xl ${
              message.type === "success"
                ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-100"
                : "bg-red-500/20 border-red-400/30 text-red-100"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  message.type === "success" ? "bg-emerald-500" : "bg-red-500"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-white" />
                )}
              </div>
              <span className="font-semibold text-lg">{message.text}</span>
            </div>
          </div>
        )}

        {/* Cards Layout with Scroll */}
        <motion.div variants={itemVariants} className="mb-20">
          <div className="max-w-7xl mx-auto px-6">
            {filteredPlans.length <= 3 ? (
              // Grid layout for 3 or fewer cards
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {filteredPlans.map((plan, index) => {
                  const IconComponent = getCategoryIcon(plan.category);
                  const isSelected = selectedPlan?.id === plan.id;
                  const isPopular = plan.popular || plan.badge;
                  const colors = getCategoryColors(plan.category);

                  return (
                    <motion.div
                      key={plan.id}
                      variants={cardVariants}
                      className={`relative w-96 bg-white/10 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl transition-all duration-500 hover:shadow-3xl ${
                        isSelected ? "ring-4 ring-purple-400/50" : ""
                      } ${isPopular ? "transform scale-105" : ""}`}
                      style={{
                        transformOrigin: "center",
                      }}
                      whileHover={{
                        y: -8,
                        scale: 1.02,
                        transition: { duration: 0.3 },
                      }}
                    >
                      {/* Popular Ribbon */}
                      {isPopular && (
                        <div className="absolute top-0 right-0 z-20">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-bl-2xl font-bold text-sm shadow-lg">
                            <div className="flex items-center space-x-1">
                              <Trophy className="h-4 w-4" />
                              <span>{plan.badge || "PHỔ BIẾN"}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Card Header */}
                      <div
                        className={`${colors.secondary} p-8 relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full"></div>
                          <div className="absolute bottom-4 left-4 w-12 h-12 bg-white rounded-full"></div>
                        </div>

                        <div className="relative z-10 text-center">
                          <div
                            className={`inline-flex items-center justify-center w-20 h-20 ${colors.primary} rounded-3xl shadow-2xl mb-6 transition-transform duration-300 hover:rotate-12 hover:scale-110`}
                          >
                            <IconComponent className="h-10 w-10 text-white" />
                          </div>

                          <h3
                            className={`text-2xl font-bold mb-4 ${colors.accent}`}
                          >
                            {plan.name}
                          </h3>

                          <div className="mb-4">
                            <div className="flex items-baseline justify-center">
                              <span className="text-5xl font-black text-gray-800">
                                {formatPrice(plan.price)}
                              </span>
                              <span className="text-xl text-gray-600 ml-2">
                                đ
                              </span>
                            </div>
                            <div
                              className={`${colors.primary} text-white px-4 py-2 rounded-2xl text-sm font-bold mt-3 inline-flex items-center space-x-2`}
                            >
                              <Calendar className="h-4 w-4" />
                              <span>{getDurationText(plan.duration)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-8 text-white">
                        <div className="mb-6">
                          <h4 className="text-lg font-bold mb-4 flex items-center text-white">
                            <Gift className="h-5 w-5 mr-2 text-purple-400" />
                            Quyền Lợi Đặc Biệt
                          </h4>
                        </div>

                        <ul className="space-y-3 mb-8">
                          {plan.features
                            .slice(0, 6)
                            .map((feature, featureIndex) => (
                              <li
                                key={featureIndex}
                                className="flex items-start space-x-3"
                              >
                                <div
                                  className={`w-6 h-6 rounded-lg ${colors.primary} flex items-center justify-center flex-shrink-0 shadow-lg`}
                                >
                                  <CheckCircle className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-gray-200 text-sm leading-relaxed">
                                  {feature}
                                </span>
                              </li>
                            ))}
                        </ul>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <div
                              className={`text-2xl font-black ${colors.accent}`}
                            >
                              {plan.duration > 30 ? "✓" : "~"}
                            </div>
                            <div className="text-xs text-gray-300">
                              Tiết Kiệm
                            </div>
                          </div>
                          <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <div
                              className={`text-lg font-black ${colors.accent}`}
                            >
                              {Math.round(
                                (plan.price / plan.duration) * 30
                              ).toLocaleString()}
                              đ
                            </div>
                            <div className="text-xs text-gray-300">/ tháng</div>
                          </div>
                        </div>

                        {/* Action Button */}
                        {!readOnly && (
                          <button
                            onClick={() => onSelectPlan(plan)}
                            className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 relative overflow-hidden group ${
                              isSelected
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                : `${colors.primary} text-white hover:shadow-2xl hover:scale-105`
                            }`}
                          >
                            <div className="relative z-10 flex items-center justify-center space-x-2">
                              {isSelected ? (
                                <>
                                  <CheckCircle className="h-5 w-5" />
                                  <span>Đã Chọn</span>
                                </>
                              ) : (
                                <>
                                  <span>
                                    {isUpgrade ? "Nâng Cấp" : "Chọn Gói"}
                                  </span>
                                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                              )}
                            </div>

                            {!isSelected && (
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer"></div>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl z-30">
                          <CheckCircle className="h-7 w-7 text-white" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              // Horizontal scroll layout for more than 3 cards
              <div className="overflow-x-auto custom-scrollbar">
                <div
                  className="flex space-x-8 pb-8"
                  style={{ width: "max-content" }}
                >
                  {filteredPlans.map((plan, index) => {
                    const IconComponent = getCategoryIcon(plan.category);
                    const isSelected = selectedPlan?.id === plan.id;
                    const isPopular = plan.popular || plan.badge;
                    const colors = getCategoryColors(plan.category);

                    return (
                      <motion.div
                        key={plan.id}
                        variants={cardVariants}
                        className={`relative w-96 bg-white/10 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl transition-all duration-500 hover:shadow-3xl ${
                          isSelected ? "ring-4 ring-purple-400/50" : ""
                        } ${isPopular ? "transform scale-105" : ""}`}
                        style={{ flexShrink: 0 }}
                        whileHover={{
                          y: -8,
                          scale: 1.02,
                          transition: { duration: 0.3 },
                        }}
                      >
                        {/* Popular Ribbon */}
                        {isPopular && (
                          <div className="absolute top-0 right-0 z-20">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-bl-2xl font-bold text-sm shadow-lg">
                              <div className="flex items-center space-x-1">
                                <Trophy className="h-4 w-4" />
                                <span>{plan.badge || "PHỔ BIẾN"}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Card Header */}
                        <div
                          className={`${colors.secondary} p-8 relative overflow-hidden`}
                        >
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full"></div>
                            <div className="absolute bottom-4 left-4 w-12 h-12 bg-white rounded-full"></div>
                          </div>

                          <div className="relative z-10 text-center">
                            <div
                              className={`inline-flex items-center justify-center w-20 h-20 ${colors.primary} rounded-3xl shadow-2xl mb-6 transition-transform duration-300 hover:rotate-12 hover:scale-110`}
                            >
                              <IconComponent className="h-10 w-10 text-white" />
                            </div>

                            <h3
                              className={`text-2xl font-bold mb-4 ${colors.accent}`}
                            >
                              {plan.name}
                            </h3>

                            <div className="mb-4">
                              <div className="flex items-baseline justify-center">
                                <span className="text-5xl font-black text-gray-800">
                                  {formatPrice(plan.price)}
                                </span>
                                <span className="text-xl text-gray-600 ml-2">
                                  đ
                                </span>
                              </div>
                              <div
                                className={`${colors.primary} text-white px-4 py-2 rounded-2xl text-sm font-bold mt-3 inline-flex items-center space-x-2`}
                              >
                                <Calendar className="h-4 w-4" />
                                <span>{getDurationText(plan.duration)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-8 text-white">
                          <div className="mb-6">
                            <h4 className="text-lg font-bold mb-4 flex items-center text-white">
                              <Gift className="h-5 w-5 mr-2 text-purple-400" />
                              Quyền Lợi Đặc Biệt
                            </h4>
                          </div>

                          <ul className="space-y-3 mb-8">
                            {plan.features
                              .slice(0, 6)
                              .map((feature, featureIndex) => (
                                <li
                                  key={featureIndex}
                                  className="flex items-start space-x-3"
                                >
                                  <div
                                    className={`w-6 h-6 rounded-lg ${colors.primary} flex items-center justify-center flex-shrink-0 shadow-lg`}
                                  >
                                    <CheckCircle className="h-4 w-4 text-white" />
                                  </div>
                                  <span className="text-gray-200 text-sm leading-relaxed">
                                    {feature}
                                  </span>
                                </li>
                              ))}
                          </ul>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                              <div
                                className={`text-2xl font-black ${colors.accent}`}
                              >
                                {plan.duration > 30 ? "✓" : "~"}
                              </div>
                              <div className="text-xs text-gray-300">
                                Tiết Kiệm
                              </div>
                            </div>
                            <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                              <div
                                className={`text-lg font-black ${colors.accent}`}
                              >
                                {Math.round(
                                  (plan.price / plan.duration) * 30
                                ).toLocaleString()}
                                đ
                              </div>
                              <div className="text-xs text-gray-300">
                                / tháng
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          {!readOnly && (
                            <button
                              onClick={() => onSelectPlan(plan)}
                              className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 relative overflow-hidden group ${
                                isSelected
                                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                  : `${colors.primary} text-white hover:shadow-2xl hover:scale-105`
                              }`}
                            >
                              <div className="relative z-10 flex items-center justify-center space-x-2">
                                {isSelected ? (
                                  <>
                                    <CheckCircle className="h-5 w-5" />
                                    <span>Đã Chọn</span>
                                  </>
                                ) : (
                                  <>
                                    <span>
                                      {isUpgrade ? "Nâng Cấp" : "Chọn Gói"}
                                    </span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                  </>
                                )}
                              </div>

                              {!isSelected && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer"></div>
                              )}
                            </button>
                          )}
                        </div>

                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl z-30">
                            <CheckCircle className="h-7 w-7 text-white" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Features Showcase */}
        <motion.div variants={itemVariants} className="px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-12 border border-white/10 shadow-2xl">
              <div className="text-center mb-12">
                <h3 className="text-4xl font-bold text-white mb-6">
                  Tại Sao Chọn Chúng Tôi?
                </h3>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Trải nghiệm fitness đẳng cấp thế giới với công nghệ tiên tiến
                  và dịch vụ tận tâm
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Award,
                    title: "Chất Lượng Đẳng Cấp",
                    description:
                      "Trang thiết bị hiện đại nhất từ các thương hiệu hàng đầu thế giới",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: Shield,
                    title: "An Toàn Tuyệt Đối",
                    description:
                      "Hệ thống an toàn 5 sao với bảo hiểm toàn diện cho mọi thành viên",
                    color: "from-emerald-500 to-green-500",
                  },
                  {
                    icon: Heart,
                    title: "Hỗ Trợ Tận Tâm",
                    description:
                      "Đội ngũ chuyên gia sẵn sàng 24/7 cho hành trình của bạn",
                    color: "from-purple-500 to-pink-500",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="text-center p-8 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:scale-105"
                  >
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-3xl mb-6 shadow-2xl transition-transform duration-300 hover:rotate-12 hover:scale-110`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>

                    <h4 className="text-2xl font-bold text-white mb-4">
                      {feature.title}
                    </h4>

                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="flex justify-center items-center flex-wrap gap-8">
                  {[
                    {
                      icon: Users,
                      text: "2000+ Thành viên",
                      color: "text-purple-400",
                    },
                    {
                      icon: Star,
                      text: "4.9★ Đánh giá",
                      color: "text-yellow-400",
                    },
                    {
                      icon: Trophy,
                      text: "5+ Năm uy tín",
                      color: "text-blue-400",
                    },
                    {
                      icon: Shield,
                      text: "100% Đảm bảo",
                      color: "text-emerald-400",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                    >
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                      <span className="text-white font-semibold">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PricingPlans;

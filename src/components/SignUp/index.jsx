import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Calendar,
  Users,
  Crown,
  ChevronRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  Sparkles,
  Heart,
  UserPlus,
} from "lucide-react";

// Tách JapaneseInput component ra ngoài
const RoyalInput = React.memo(
  ({
    icon: Icon,
    label,
    error,
    type = "text",
    required = false,
    showPassword,
    onTogglePassword,
    ...props
  }) => (
    <div className="mb-6">
      <label className="flex items-center text-sm font-medium text-gray-700 mb-3 royal-font">
        <Icon size={16} className="mr-2 text-purple-500" />
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          {...props}
          type={type}
          className={`royal-input w-full pl-12 pr-12 py-4 royal-font text-gray-800 placeholder-gray-400 focus:outline-none ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : ""
          }`}
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        {type === "password" && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-500 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="royal-glass bg-red-50/80 border border-red-200/50 rounded-2xl p-3 mt-2 flex items-start"
        >
          <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <span className="royal-font text-sm text-red-700">{error}</span>
        </motion.div>
      )}
    </div>
  )
);

// Tách RoyalSelect component ra ngoài
const RoyalSelect = React.memo(
  ({
    icon: Icon,
    label,
    error,
    options = [],
    placeholder = "Chọn...",
    required = false,
    ...props
  }) => (
    <div className="mb-6">
      <label className="flex items-center text-sm font-medium text-gray-700 mb-3 royal-font">
        <Icon size={16} className="mr-2 text-purple-500" />
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          {...props}
          className={`royal-input w-full pl-12 pr-4 py-4 royal-font text-gray-800 appearance-none cursor-pointer ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : ""
          }`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239333ea' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: "right 1rem center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1.25rem 1.25rem",
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="royal-glass bg-red-50/80 border border-red-200/50 rounded-2xl p-3 mt-2 flex items-start"
        >
          <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <span className="royal-font text-sm text-red-700">{error}</span>
        </motion.div>
      )}
    </div>
  )
);

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Đảm bảo body không có padding khi vào trang SignUp
  useEffect(() => {
    document.body.style.paddingTop = "0";
    document.body.classList.remove("with-navbar");

    return () => {
      // Không cần restore gì vì CSS đã bỏ rồi
    };
  }, []);

  // Sử dụng useCallback để tối ưu performance
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear validation error for this field
      setValidationErrors((prev) => {
        if (prev[name]) {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        }
        return prev;
      });

      // Clear general error
      if (error) {
        setError("");
      }
    },
    [error]
  );

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const validateStep1 = useCallback(() => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = "Tên đăng nhập là bắt buộc";
    } else if (formData.username.length < 3) {
      errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    if (!formData.email.trim()) {
      errors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!formData.fullName.trim()) {
      errors.fullName = "Họ và tên là bắt buộc";
    }

    if (!formData.password) {
      errors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu không khớp";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const validateStep2 = useCallback(() => {
    const errors = {};

    if (!formData.phone.trim()) {
      errors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.dob) {
      errors.dob = "Ngày sinh là bắt buộc";
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 16) {
        errors.dob = "Bạn phải ít nhất 16 tuổi để đăng ký";
      }
    }

    if (!formData.gender) {
      errors.gender = "Giới tính là bắt buộc";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const nextStep = useCallback(
    (e) => {
      e.preventDefault();
      if (validateStep1()) {
        setStep(2);
      }
    },
    [validateStep1]
  );

  const prevStep = useCallback((e) => {
    e.preventDefault();
    setStep(1);
    setError("");
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (step === 1) {
        nextStep(e);
        return;
      }

      if (!validateStep2()) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/signup",
          {
            username: formData.username.trim(),
            email: formData.email.trim().toLowerCase(),
            fullName: formData.fullName.trim(),
            password: formData.password,
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            dob: new Date(formData.dob).toISOString(),
            gender: formData.gender,
          }
        );

        if (response.status === 201) {
          setStep(3);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (error) {
        console.error("Error during signup:", error);
        setError(
          error.response?.data?.message ||
            "Đã xảy ra lỗi. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    },
    [step, validateStep2, formData, navigate, nextStep]
  );

  // Step 1: Account Information
  const renderStep1 = () => (
    <div className="space-y-2">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="royal-heading text-3xl text-gray-800 mb-2">
          Tạo tài khoản
        </h2>
        <p className="royal-font text-gray-600">Bước 1: Thông tin đăng nhập</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              1
            </div>
            <span className="ml-2 text-sm font-medium text-purple-500 royal-heading">
              Tài khoản
            </span>
          </div>
          <div className="w-12 h-1 bg-gray-200 rounded"></div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
              2
            </div>
            <span className="ml-2 text-sm font-medium text-gray-500 royal-heading">
              Cá nhân
            </span>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <RoyalInput
        icon={User}
        label="Tên đăng nhập"
        name="username"
        value={formData.username}
        onChange={handleInputChange}
        placeholder="Nhập tên đăng nhập"
        error={validationErrors.username}
        required
        autoComplete="username"
      />

      <RoyalInput
        icon={Mail}
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Nhập địa chỉ email"
        error={validationErrors.email}
        required
        autoComplete="email"
      />

      <RoyalInput
        icon={User}
        label="Họ và tên"
        name="fullName"
        value={formData.fullName}
        onChange={handleInputChange}
        placeholder="Nhập họ và tên đầy đủ"
        error={validationErrors.fullName}
        required
        autoComplete="name"
      />

      <RoyalInput
        icon={Lock}
        label="Mật khẩu"
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
        error={validationErrors.password}
        required
        autoComplete="new-password"
        showPassword={showPassword}
        onTogglePassword={togglePassword}
      />

      <RoyalInput
        icon={Lock}
        label="Xác nhận mật khẩu"
        type={showConfirmPassword ? "text" : "password"}
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        placeholder="Nhập lại mật khẩu"
        error={validationErrors.confirmPassword}
        required
        autoComplete="new-password"
        showPassword={showConfirmPassword}
        onTogglePassword={toggleConfirmPassword}
      />

      {/* Continue Button */}
      <div className="mt-8">
        <button
          type="button"
          onClick={nextStep}
          disabled={loading}
          className="royal-button w-full py-4 px-6 text-white royal-font font-semibold text-lg relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="relative z-10 flex items-center justify-center">
            <span>Tiếp tục</span>
            <ChevronRight
              size={24}
              className="ml-2 group-hover:translate-x-1 transition-transform"
            />
          </div>
        </button>
      </div>
    </div>
  );

  // Step 2: Personal Information
  const renderStep2 = () => (
    <div className="space-y-2">
      {/* Header with Back Button */}
      <div className="flex items-center mb-8">
        <button
          type="button"
          onClick={prevStep}
          className="text-gray-500 hover:text-purple-500 transition-colors p-2 rounded-full hover:bg-purple-50 mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 text-center">
          <h2 className="royal-heading text-3xl text-gray-800 mb-2">
            Thông tin cá nhân
          </h2>
          <p className="royal-font text-gray-600">Bước 2: Hoàn thiện hồ sơ</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg">
              <Check size={20} />
            </div>
            <span className="ml-2 text-sm font-medium text-green-500 royal-heading">
              Tài khoản
            </span>
          </div>
          <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded"></div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              2
            </div>
            <span className="ml-2 text-sm font-medium text-purple-500 royal-heading">
              Cá nhân
            </span>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <RoyalInput
        icon={Phone}
        label="Số điện thoại"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        placeholder="Nhập số điện thoại"
        error={validationErrors.phone}
        required
        autoComplete="tel"
      />

      <RoyalInput
        icon={MapPin}
        label="Địa chỉ"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        placeholder="Nhập địa chỉ (tùy chọn)"
        error={validationErrors.address}
        autoComplete="address-line1"
      />

      <RoyalInput
        icon={Calendar}
        label="Ngày sinh"
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleInputChange}
        error={validationErrors.dob}
        required
        max={
          new Date(new Date().setFullYear(new Date().getFullYear() - 16))
            .toISOString()
            .split("T")[0]
        }
      />

      <RoyalSelect
        icon={Users}
        label="Giới tính"
        name="gender"
        value={formData.gender}
        onChange={handleInputChange}
        error={validationErrors.gender}
        required
        options={[
          { value: "male", label: "Nam" },
          { value: "female", label: "Nữ" },
          { value: "other", label: "Khác" },
        ]}
        placeholder="Chọn giới tính"
      />

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="royal-glass bg-red-50/80 border border-red-200/50 rounded-2xl p-4 flex items-start"
          >
            <Shield className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="royal-font text-sm text-red-700">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className="royal-button w-full py-4 px-6 text-white royal-font font-semibold text-lg relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="relative z-10 flex items-center justify-center">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                <span>Đang tạo tài khoản...</span>
              </>
            ) : (
              <>
                <Crown
                  size={24}
                  className="mr-2 group-hover:rotate-12 transition-transform"
                />
                <span>Tạo tài khoản</span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );

  // Step 3: Success
  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-xl">
          <Check className="h-10 w-10 text-white" />
        </div>
        <h2 className="royal-heading text-4xl text-gray-800 mb-4">
          Chúc mừng! 🌸
        </h2>
        <p className="royal-font text-xl text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
          Tài khoản của bạn đã được tạo thành công. Chào mừng bạn đến với{" "}
          <span className="text-purple-500 font-semibold">Sakura Club</span>!
        </p>
      </div>

      <div className="space-y-4">
        <div className="royal-glass bg-white/90 border border-purple-200/50 rounded-2xl p-6 max-w-md mx-auto">
          <h3 className="royal-heading text-lg font-semibold text-gray-800 mb-3 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
            Thông tin tài khoản
          </h3>
          <div className="space-y-3 text-left">
            <div className="flex justify-between items-center p-2 bg-purple-50/50 rounded-lg">
              <span className="royal-font text-gray-600">Tên đăng nhập:</span>
              <span className="font-medium text-gray-800">
                {formData.username}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-indigo-50/50 rounded-lg">
              <span className="royal-font text-gray-600">Email:</span>
              <span className="font-medium text-gray-800">
                {formData.email}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50/50 rounded-lg">
              <span className="royal-font text-gray-600">Họ tên:</span>
              <span className="font-medium text-gray-800">
                {formData.fullName}
              </span>
            </div>
          </div>
        </div>

        <div className="royal-glass bg-gradient-to-r from-purple-50/80 to-indigo-50/80 border border-purple-200/50 rounded-2xl p-4 max-w-md mx-auto">
          <p className="royal-font text-gray-600 flex items-center justify-center">
            <Heart className="h-4 w-4 text-purple-500 mr-2" />
            Bạn sẽ được chuyển đến trang đăng nhập sau{" "}
            <span className="font-semibold text-purple-500 mx-1">3 giây</span>
            ...
          </p>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="royal-button inline-flex items-center justify-center px-8 py-3 text-white royal-font font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <span>Đăng nhập ngay</span>
          <ChevronRight size={20} className="ml-2" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        /* Đảm bảo SignUp full screen */
        body {
          padding-top: 0 !important;
          margin: 0 !important;
        }

        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

        .royal-font {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 1.5;
        }

        .royal-heading {
          font-family: "Inter", sans-serif;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1.2;
        }

        /* Static Background */
        .royal-aurora {
          background: linear-gradient(
            135deg,
            #667eea 0%,
            #764ba2 25%,
            #f093fb 50%,
            #f5576c 75%,
            #4facfe 100%
          );
        }

        .royal-glass {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.25) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          backdrop-filter: blur(30px) saturate(200%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .royal-input {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.7) 100%
          );
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.05);
        }

        .royal-input:focus {
          border: 2px solid rgba(99, 102, 241, 0.5);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1),
            0 15px 35px -5px rgba(99, 102, 241, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .royal-button {
          background: linear-gradient(
            135deg,
            #667eea 0%,
            #764ba2 50%,
            #f093fb 100%
          );
          border: none;
          border-radius: 20px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .royal-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(102, 126, 234, 0.4);
        }
      `}</style>

      {/* LAYOUT GIỐNG LOGIN - Left Panel + Right Panel */}
      <div className="min-h-screen royal-aurora relative overflow-hidden flex">
        {/* Left Panel - Branding giống Login */}
        <motion.div
          className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Static decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-32 h-32 border-2 border-white/20 rounded-full opacity-60"></div>
            <div className="absolute bottom-1/4 right-1/3 w-24 h-24 border-2 border-purple-300/30 rounded-lg rotate-45 opacity-50"></div>
            <div className="absolute top-3/4 left-1/4 w-16 h-16 border-2 border-pink-300/40 rounded-full opacity-40"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Logo & Brand */}
              <div className="mb-12">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl"></div>
                  <div className="relative royal-glass rounded-3xl p-6 border-2 border-white/30">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-lg opacity-75"></div>
                        <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                          <Crown className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div>
                        <h1 className="royal-heading text-3xl text-white mb-1">
                          Sakura Club
                        </h1>
                        <p className="royal-font text-white/80">
                          Premium Fitness
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Text */}
                <div>
                  <h2 className="royal-heading text-6xl xl:text-7xl text-white mb-6 leading-tight">
                    Tham gia
                    <br />
                    <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                      cùng chúng tôi
                    </span>
                  </h2>
                  <p className="royal-font text-xl text-white/80 mb-8 leading-relaxed max-w-md">
                    Bắt đầu hành trình fitness của bạn cùng với hàng nghìn thành
                    viên trong cộng đồng premium của chúng tôi
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  {[
                    {
                      number: "10K+",
                      label: "Thành viên",
                    },
                    {
                      number: "50+",
                      label: "Huấn luyện viên chuyên nghiệp",
                    },
                    {
                      number: "24/7",
                      label: "Quyền lợi độc quyền",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="royal-glass rounded-2xl p-4 text-center border border-white/20"
                    >
                      <div className="royal-heading text-2xl text-white mb-1">
                        {stat.number}
                      </div>
                      <div className="royal-font text-sm text-white/70">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel - SignUp Form */}
        <motion.div
          className="w-full lg:w-1/2 xl:w-2/5 relative flex items-center justify-center p-8 lg:p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-black/20 lg:bg-transparent"></div>

          {/* Form Container */}
          <div className="relative z-10 w-full max-w-md">
            {/* Header Mobile Only */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="royal-heading text-2xl text-white">
                    Sakura Club
                  </h1>
                  <p className="royal-font text-white/80 text-sm">
                    Premium Fitness
                  </p>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="royal-glass rounded-3xl overflow-hidden border border-white/20">
              {/* Form Content */}
              <div className="p-8">
                {/* Step 1 - Account Info */}
                {step === 1 && renderStep1()}

                {/* Step 2 - Personal Info */}
                {step === 2 && (
                  <form onSubmit={handleSubmit}>{renderStep2()}</form>
                )}

                {/* Step 3 - Success */}
                {step === 3 && renderSuccess()}
              </div>

              {/* Footer */}
              {step !== 3 && (
                <div className="bg-gradient-to-r from-gray-50/80 to-purple-50/80 px-8 py-6 text-center border-t border-white/20">
                  <p className="royal-font text-gray-600">
                    Đã có tài khoản?{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-purple-600 hover:text-purple-500 transition-colors"
                    >
                      Đăng nhập ngay
                    </Link>
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Links */}
            <div className="mt-8 text-center">
              <p className="royal-font text-sm text-white/70 lg:text-gray-500">
                Bằng cách đăng ký, bạn đồng ý với{" "}
                <a
                  href="#"
                  className="text-purple-400 lg:text-purple-600 hover:underline"
                >
                  Điều khoản
                </a>{" "}
                và{" "}
                <a
                  href="#"
                  className="text-purple-400 lg:text-purple-600 hover:underline"
                >
                  Chính sách bảo mật
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SignUp;

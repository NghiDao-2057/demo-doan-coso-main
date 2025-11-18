import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  MapPin,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  Phone,
  Mail,
  Clock,
  Star,
  X,
  Save,
  Building,
  Map,
} from "lucide-react";

const GymLocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // add, edit
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    district: "",
    coordinates: { lat: 0, lng: 0 },
    phone: "",
    email: "",
    openingHours: "",
    facilities: [],
    images: [],
    rating: 0,
  });

  const cities = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng"];
  const facilityOptions = [
    "Phòng tập gym",
    "Phòng yoga",
    "Phòng cardio",
    "Bể bơi",
    "Sân tennis",
    "Phòng boxing",
    "Sauna",
    "Phòng tắm hơi",
    "Căn tin",
    "Bãi đậu xe",
    "Wifi miễn phí",
    "Tủ khóa cá nhân",
  ];

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/gym-locations");
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
      showNotification("❌ Lỗi khi tải danh sách gym", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "lat" || name === "lng") {
      setFormData((prev) => ({
        ...prev,
        coordinates: { ...prev.coordinates, [name]: parseFloat(value) || 0 },
      }));
    } else if (name === "rating") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFacilityToggle = (facility) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      district: "",
      coordinates: { lat: 0, lng: 0 },
      phone: "",
      email: "",
      openingHours: "",
      facilities: [],
      images: [],
      rating: 0,
    });
  };

  const openModal = (type, location = null) => {
    setModalType(type);
    setSelectedLocation(location);
    if (location && type !== "add") {
      setFormData({
        name: location.name || "",
        address: location.address || "",
        city: location.city || "",
        district: location.district || "",
        coordinates: location.coordinates || { lat: 0, lng: 0 },
        phone: location.phone || "",
        email: location.email || "",
        openingHours: location.openingHours || "",
        facilities: location.facilities || [],
        images: location.images || [],
        rating: location.rating || 0,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLocation(null);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (modalType === "add") {
        await axios.post("http://localhost:5000/api/gym-locations", formData, config);
        showNotification("✅ Thêm gym thành công!", "success");
      } else {
        await axios.put(
          `http://localhost:5000/api/gym-locations/${selectedLocation._id}`,
          formData,
          config
        );
        showNotification("✅ Cập nhật gym thành công!", "success");
      }

      fetchLocations();
      closeModal();
    } catch (error) {
      console.error("Error saving location:", error);
      showNotification("❌ Lỗi khi lưu gym", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa gym này?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/gym-locations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification("✅ Xóa gym thành công!", "success");
      fetchLocations();
    } catch (error) {
      console.error("Error deleting location:", error);
      showNotification("❌ Lỗi khi xóa gym", "error");
    }
  };

  const filteredLocations = locations.filter((location) => {
    const matchSearch =
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCity = filterCity === "all" || location.city === filterCity;
    return matchSearch && matchCity;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Notification */}
      {notification.message && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.message}
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl shadow-lg">
              <MapPin className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Quản Lý Gym Locations</h1>
              <p className="text-gray-500 mt-1">Quản lý các chi nhánh phòng gym</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal("add")}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus size={20} />
            Thêm Gym
          </motion.button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mt-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, địa chỉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="pl-12 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none appearance-none cursor-pointer transition-all bg-white"
            >
              <option value="all">Tất cả thành phố</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Locations Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location, index) => (
            <motion.div
              key={location._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
            >
              {/* Image */}
              <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 relative">
                {location.images && location.images[0] ? (
                  <img
                    src={location.images[0]}
                    alt={location.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building className="text-white" size={64} />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(showDropdown === location._id ? null : location._id)}
                      className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-all"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {showDropdown === location._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 overflow-hidden">
                        <button
                          onClick={() => {
                            openModal("edit", location);
                            setShowDropdown(null);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center gap-2 transition-all"
                        >
                          <Edit size={16} />
                          Chỉnh sửa
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(location._id);
                            setShowDropdown(null);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 transition-all"
                        >
                          <Trash2 size={16} />
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{location.name}</h3>
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-yellow-700">{location.rating || 0}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" />
                    <span>{location.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building size={16} className="text-green-500" />
                    <span>{location.city} - {location.district}</span>
                  </div>
                  {location.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-purple-500" />
                      <span>{location.phone}</span>
                    </div>
                  )}
                  {location.openingHours && (
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-orange-500" />
                      <span>{location.openingHours}</span>
                    </div>
                  )}
                </div>

                {/* Facilities */}
                {location.facilities && location.facilities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {location.facilities.slice(0, 3).map((facility) => (
                      <span
                        key={facility}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {facility}
                      </span>
                    ))}
                    {location.facilities.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{location.facilities.length - 3} khác
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredLocations.length === 0 && !loading && (
        <div className="text-center py-20">
          <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Không tìm thấy gym nào</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {modalType === "add" ? "Thêm Gym Mới" : "Chỉnh Sửa Gym"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên Gym *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="VD: Fitness 24/7 Hà Nội"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Địa chỉ *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="VD: 123 Đường ABC"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Thành phố *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                  >
                    <option value="">Chọn thành phố</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quận/Huyện *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="VD: Quận 1"
                  />
                </div>

                {/* Coordinates */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vĩ độ (Latitude) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="lat"
                    value={formData.coordinates.lat}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="VD: 21.0285"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kinh độ (Longitude) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="lng"
                    value={formData.coordinates.lng}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="VD: 105.8542"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="VD: 0901234567"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="VD: contact@gym.com"
                  />
                </div>

                {/* Opening Hours */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giờ mở cửa
                  </label>
                  <input
                    type="text"
                    name="openingHours"
                    value={formData.openingHours}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="VD: 5:00 - 23:00 hàng ngày"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Đánh giá (0-5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="VD: 4.5"
                  />
                </div>

                {/* Facilities */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tiện ích
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {facilityOptions.map((facility) => (
                      <label
                        key={facility}
                        className="flex items-center gap-2 p-2 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={formData.facilities.includes(facility)}
                          onChange={() => handleFacilityToggle(facility)}
                          className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm">{facility}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {modalType === "add" ? "Thêm Gym" : "Cập Nhật"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GymLocationManagement;

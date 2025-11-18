import GymLocation from "../models/GymLocation.js";

// Get all gym locations
export const getAllGyms = async (req, res) => {
  try {
    const gyms = await GymLocation.find({ isActive: true }).sort({ name: 1 });
    res.json(gyms);
  } catch (error) {
    console.error("Error getting all gyms:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách phòng gym" });
  }
};

// Get nearby gyms based on user location
export const getNearbyGyms = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Vui lòng cung cấp tọa độ" });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    const gyms = await GymLocation.find({ isActive: true });

    // Calculate distance for each gym
    const gymsWithDistance = gyms
      .map((gym) => {
        const distance = gym.distanceFrom(lat, lon);
        return {
          ...gym.toObject(),
          distance: distance.toFixed(2),
        };
      })
      .filter((gym) => gym.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);

    res.json(gymsWithDistance);
  } catch (error) {
    console.error("Error getting nearby gyms:", error);
    res.status(500).json({ message: "Lỗi khi tìm phòng gym gần đây" });
  }
};

// Get gym by ID
export const getGymById = async (req, res) => {
  try {
    const gym = await GymLocation.findById(req.params.id);
    
    if (!gym) {
      return res.status(404).json({ message: "Không tìm thấy phòng gym" });
    }

    res.json(gym);
  } catch (error) {
    console.error("Error getting gym by ID:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin phòng gym" });
  }
};

// Get gyms by city
export const getGymsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const gyms = await GymLocation.find({ city, isActive: true }).sort({ name: 1 });
    res.json(gyms);
  } catch (error) {
    console.error("Error getting gyms by city:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách phòng gym theo thành phố" });
  }
};

// Admin: Create new gym location
export const createGym = async (req, res) => {
  try {
    const gymData = req.body;
    const gym = new GymLocation(gymData);
    await gym.save();
    res.status(201).json(gym);
  } catch (error) {
    console.error("Error creating gym:", error);
    res.status(500).json({ message: "Lỗi khi tạo phòng gym mới" });
  }
};

// Admin: Update gym location
export const updateGym = async (req, res) => {
  try {
    const gym = await GymLocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!gym) {
      return res.status(404).json({ message: "Không tìm thấy phòng gym" });
    }

    res.json(gym);
  } catch (error) {
    console.error("Error updating gym:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật thông tin phòng gym" });
  }
};

// Admin: Delete gym location
export const deleteGym = async (req, res) => {
  try {
    const gym = await GymLocation.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!gym) {
      return res.status(404).json({ message: "Không tìm thấy phòng gym" });
    }

    res.json({ message: "Đã xóa phòng gym thành công" });
  } catch (error) {
    console.error("Error deleting gym:", error);
    res.status(500).json({ message: "Lỗi khi xóa phòng gym" });
  }
};

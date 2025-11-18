import BodyMetrics from "../models/BodyMetrics.js";
import User from "../models/User.js";

// Create new body metrics entry
export const createBodyMetrics = async (req, res) => {
  try {
    const userId = req.user.id;
    const metricsData = {
      ...req.body,
      user: userId,
    };

    const metrics = new BodyMetrics(metricsData);
    await metrics.save();

    res.status(201).json({
      success: true,
      data: metrics,
      message: "Đã lưu số đo thành công",
    });
  } catch (error) {
    console.error("Error creating body metrics:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lưu số đo cơ thể",
    });
  }
};

// Get all body metrics for user
export const getUserBodyMetrics = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const { startDate, endDate, limit = 50 } = req.query;

    let query = { user: userId };

    // Filter by date range if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const metrics = await BodyMetrics.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    // Calculate statistics
    const stats = await calculateStats(userId);

    res.json({
      success: true,
      data: metrics,
      stats,
    });
  } catch (error) {
    console.error("Error getting body metrics:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy dữ liệu số đo",
    });
  }
};

// Get single body metrics entry
export const getBodyMetricsById = async (req, res) => {
  try {
    const metrics = await BodyMetrics.findById(req.params.id);

    if (!metrics) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy số đo",
      });
    }

    // Check if user owns this metrics
    if (metrics.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error("Error getting body metrics:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy số đo",
    });
  }
};

// Update body metrics
export const updateBodyMetrics = async (req, res) => {
  try {
    let metrics = await BodyMetrics.findById(req.params.id);

    if (!metrics) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy số đo",
      });
    }

    // Check ownership
    if (metrics.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Không có quyền chỉnh sửa",
      });
    }

    metrics = await BodyMetrics.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: metrics,
      message: "Cập nhật số đo thành công",
    });
  } catch (error) {
    console.error("Error updating body metrics:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật số đo",
    });
  }
};

// Delete body metrics
export const deleteBodyMetrics = async (req, res) => {
  try {
    const metrics = await BodyMetrics.findById(req.params.id);

    if (!metrics) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy số đo",
      });
    }

    // Check ownership
    if (metrics.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Không có quyền xóa",
      });
    }

    await metrics.deleteOne();

    res.json({
      success: true,
      message: "Đã xóa số đo thành công",
    });
  } catch (error) {
    console.error("Error deleting body metrics:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa số đo",
    });
  }
};

// Get latest metrics
export const getLatestMetrics = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    const latest = await BodyMetrics.findOne({ user: userId }).sort({
      date: -1,
    });

    if (!latest) {
      return res.json({
        success: true,
        data: null,
        message: "Chưa có dữ liệu số đo",
      });
    }

    res.json({
      success: true,
      data: latest,
    });
  } catch (error) {
    console.error("Error getting latest metrics:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy số đo mới nhất",
    });
  }
};

// Get progress comparison
export const getProgress = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const { period = "month" } = req.query; // week, month, 3months, 6months, year

    const now = new Date();
    let startDate;

    switch (period) {
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "3months":
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case "6months":
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    const metrics = await BodyMetrics.find({
      user: userId,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    if (metrics.length === 0) {
      return res.json({
        success: true,
        data: {
          progress: [],
          summary: null,
        },
      });
    }

    const first = metrics[0];
    const latest = metrics[metrics.length - 1];

    const summary = {
      weightChange: latest.weight - first.weight,
      bmiChange: latest.bmi - first.bmi,
      bodyFatChange: latest.bodyFat
        ? latest.bodyFat - (first.bodyFat || 0)
        : null,
      period,
      startDate: first.date,
      endDate: latest.date,
    };

    res.json({
      success: true,
      data: {
        progress: metrics,
        summary,
      },
    });
  } catch (error) {
    console.error("Error getting progress:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy tiến trình",
    });
  }
};

// Helper function to calculate statistics
async function calculateStats(userId) {
  const allMetrics = await BodyMetrics.find({ user: userId }).sort({ date: 1 });

  if (allMetrics.length === 0) {
    return null;
  }

  const first = allMetrics[0];
  const latest = allMetrics[allMetrics.length - 1];

  const totalWeightChange = latest.weight - first.weight;
  const avgWeight =
    allMetrics.reduce((sum, m) => sum + m.weight, 0) / allMetrics.length;

  return {
    totalEntries: allMetrics.length,
    firstEntry: first.date,
    latestEntry: latest.date,
    currentWeight: latest.weight,
    currentBMI: latest.bmi,
    currentBMICategory: latest.getBMICategory(),
    totalWeightChange,
    avgWeight: avgWeight.toFixed(1),
    lowestWeight: Math.min(...allMetrics.map((m) => m.weight)),
    highestWeight: Math.max(...allMetrics.map((m) => m.weight)),
  };
}

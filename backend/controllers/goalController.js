import Goal from "../models/Goal.js";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";

// Create a new goal
export const createGoal = async (req, res) => {
  try {
    const { title, description, type, targetValue, unit, endDate } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!title || !targetValue || !endDate) {
      return res.status(400).json({ 
        message: "Title, target value, and end date are required" 
      });
    }

    // Validate target value
    if (targetValue <= 0) {
      return res.status(400).json({ 
        message: "Target value must be greater than 0" 
      });
    }

    // Validate end date
    if (new Date(endDate) <= new Date()) {
      return res.status(400).json({ 
        message: "End date must be in the future" 
      });
    }

    // For attendance goals, set current value from actual attendance
    let currentValue = 0;
    if (type === 'attendance') {
      const attendances = await Attendance.find({
        user: userId,
        status: 'present',
        date: { $gte: new Date() }
      });
      currentValue = attendances.length;
    }

    const goal = new Goal({
      user: userId,
      title,
      description,
      type: type || 'custom',
      targetValue,
      currentValue,
      unit: unit || 'buổi',
      endDate,
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).json({ 
      message: "Error creating goal",
      error: error.message 
    });
  }
};

// Get user's goals
export const getUserGoals = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    // Build query
    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    const goals = await Goal.find(query).sort({ createdAt: -1 });

    // Update expired goals
    for (const goal of goals) {
      if (goal.isExpired && goal.status === 'active') {
        goal.status = 'failed';
        await goal.save();
      }
    }

    res.json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ 
      message: "Error fetching goals",
      error: error.message 
    });
  }
};

// Get goal by ID
export const getGoalById = async (req, res) => {
  try {
    const { goalId } = req.params;

    const goal = await Goal.findById(goalId).populate('user', 'name email');

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json(goal);
  } catch (error) {
    console.error("Error fetching goal:", error);
    res.status(500).json({ 
      message: "Error fetching goal",
      error: error.message 
    });
  }
};

// Update goal progress
export const updateGoalProgress = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { currentValue } = req.body;
    const userId = req.user.id;

    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Check ownership
    if (goal.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this goal" });
    }

    // Validate current value
    if (currentValue === undefined || currentValue < 0) {
      return res.status(400).json({ 
        message: "Current value must be a non-negative number" 
      });
    }

    goal.currentValue = currentValue;
    await goal.save();

    res.json(goal);
  } catch (error) {
    console.error("Error updating goal progress:", error);
    res.status(500).json({ 
      message: "Error updating goal progress",
      error: error.message 
    });
  }
};

// Update goal details
export const updateGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { title, description, targetValue, unit, endDate, status } = req.body;
    const userId = req.user.id;

    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Check ownership
    if (goal.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this goal" });
    }

    // Update fields
    if (title) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (targetValue && targetValue > 0) goal.targetValue = targetValue;
    if (unit) goal.unit = unit;
    if (endDate && new Date(endDate) > new Date()) goal.endDate = endDate;
    if (status && ['active', 'completed', 'failed', 'cancelled'].includes(status)) {
      goal.status = status;
    }

    await goal.save();
    res.json(goal);
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ 
      message: "Error updating goal",
      error: error.message 
    });
  }
};

// Delete goal
export const deleteGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    const userId = req.user.id;

    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Check ownership
    if (goal.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this goal" });
    }

    await Goal.findByIdAndDelete(goalId);
    res.json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ 
      message: "Error deleting goal",
      error: error.message 
    });
  }
};

// Get goal statistics
export const getGoalStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const totalGoals = await Goal.countDocuments({ user: userId });
    const activeGoals = await Goal.countDocuments({ user: userId, status: 'active' });
    const completedGoals = await Goal.countDocuments({ user: userId, status: 'completed' });
    const failedGoals = await Goal.countDocuments({ user: userId, status: 'failed' });

    const completionRate = totalGoals > 0 
      ? Math.round((completedGoals / totalGoals) * 100) 
      : 0;

    res.json({
      totalGoals,
      activeGoals,
      completedGoals,
      failedGoals,
      completionRate,
    });
  } catch (error) {
    console.error("Error fetching goal stats:", error);
    res.status(500).json({ 
      message: "Error fetching goal statistics",
      error: error.message 
    });
  }
};

import User from "../models/User.js";
import ClassEnrollment from "../models/ClassEnrollment.js";
import Attendance from "../models/Attendance.js";
import Membership from "../models/Membership.js";
import Class from "../models/Class.js";

// Get calendar events for a user
export const getCalendarEvents = async (req, res) => {
  try {
    const { userId } = req.params;
    const { year, month } = req.query;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Default to current month if not specified
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const currentMonth = month ? parseInt(month) - 1 : new Date().getMonth();

    // Get start and end dates for the month
    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    const events = [];

    // Get class enrollments
    const enrollments = await ClassEnrollment.find({
      user: userId,
      status: { $in: ['active', 'completed'] },
      enrollmentDate: { $gte: startDate, $lte: endDate }
    }).populate('class', 'name schedule');

    enrollments.forEach(enrollment => {
      if (enrollment.class) {
        events.push({
          _id: enrollment._id.toString(),
          date: enrollment.enrollmentDate,
          type: 'class',
          title: `Đăng ký: ${enrollment.class.name}`,
          time: enrollment.class.schedule || undefined,
          status: enrollment.status,
        });
      }
    });

    // Get attendance records
    const attendances = await Attendance.find({
      user: userId,
      status: 'present',
      date: { $gte: startDate, $lte: endDate }
    }).populate('class', 'name schedule');

    attendances.forEach(attendance => {
      if (attendance.class) {
        events.push({
          _id: attendance._id.toString(),
          date: attendance.date,
          type: 'attendance',
          title: `Điểm danh: ${attendance.class.name}`,
          time: attendance.class.schedule || undefined,
          status: 'completed',
        });
      }
    });

    // Get membership events (start/end dates)
    const memberships = await Membership.find({
      user: userId,
      $or: [
        { startDate: { $gte: startDate, $lte: endDate } },
        { endDate: { $gte: startDate, $lte: endDate } }
      ]
    });

    memberships.forEach(membership => {
      // Add start date event
      if (membership.startDate >= startDate && membership.startDate <= endDate) {
        events.push({
          _id: `${membership._id}-start`,
          date: membership.startDate,
          type: 'membership',
          title: `Bắt đầu gói: ${membership.type}`,
          status: 'active',
        });
      }

      // Add end date event
      if (membership.endDate >= startDate && membership.endDate <= endDate) {
        events.push({
          _id: `${membership._id}-end`,
          date: membership.endDate,
          type: 'membership',
          title: `Hết hạn gói: ${membership.type}`,
          status: membership.status === 'active' ? 'upcoming' : 'expired',
        });
      }
    });

    // Also get future class schedules (for next 30 days from current month)
    const futureEndDate = new Date(endDate);
    futureEndDate.setDate(futureEndDate.getDate() + 30);

    const activeEnrollments = await ClassEnrollment.find({
      user: userId,
      status: 'active',
    }).populate({
      path: 'class',
      match: {
        status: { $in: ['ongoing', 'upcoming'] },
        startDate: { $lte: futureEndDate }
      },
      select: 'name schedule startDate'
    });

    activeEnrollments.forEach(enrollment => {
      if (enrollment.class && enrollment.class.startDate) {
        const classDate = new Date(enrollment.class.startDate);
        
        // Only add if within current month view
        if (classDate >= startDate && classDate <= endDate) {
          // Check if we haven't already added this class
          const exists = events.some(e => 
            e.type === 'class' && 
            e.title.includes(enrollment.class.name) &&
            new Date(e.date).toDateString() === classDate.toDateString()
          );

          if (!exists) {
            events.push({
              _id: `${enrollment._id}-schedule`,
              date: classDate,
              type: 'class',
              title: `Lớp: ${enrollment.class.name}`,
              time: enrollment.class.schedule || undefined,
              status: 'upcoming',
            });
          }
        }
      }
    });

    // Sort events by date
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    res.json(events);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    res.status(500).json({ 
      message: "Error fetching calendar events",
      error: error.message 
    });
  }
};

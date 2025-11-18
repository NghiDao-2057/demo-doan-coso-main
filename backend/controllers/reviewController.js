import Review from "../models/Review.js";
import Class from "../models/Class.js";
import Service from "../models/Service.js";
import User from "../models/User.js";

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { classId, serviceId, rating, comment } = req.body;
    const userId = req.user.id;

    // Validate that either classId or serviceId is provided
    if (!classId && !serviceId) {
      return res.status(400).json({ message: "Class ID or Service ID is required" });
    }

    if (classId && serviceId) {
      return res.status(400).json({ message: "Cannot review both class and service at once" });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check if user already reviewed this class/service
    const existingReview = await Review.findOne({
      user: userId,
      ...(classId ? { class: classId } : { service: serviceId })
    });

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this item" });
    }

    // Verify class or service exists
    if (classId) {
      const classExists = await Class.findById(classId);
      if (!classExists) {
        return res.status(404).json({ message: "Class not found" });
      }
    } else {
      const serviceExists = await Service.findById(serviceId);
      if (!serviceExists) {
        return res.status(404).json({ message: "Service not found" });
      }
    }

    // Create review
    const review = new Review({
      user: userId,
      ...(classId ? { class: classId } : { service: serviceId }),
      rating,
      comment: comment || ''
    });

    await review.save();

    // Populate user info
    await review.populate('user', 'name email');

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ 
      message: "Error creating review",
      error: error.message 
    });
  }
};

// Get reviews for a class
export const getClassReviews = async (req, res) => {
  try {
    const { classId } = req.params;

    const reviews = await Review.find({ class: classId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      reviews,
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length
    });
  } catch (error) {
    console.error("Error fetching class reviews:", error);
    res.status(500).json({ 
      message: "Error fetching reviews",
      error: error.message 
    });
  }
};

// Get reviews for a service
export const getServiceReviews = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const reviews = await Review.find({ service: serviceId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      reviews,
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length
    });
  } catch (error) {
    console.error("Error fetching service reviews:", error);
    res.status(500).json({ 
      message: "Error fetching reviews",
      error: error.message 
    });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns this review
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Update fields
    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();
    await review.populate('user', 'name email');

    res.json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ 
      message: "Error updating review",
      error: error.message 
    });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns this review or is admin
    if (review.user.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ 
      message: "Error deleting review",
      error: error.message 
    });
  }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ user: userId })
      .populate('class', 'name')
      .populate('service', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ 
      message: "Error fetching reviews",
      error: error.message 
    });
  }
};

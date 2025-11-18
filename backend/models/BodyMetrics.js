import mongoose from "mongoose";

const bodyMetricsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    weight: {
      type: Number,
      required: true,
      min: 20,
      max: 300,
    },
    height: {
      type: Number,
      min: 100,
      max: 250,
    },
    bmi: {
      type: Number,
    },
    bodyFat: {
      type: Number,
      min: 0,
      max: 100,
    },
    muscleMass: {
      type: Number,
      min: 0,
      max: 100,
    },
    measurements: {
      chest: {
        type: Number,
        min: 0,
      },
      waist: {
        type: Number,
        min: 0,
      },
      hips: {
        type: Number,
        min: 0,
      },
      biceps: {
        type: Number,
        min: 0,
      },
      thighs: {
        type: Number,
        min: 0,
      },
      calves: {
        type: Number,
        min: 0,
      },
    },
    photos: [
      {
        url: String,
        public_id: String,
        type: {
          type: String,
          enum: ["front", "side", "back"],
          default: "front",
        },
      },
    ],
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate BMI before saving
bodyMetricsSchema.pre("save", function (next) {
  if (this.weight && this.height) {
    const heightInMeters = this.height / 100;
    this.bmi = Number((this.weight / (heightInMeters * heightInMeters)).toFixed(1));
  }
  next();
});

// Index for efficient queries
bodyMetricsSchema.index({ user: 1, date: -1 });

// Method to get BMI category
bodyMetricsSchema.methods.getBMICategory = function () {
  if (!this.bmi) return "Chưa xác định";
  if (this.bmi < 18.5) return "Gầy";
  if (this.bmi < 25) return "Bình thường";
  if (this.bmi < 30) return "Thừa cân";
  return "Béo phì";
};

// Static method to get user's progress
bodyMetricsSchema.statics.getUserProgress = async function (userId, startDate, endDate) {
  return this.find({
    user: userId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: 1 });
};

const BodyMetrics = mongoose.model("BodyMetrics", bodyMetricsSchema);

export default BodyMetrics;

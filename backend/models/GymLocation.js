import mongoose from "mongoose";

const gymLocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    district: {
      type: String,
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    openingHours: {
      type: String,
      default: "06:00 - 23:00",
    },
    facilities: [String],
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
gymLocationSchema.index({ "coordinates.latitude": 1, "coordinates.longitude": 1 });
gymLocationSchema.index({ city: 1, district: 1 });

// Method to calculate distance from a point
gymLocationSchema.methods.distanceFrom = function (lat, lon) {
  const R = 6371; // Earth radius in km
  const dLat = (lat - this.coordinates.latitude) * (Math.PI / 180);
  const dLon = (lon - this.coordinates.longitude) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.coordinates.latitude * (Math.PI / 180)) *
      Math.cos(lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const GymLocation = mongoose.model("GymLocation", gymLocationSchema);

export default GymLocation;

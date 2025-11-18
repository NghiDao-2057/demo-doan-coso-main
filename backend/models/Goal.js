import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['attendance', 'weight', 'custom'],
    default: 'custom'
  },
  targetValue: {
    type: Number,
    required: true
  },
  currentValue: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: 'buổi'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'failed', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate progress percentage
goalSchema.virtual('progress').get(function() {
  if (this.targetValue === 0) return 0;
  return Math.min(Math.round((this.currentValue / this.targetValue) * 100), 100);
});

// Check if goal is expired
goalSchema.virtual('isExpired').get(function() {
  return new Date() > this.endDate && this.status === 'active';
});

// Auto-update status based on progress and dates
goalSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Check if goal is completed
  if (this.currentValue >= this.targetValue && this.status === 'active') {
    this.status = 'completed';
  }
  
  // Check if goal is expired and failed
  if (new Date() > this.endDate && this.status === 'active' && this.currentValue < this.targetValue) {
    this.status = 'failed';
  }
  
  next();
});

// Ensure virtuals are included in JSON
goalSchema.set('toJSON', { virtuals: true });
goalSchema.set('toObject', { virtuals: true });

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;

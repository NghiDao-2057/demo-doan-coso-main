// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin' | 'trainer';
  membershipStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

// Class Types
export interface Class {
  _id: string;
  name: string;
  description: string;
  instructor: string;
  schedule: string;
  duration: number;
  capacity: number;
  enrolledCount: number;
  price: number;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Membership Types
export interface Membership {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in days
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserMembership {
  _id: string;
  userId: string;
  membershipId: Membership;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Payment Types
export interface Payment {
  _id: string;
  userId: string;
  amount: number;
  type: 'membership' | 'class' | 'service';
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Service Types
export interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Attendance Types
export interface Attendance {
  _id: string;
  userId: string;
  classId: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'present' | 'absent' | 'late';
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

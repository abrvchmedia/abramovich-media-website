import mongoose, { Document, Schema } from 'mongoose';

export interface IAddOn {
  name: string;
  pricePerMonth: number;
  description: string;
}

export interface IPlanVariant {
  label: '4-month' | '12-month';
  pricePerMonth: number;
  total: number;
}

export interface IPlan extends Document {
  id: string;
  name: string;
  pricePerMonth: number;
  termMonths: 4 | 12;
  highlight?: boolean;
  description: string;
  includes: string[];
  bestFor: string[];
  addOns?: IAddOn[];
  variants?: IPlanVariant[];
  createdAt: Date;
  updatedAt: Date;
}

const AddOnSchema = new Schema<IAddOn>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Add-on name cannot be more than 100 characters'],
  },
  pricePerMonth: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters'],
  },
}, { _id: false });

const PlanVariantSchema = new Schema<IPlanVariant>({
  label: {
    type: String,
    required: true,
    enum: ['4-month', '12-month'],
  },
  pricePerMonth: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative'],
  },
}, { _id: false });

const PlanSchema = new Schema<IPlan>({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true,
    maxlength: [100, 'Plan name cannot be more than 100 characters'],
  },
  pricePerMonth: {
    type: Number,
    required: [true, 'Price per month is required'],
    min: [0, 'Price cannot be negative'],
  },
  termMonths: {
    type: Number,
    required: true,
    enum: [4, 12],
  },
  highlight: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  includes: [{
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Each include item cannot be more than 200 characters'],
  }],
  bestFor: [{
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Each best for item cannot be more than 100 characters'],
  }],
  addOns: [AddOnSchema],
  variants: [PlanVariantSchema],
}, {
  timestamps: true,
});

export default mongoose.models.Plan || mongoose.model<IPlan>('Plan', PlanSchema);

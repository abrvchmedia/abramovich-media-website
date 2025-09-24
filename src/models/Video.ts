import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo extends Document {
  id: string;
  title: string;
  client?: string;
  thumbnail: string;
  embedType: 'youtube' | 'vimeo' | 'mp4';
  embedIdOrUrl: string;
  tags: string[];
  duration?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  client: {
    type: String,
    trim: true,
    maxlength: [100, 'Client name cannot be more than 100 characters'],
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail is required'],
    trim: true,
  },
  embedType: {
    type: String,
    required: [true, 'Embed type is required'],
    enum: ['youtube', 'vimeo', 'mp4'],
  },
  embedIdOrUrl: {
    type: String,
    required: [true, 'Embed ID or URL is required'],
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Each tag cannot be more than 50 characters'],
  }],
  duration: {
    type: String,
    trim: true,
    match: [/^\d+:\d{2}$/, 'Duration must be in format MM:SS'],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

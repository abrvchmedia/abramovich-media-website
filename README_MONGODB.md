# MongoDB Integration for Abramovich Media LLC

## 🎯 Overview

This project now includes MongoDB integration for data persistence, allowing you to:
- Store contact form submissions
- Manage portfolio videos dynamically
- Manage pricing plans dynamically
- View all data through an admin dashboard

## 🚀 Quick Start

### 1. Set up MongoDB

**Option A: MongoDB Atlas (Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Add your IP address to the whitelist

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/abramovich-media
# For local: MONGODB_URI=mongodb://localhost:27017/abramovich-media
```

### 3. Seed Initial Data

```bash
npm run seed
```

This will populate your database with sample videos and pricing plans.

### 4. Start the Application

```bash
npm run dev
```

## 📊 Admin Dashboard

Access the admin dashboard at `/admin` to:
- View contact form submissions
- Manage portfolio videos
- Manage pricing plans
- Monitor data in real-time

## 🔧 API Endpoints

### Contact Management
- `POST /api/contact` - Submit contact form
- `GET /api/contacts` - Get all contacts

### Video Management
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Create new video

### Plan Management
- `GET /api/plans` - Get all plans
- `POST /api/plans` - Create new plan

## 📋 Database Schema

### Contact
```typescript
{
  name: string (required, max 100 chars)
  email: string (required, validated email)
  message: string (required, max 1000 chars)
  createdAt: Date
  updatedAt: Date
}
```

### Video
```typescript
{
  id: string (required, unique)
  title: string (required, max 200 chars)
  client?: string (optional, max 100 chars)
  thumbnail: string (required)
  embedType: 'youtube' | 'vimeo' | 'mp4' (required)
  embedIdOrUrl: string (required)
  tags: string[] (optional, max 50 chars each)
  duration?: string (optional, format: MM:SS)
  createdAt: Date
  updatedAt: Date
}
```

### Plan
```typescript
{
  id: string (required, unique)
  name: string (required, max 100 chars)
  pricePerMonth: number (required, min 0)
  termMonths: 4 | 12 (required)
  highlight?: boolean (optional)
  description: string (required, max 500 chars)
  includes: string[] (required, max 200 chars each)
  bestFor: string[] (required, max 100 chars each)
  addOns?: AddOn[] (optional)
  variants?: PlanVariant[] (optional)
  createdAt: Date
  updatedAt: Date
}
```

## 🛠️ Development

### Adding New Videos

```typescript
const newVideo = {
  id: "unique-video-id",
  title: "Video Title",
  client: "Client Name",
  thumbnail: "https://example.com/thumbnail.jpg",
  embedType: "youtube", // or "vimeo" or "mp4"
  embedIdOrUrl: "youtube-video-id",
  tags: ["tag1", "tag2"],
  duration: "1:30"
}

// POST to /api/videos
```

### Adding New Plans

```typescript
const newPlan = {
  id: "plan-id",
  name: "Plan Name",
  pricePerMonth: 2000,
  termMonths: 4,
  highlight: false,
  description: "Plan description",
  includes: ["Feature 1", "Feature 2"],
  bestFor: ["Target 1", "Target 2"],
  addOns: [
    {
      name: "Add-on Name",
      pricePerMonth: 500,
      description: "Add-on description"
    }
  ],
  variants: [
    { label: "4-month", pricePerMonth: 2000, total: 8000 },
    { label: "12-month", pricePerMonth: 1800, total: 21600 }
  ]
}

// POST to /api/plans
```

## 🔒 Security Features

- Input validation and sanitization
- Email format validation
- Length limits on all text fields
- MongoDB injection protection via Mongoose
- Error handling and logging

## 📈 Performance

- Connection pooling for MongoDB
- Cached connections in development
- Optimized queries with proper indexing
- Efficient data models

## 🚀 Deployment

The MongoDB integration works seamlessly with Vercel deployment:

1. Set up MongoDB Atlas
2. Add `MONGODB_URI` to Vercel environment variables
3. Deploy to Vercel
4. Run `npm run seed` to populate data

## 🐛 Troubleshooting

### Common Issues

1. **Connection Error**: Check your `MONGODB_URI` in `.env.local`
2. **Validation Error**: Ensure all required fields are provided
3. **Duplicate Key Error**: Use unique IDs for videos and plans
4. **Network Error**: Check your internet connection and MongoDB Atlas whitelist

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=mongoose:*
```

## 📚 Next Steps

1. **Email Integration**: Add email notifications for contact form submissions
2. **Authentication**: Add admin authentication for the dashboard
3. **File Upload**: Add image upload for video thumbnails
4. **Analytics**: Add usage analytics and reporting
5. **Backup**: Set up automated database backups

## 🤝 Support

For issues or questions:
1. Check the MongoDB Atlas documentation
2. Review the Mongoose documentation
3. Check the Next.js API routes documentation

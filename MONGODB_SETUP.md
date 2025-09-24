# MongoDB Setup Guide

## 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/abramovich-media
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/abramovich-media

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

## 2. MongoDB Options

### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Replace `<username>`, `<password>`, and `<dbname>` in the connection string
6. Add your IP address to the whitelist

### Option B: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/abramovich-media` as your MONGODB_URI

## 3. Seed Initial Data

Run the seeding script to populate your database with sample data:

```bash
npm run seed
```

## 4. Admin Dashboard

Access the admin dashboard at `/admin` to:
- View contact form submissions
- Manage portfolio videos
- Manage pricing plans

## 5. API Endpoints

- `POST /api/contact` - Submit contact form
- `GET /api/contacts` - Get all contacts
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Create new video
- `GET /api/plans` - Get all plans
- `POST /api/plans` - Create new plan

## 6. Database Schema

### Contact
- name: string (required)
- email: string (required, validated)
- message: string (required)
- createdAt: Date
- updatedAt: Date

### Video
- id: string (required, unique)
- title: string (required)
- client: string (optional)
- thumbnail: string (required)
- embedType: 'youtube' | 'vimeo' | 'mp4' (required)
- embedIdOrUrl: string (required)
- tags: string[] (optional)
- duration: string (optional, format: MM:SS)
- createdAt: Date
- updatedAt: Date

### Plan
- id: string (required, unique)
- name: string (required)
- pricePerMonth: number (required)
- termMonths: 4 | 12 (required)
- highlight: boolean (optional)
- description: string (required)
- includes: string[] (required)
- bestFor: string[] (required)
- addOns: AddOn[] (optional)
- variants: PlanVariant[] (optional)
- createdAt: Date
- updatedAt: Date

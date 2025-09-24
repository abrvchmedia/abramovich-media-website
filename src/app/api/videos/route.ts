import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Video from '@/models/Video'

// GET /api/videos - Get all videos
export async function GET() {
  try {
    await connectDB()
    
    const videos = await Video.find({}).sort({ createdAt: -1 })
    
    return NextResponse.json({ videos }, { status: 200 })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}

// POST /api/videos - Create a new video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, client, thumbnail, embedType, embedIdOrUrl, tags, duration } = body

    // Validate required fields
    if (!id || !title || !thumbnail || !embedType || !embedIdOrUrl) {
      return NextResponse.json(
        { error: 'ID, title, thumbnail, embedType, and embedIdOrUrl are required' },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if video with this ID already exists
    const existingVideo = await Video.findOne({ id })
    if (existingVideo) {
      return NextResponse.json(
        { error: 'Video with this ID already exists' },
        { status: 400 }
      )
    }

    const video = new Video({
      id,
      title,
      client,
      thumbnail,
      embedType,
      embedIdOrUrl,
      tags: tags || [],
      duration,
    })

    await video.save()

    return NextResponse.json(
      { 
        message: 'Video created successfully',
        video 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating video:', error)
    
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Please check your input and try again' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    )
  }
}

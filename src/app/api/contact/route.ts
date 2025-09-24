import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Contact from '@/models/Contact'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await connectDB()

    // Create new contact document
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    })

    // Save to database
    await contact.save()

    console.log('Contact form submission saved:', {
      id: contact._id,
      name: contact.name,
      email: contact.email,
      createdAt: contact.createdAt,
    })

    return NextResponse.json(
      { 
        message: 'Thank you for your message! We\'ll get back to you soon.',
        success: true,
        id: contact._id 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Please check your input and try again' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
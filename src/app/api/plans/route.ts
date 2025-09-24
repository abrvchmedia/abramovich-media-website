import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Plan from '@/models/Plan'

// GET /api/plans - Get all plans
export async function GET() {
  try {
    await connectDB()
    
    const plans = await Plan.find({}).sort({ pricePerMonth: 1 })
    
    return NextResponse.json({ plans }, { status: 200 })
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    )
  }
}

// POST /api/plans - Create a new plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, pricePerMonth, termMonths, highlight, description, includes, bestFor, addOns, variants } = body

    // Validate required fields
    if (!id || !name || !pricePerMonth || !termMonths || !description || !includes || !bestFor) {
      return NextResponse.json(
        { error: 'ID, name, pricePerMonth, termMonths, description, includes, and bestFor are required' },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if plan with this ID already exists
    const existingPlan = await Plan.findOne({ id })
    if (existingPlan) {
      return NextResponse.json(
        { error: 'Plan with this ID already exists' },
        { status: 400 }
      )
    }

    const plan = new Plan({
      id,
      name,
      pricePerMonth,
      termMonths,
      highlight: highlight || false,
      description,
      includes,
      bestFor,
      addOns: addOns || [],
      variants: variants || [],
    })

    await plan.save()

    return NextResponse.json(
      { 
        message: 'Plan created successfully',
        plan 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating plan:', error)
    
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Please check your input and try again' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create plan' },
      { status: 500 }
    )
  }
}

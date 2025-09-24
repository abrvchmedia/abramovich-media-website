import connectDB from '../src/lib/mongodb'
import Video from '../src/models/Video'
import Plan from '../src/models/Plan'

const sampleVideos = [
  {
    id: "city-of-mercy",
    title: "City of Mercy — Cinematic Short",
    client: "Independent",
    thumbnail: "https://picsum.photos/800/450?random=1",
    embedType: "youtube" as const,
    embedIdOrUrl: "dQw4w9WgXcQ",
    tags: ["cinematic", "short film", "4K"],
    duration: "1:12"
  },
  {
    id: "gym-brand-reel",
    title: "Gym Brand Reel",
    client: "Atlas Strength",
    thumbnail: "https://picsum.photos/800/450?random=2",
    embedType: "vimeo" as const,
    embedIdOrUrl: "76979871",
    tags: ["fitness", "ads", "social"],
    duration: "0:38"
  },
  {
    id: "fashion-edit",
    title: "Fashion Campaign Edit",
    client: "Eclipse Studio",
    thumbnail: "https://picsum.photos/800/450?random=3",
    embedType: "mp4" as const,
    embedIdOrUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    tags: ["fashion", "brand", "vertical"],
    duration: "0:22"
  }
]

const samplePlans = [
  {
    id: "starter",
    name: "Editing-Only",
    pricePerMonth: 1000,
    termMonths: 4 as const,
    description: "You shoot. We edit. Fast, on-brand deliverables for social.",
    includes: [
      "8 edited clips / mo (vertical or horizontal)",
      "Brand kit & templates",
      "2 rounds of revisions",
      "Drive/Dropbox workflow"
    ],
    bestFor: ["Budget", "Remote-only", "Consistent social output"],
    addOns: [
      {
        name: "Social Media Management",
        pricePerMonth: 800,
        description: "Posting, scheduling, copy, hashtag research."
      },
      {
        name: "Ads Management",
        pricePerMonth: 1500,
        description: "Meta/TikTok ad setup, split tests, reports."
      },
      {
        name: "Landing Page + Hosting",
        pricePerMonth: 300,
        description: "Conversion page, analytics, uptime, updates."
      }
    ],
    variants: [
      { label: "4-month" as const, pricePerMonth: 1000, total: 4000 },
      { label: "12-month" as const, pricePerMonth: 900, total: 10800 }
    ]
  },
  {
    id: "core",
    name: "Core Media Retainer",
    pricePerMonth: 2000,
    termMonths: 4 as const,
    highlight: true,
    description: "Cinematography + editing + social assets on a monthly cadence.",
    includes: [
      "1 shoot day / mo (or remote capture coaching)",
      "12 edited clips + 1 hero cut",
      "Color, sound polish, captions",
      "Monthly content calendar"
    ],
    bestFor: ["Gyms", "Coaches", "Local brands"],
    addOns: [
      {
        name: "Social Media Management",
        pricePerMonth: 800,
        description: "Posting, scheduling, copy, hashtag research."
      },
      {
        name: "Ads Management",
        pricePerMonth: 1500,
        description: "Meta/TikTok ad setup, split tests, reports."
      },
      {
        name: "Landing Page + Hosting",
        pricePerMonth: 300,
        description: "Conversion page, analytics, uptime, updates."
      }
    ],
    variants: [
      { label: "4-month" as const, pricePerMonth: 2000, total: 8000 },
      { label: "12-month" as const, pricePerMonth: 1800, total: 21600 }
    ]
  },
  {
    id: "premium",
    name: "Premium Cinematic",
    pricePerMonth: 3000,
    termMonths: 4 as const,
    description: "Cinematic capture, VFX accents, and a content engine that converts.",
    includes: [
      "2 shoot days / mo or remote crew",
      "16 edited clips + 2 hero cuts",
      "Motion graphics / light VFX",
      "Quarterly campaign planning"
    ],
    bestFor: ["Premium brands", "Launches", "National campaigns"],
    addOns: [
      {
        name: "Social Media Management",
        pricePerMonth: 800,
        description: "Posting, scheduling, copy, hashtag research."
      },
      {
        name: "Ads Management",
        pricePerMonth: 1500,
        description: "Meta/TikTok ad setup, split tests, reports."
      },
      {
        name: "Landing Page + Hosting",
        pricePerMonth: 300,
        description: "Conversion page, analytics, uptime, updates."
      }
    ],
    variants: [
      { label: "4-month" as const, pricePerMonth: 3000, total: 12000 },
      { label: "12-month" as const, pricePerMonth: 2700, total: 32400 }
    ]
  }
]

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...')
    
    // Connect to MongoDB
    await connectDB()
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    await Video.deleteMany({})
    await Plan.deleteMany({})
    console.log('🗑️  Cleared existing data')

    // Seed videos
    await Video.insertMany(sampleVideos)
    console.log(`✅ Seeded ${sampleVideos.length} videos`)

    // Seed plans
    await Plan.insertMany(samplePlans)
    console.log(`✅ Seeded ${samplePlans.length} plans`)

    console.log('🎉 Data seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  }
}

// Run the seeding function
seedData()

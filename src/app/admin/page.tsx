"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Eye, Plus } from 'lucide-react'

interface Contact {
  _id: string
  name: string
  email: string
  message: string
  createdAt: string
}

interface Video {
  _id: string
  id: string
  title: string
  client?: string
  thumbnail: string
  embedType: 'youtube' | 'vimeo' | 'mp4'
  tags: string[]
  duration?: string
  createdAt: string
}

interface Plan {
  _id: string
  id: string
  name: string
  pricePerMonth: number
  termMonths: 4 | 12
  highlight?: boolean
  description: string
  includes: string[]
  bestFor: string[]
  createdAt: string
}

export default function AdminDashboard() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'contacts' | 'videos' | 'plans'>('contacts')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch contacts
      const contactsRes = await fetch('/api/contacts')
      const contactsData = await contactsRes.json()
      setContacts(contactsData.contacts || [])

      // Fetch videos
      const videosRes = await fetch('/api/videos')
      const videosData = await videosRes.json()
      setVideos(videosData.videos || [])

      // Fetch plans
      const plansRes = await fetch('/api/plans')
      const plansData = await plansRes.json()
      setPlans(plansData.plans || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-xl">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Manage your website content and data</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'contacts' 
                ? 'bg-white text-gray-900' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Contacts ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'videos' 
                ? 'bg-white text-gray-900' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Videos ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'plans' 
                ? 'bg-white text-gray-900' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Plans ({plans.length})
          </button>
        </div>

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Contact Submissions</h2>
              <Button onClick={fetchData} variant="outline">
                Refresh
              </Button>
            </div>
            
            {contacts.length === 0 ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400">No contact submissions yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {contacts.map((contact) => (
                  <Card key={contact._id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{contact.name}</CardTitle>
                          <CardDescription className="text-gray-400">
                            {contact.email} • {formatDate(contact.createdAt)}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-400 hover:text-red-300">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">{contact.message}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Portfolio Videos</h2>
              <Button onClick={fetchData} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Video
              </Button>
            </div>
            
            {videos.length === 0 ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400">No videos added yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => (
                  <Card key={video._id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">{video.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {video.client} • {video.embedType}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {video.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-400">
                          Added: {formatDate(video.createdAt)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Pricing Plans</h2>
              <Button onClick={fetchData} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Plan
              </Button>
            </div>
            
            {plans.length === 0 ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400">No plans added yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <Card key={plan._id} className={`bg-gray-800 border-gray-700 ${plan.highlight ? 'border-2 border-white' : ''}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{plan.name}</CardTitle>
                          <CardDescription className="text-gray-400">
                            ${plan.pricePerMonth}/mo • {plan.termMonths} months
                          </CardDescription>
                        </div>
                        {plan.highlight && (
                          <Badge className="bg-blue-600">Featured</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-300">{plan.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {plan.bestFor.map((item) => (
                            <Badge key={item} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-400">
                          Added: {formatDate(plan.createdAt)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

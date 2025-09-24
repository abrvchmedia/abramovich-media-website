"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { Plan } from "@/data/pricing"

interface PlanModalProps {
  plan: Plan | null
  isOpen: boolean
  onClose: () => void
}

export function PlanModal({ plan, isOpen, onClose }: PlanModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<"4-month" | "12-month">("4-month")
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])

  if (!plan) return null

  const currentVariant = plan.variants?.find(v => v.label === selectedVariant)
  const currentPrice = currentVariant?.pricePerMonth || plan.pricePerMonth

  const toggleAddOn = (addOnName: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnName) 
        ? prev.filter(name => name !== addOnName)
        : [...prev, addOnName]
    )
  }

  const calculateTotal = () => {
    const addOnTotal = selectedAddOns.reduce((total, addOnName) => {
      const addOn = plan.addOns?.find(a => a.name === addOnName)
      return total + (addOn?.pricePerMonth || 0)
    }, 0)
    
    return currentPrice + addOnTotal
  }

  const handleContact = () => {
    // This would typically open a contact form or redirect
    console.log("Contact clicked for plan:", plan.id)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{plan.name}</DialogTitle>
          <p className="text-muted-foreground">{plan.description}</p>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="addons">Add-ons</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>What&apos;s Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.includes.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Best For</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {plan.bestFor.map((item, index) => (
                      <Badge key={index} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="addons" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Available Add-ons</h3>
              <div className="space-y-4">
                {plan.addOns?.map((addOn, index) => (
                  <Card 
                    key={index} 
                    className={`cursor-pointer transition-colors ${
                      selectedAddOns.includes(addOn.name) 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => toggleAddOn(addOn.name)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{addOn.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {addOn.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">
                            +${addOn.pricePerMonth.toLocaleString()}/mo
                          </span>
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedAddOns.includes(addOn.name)
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground'
                          }`}>
                            {selectedAddOns.includes(addOn.name) && (
                              <Check className="h-3 w-3 text-primary-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Term Options</CardTitle>
                  <CardDescription>Choose your commitment period</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.variants?.map((variant) => (
                    <div 
                      key={variant.label}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedVariant === variant.label
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedVariant(variant.label)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{variant.label}</h4>
                          <p className="text-sm text-muted-foreground">
                            Total: ${variant.total.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            ${variant.pricePerMonth.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">/month</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Base Plan ({selectedVariant})</span>
                    <span>${currentPrice.toLocaleString()}/mo</span>
                  </div>
                  
                  {selectedAddOns.map((addOnName) => {
                    const addOn = plan.addOns?.find(a => a.name === addOnName)
                    return addOn ? (
                      <div key={addOnName} className="flex justify-between text-sm text-muted-foreground">
                        <span>+ {addOnName}</span>
                        <span>+${addOn.pricePerMonth.toLocaleString()}/mo</span>
                      </div>
                    ) : null
                  })}
                  
                  <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${calculateTotal().toLocaleString()}/mo</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-6 border-t">
          <Button onClick={handleContact} className="flex-1">
            Contact Us
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

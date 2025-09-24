import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { Plan } from "@/data/pricing"

interface PlanCardProps {
  plan: Plan
  onViewDetails: () => void
}

export function PlanCard({ plan, onViewDetails }: PlanCardProps) {
  return (
    <Card className={`relative ${plan.highlight ? 'border-primary shadow-lg scale-105' : ''}`}>
      {plan.highlight && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription className="text-base">
          {plan.description}
        </CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">${plan.pricePerMonth.toLocaleString()}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {plan.includes.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">{item}</span>
            </li>
          ))}
        </ul>

        <div className="pt-4">
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Best for:</h4>
          <div className="flex flex-wrap gap-1">
            {plan.bestFor.map((item, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={onViewDetails} 
          className="w-full"
          variant={plan.highlight ? "default" : "outline"}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, TrendingUp, AlertCircle } from "lucide-react"

export default function JobsPage() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Job Completion Rate</CardTitle>
          <CardDescription>Percentage of jobs completed on time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Progress value={85} className="h-2" />
            </div>
            <div className="ml-4 font-medium">85%</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            85% of jobs were completed on time in the last 30 days.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Job Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm">Electrical repair job completed by Alice Smith</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm">Painting job in progress by Bob Johnson</span>
            </div>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="text-sm">Plumbing job pending assignment</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
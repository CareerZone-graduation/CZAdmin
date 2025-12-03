import { Card, CardContent } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

const JobListSkeleton = ({ count = 3, className }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="flex-1 min-w-0 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export { JobListSkeleton }
export default JobListSkeleton

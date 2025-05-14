import { Loader2 } from "lucide-react"

const LoadingDiv = () => {
  return (
    <div className="flex items-center gap-2">
        <Loader2 size="6" />
        <span>Loading...</span>
    </div>
  )
}

export default LoadingDiv
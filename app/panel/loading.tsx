import { LoadingSpinner } from "../components/LoadingProvider";

export default function Loading() {
  return (
    <div className="h-screen bg-background dark:bg-background-tertiary">
      <LoadingSpinner />
    </div>
  )
}
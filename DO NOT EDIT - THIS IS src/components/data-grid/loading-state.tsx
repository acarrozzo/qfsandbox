import { LoadingSpinner } from '@mntn-dev/ui-components'

export function LoadingState() {
  return (
    <div className="py-12 text-center">
      <LoadingSpinner className="h-12 w-12 mx-auto mb-4" />
      <p className="text-sm text-gray-400">Loading transactions...</p>
    </div>
  )
}

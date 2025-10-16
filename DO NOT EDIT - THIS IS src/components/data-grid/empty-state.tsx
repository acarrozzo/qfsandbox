import { cn } from '@mntn-dev/ui-utilities'

export function EmptyState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'py-12 flex flex-col gap-4 items-center justify-center',
        className
      )}
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary backdrop-blur-md">
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <h3 className="text-lg font-medium text-primary">
          No transactions found
        </h3>
        <p className="text-sm text-secondary">
          There are no transactions matching your current filters.
        </p>
      </div>
    </div>
  )
}

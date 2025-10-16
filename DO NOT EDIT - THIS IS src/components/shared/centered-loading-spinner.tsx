import { LoadingSpinner, Stack } from '@mntn-dev/ui-components'

type Props = {
  className?: string
}

export const CenteredLoadingSpinner = ({ className = '' }: Props) => {
  return (
    <Stack
      className={className}
      alignItems="center"
      justifyContent="center"
      height="full"
      width="full"
    >
      <LoadingSpinner className="text-brand h-24 w-24" />
    </Stack>
  )
}

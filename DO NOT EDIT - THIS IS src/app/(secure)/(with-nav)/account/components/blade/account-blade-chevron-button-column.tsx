import { Blade, IconButton } from '@mntn-dev/ui-components'

type AccountBladeChevronButtonColumnProps = {
  onClick?: () => void
}

export const AccountBladeChevronButtonColumn = ({
  onClick,
}: AccountBladeChevronButtonColumnProps) => {
  return (
    <Blade.Column
      justifyContent="center"
      alignItems="center"
      direction="row"
      gap="4"
      width="min"
    >
      <span className="flex pb-1 pl-3 mr-4">
        <IconButton
          fill="solid"
          name="chevron-right"
          size="lg"
          color="disabled"
          hoverColor="cta"
          onClick={onClick}
        />
      </span>
    </Blade.Column>
  )
}

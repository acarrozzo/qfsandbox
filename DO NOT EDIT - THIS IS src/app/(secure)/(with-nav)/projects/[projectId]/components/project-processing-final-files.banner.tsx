import { useTranslation } from '@mntn-dev/i18n'
import { Heading, Icon, Stack, Surface, Text } from '@mntn-dev/ui-components'
import { themeBorderColorMap } from '@mntn-dev/ui-theme'

import { useMe } from '~/hooks/secure/use-me.ts'

export const ProjectProcessingFinalFilesBanner = () => {
  const { me } = useMe()
  const { t } = useTranslation(['projects'])

  return (
    <Surface padding="8" marginBottom="8" className="shadow-blur">
      <Surface.Body
        className={`flex flex-col gap-8 text-center border rounded-lg ${themeBorderColorMap.muted}`}
      >
        <Stack
          direction="col"
          gap="2"
          justifyContent="center"
          alignItems="center"
        >
          <Icon
            fill="outline"
            name="checkbox-circle"
            size="7xl"
            color="positive"
          />
          <Stack direction="col">
            <Heading fontSize="3xl">
              {t('projects:banners.project-complete')}
            </Heading>
          </Stack>

          <Text fontSize="sm" textColor="secondary">
            {t('banners.deliverables-are-pending', {
              adjective:
                me.organizationType === 'brand'
                  ? t('banners.your')
                  : t('banners.final'),
            })}
          </Text>

          <Text fontSize="sm" fontWeight="bold" textColor="notice">
            {t('projects:banners.videos-processing')}
          </Text>
        </Stack>
      </Surface.Body>
    </Surface>
  )
}

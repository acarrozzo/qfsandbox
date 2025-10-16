import type { TFunction } from 'i18next'
import type { FC } from 'react'

import {
  type ChannelId,
  ChannelIds,
  type VideoAspectRatio,
  VideoAspectRatios,
  type VideoCutType,
  VideoCutTypes,
  type VideoDeliverableDetails,
} from '@mntn-dev/domain-types'
import { Controller } from '@mntn-dev/forms'
import { NarrowTFunction } from '@mntn-dev/i18n'
import {
  FormField,
  Select,
  type SelectOptionData,
} from '@mntn-dev/ui-components'

import { CommonDeliverableFields } from '~/app/(secure)/(with-nav)/packages/services/components/deliverable/form-fields/common-deliverable-form-fields.tsx'

import type { DeliverableFormFieldProps } from '../types.ts'
import { isDeliverableErrors } from '../utils.ts'
import { DeliverableDurationFormField } from './video-deliverable-duration-form-field.tsx'

const getVideoCutOptions = (
  t: TFunction<['deliverable']>
): SelectOptionData<VideoCutType>[] =>
  VideoCutTypes.map((videoCut) => ({
    value: videoCut,
    label: t(`deliverable:video.cut.${videoCut}`),
  }))

const getChannelOptions = (
  t: TFunction<['deliverable']>
): SelectOptionData<ChannelId>[] =>
  ChannelIds.map((channelId) => ({
    value: channelId,
    label: t(`deliverable:video.channel.${channelId}`),
  }))

const getAspectRatioOptions = (): SelectOptionData<VideoAspectRatio>[] =>
  VideoAspectRatios.map((aspectRatio) => ({
    value: aspectRatio,
    label: aspectRatio,
  }))

export const VideoDeliverableFormFields: FC<DeliverableFormFieldProps> = (
  props
) => {
  const { deliverableIndex, control, errors, isTriggered, t, isDisabled } =
    props

  return isDeliverableErrors<Array<VideoDeliverableDetails>>(errors) ? (
    <>
      <CommonDeliverableFields {...props} />
      <FormField
        columnSpan={3}
        className="w-full"
        hasError={
          isTriggered &&
          errors.deliverables &&
          !!errors.deliverables[deliverableIndex]?.cut
        }
      >
        <FormField.Label>{t('deliverable-details:field.cut')}</FormField.Label>
        <FormField.Control>
          <Controller
            name={`deliverables.${deliverableIndex}.cut`}
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                searchable={false}
                deselectable={false}
                options={getVideoCutOptions(
                  NarrowTFunction<['deliverable']>(t)
                )}
                disabled={isDisabled}
              />
            )}
          />
        </FormField.Control>
      </FormField>

      <DeliverableDurationFormField {...props} />

      <FormField
        columnSpan={3}
        className="w-full"
        hasError={
          isTriggered &&
          errors.deliverables &&
          !!errors.deliverables[deliverableIndex]?.channel
        }
      >
        <FormField.Label>
          {t('deliverable-details:field.channel')}
        </FormField.Label>
        <FormField.Control>
          <Controller
            name={`deliverables.${deliverableIndex}.channel`}
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                deselectable={false}
                searchable={false}
                {...field}
                options={getChannelOptions(NarrowTFunction<['deliverable']>(t))}
                disabled={isDisabled}
              />
            )}
          />
        </FormField.Control>
      </FormField>

      <FormField columnSpan={3} className="w-full">
        <FormField.Label>
          {t('deliverable-details:field.aspectRatio')}
        </FormField.Label>
        <FormField.Control>
          <Controller
            name={`deliverables.${deliverableIndex}.aspectRatio`}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                deselectable={false}
                searchable={false}
                options={getAspectRatioOptions()}
                disabled={isDisabled}
              />
            )}
          />
        </FormField.Control>
      </FormField>
    </>
  ) : null
}

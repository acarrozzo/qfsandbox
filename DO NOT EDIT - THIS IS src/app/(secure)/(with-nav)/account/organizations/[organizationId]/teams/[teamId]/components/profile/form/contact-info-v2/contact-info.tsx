import { teamTagCategories } from '@mntn-dev/app-common'
import { cn } from '@mntn-dev/ui-utilities'

import { TeamBillingProfileFormSelect } from '~/components/team/team-billing-profile-form-select/team-billing-profile-form-select.component.tsx'

import { useTeamProfileEditorContext } from '../../../../hooks/use-team-profile-editor.ts'
import { TagInfoItem } from '../tag-info/tag-info-item-v2.tsx'
import { EmailAddresses } from './email-addresses.tsx'
import { PhoneNumbers } from './phone-numbers.tsx'
import { WebsiteUrls } from './website-urls.tsx'

const ContactInfo = () => {
  const { editing, teamId, team } = useTeamProfileEditorContext()
  return (
    <div
      className={cn('profile-grid', {
        'profile-grid-edit': editing,
        'profile-grid-display': !editing,
      })}
    >
      <EmailAddresses />
      <PhoneNumbers />
      <WebsiteUrls />
      {teamTagCategories.map((category) => (
        <TagInfoItem key={category} category={category} />
      ))}
      {team.organizationType !== 'agency' && team.billingProfileId && (
        <TeamBillingProfileFormSelect teamId={teamId} isEditing={editing} />
      )}
    </div>
  )
}

export { ContactInfo }

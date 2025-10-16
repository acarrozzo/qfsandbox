import { teamTagCategories } from '@mntn-dev/app-common'
import { cn } from '@mntn-dev/ui-utilities'

import { useTeamProfileEditorContext } from '../../../../hooks/use-team-profile-editor.ts'
import { TagInfoItem } from '../tag-info/tag-info-item-v1.tsx'
import { EmailAddresses } from './email-addresses.tsx'
import { PhoneNumbers } from './phone-numbers.tsx'
import { WebsiteUrls } from './website-urls.tsx'

const ContactInfo = () => {
  const { editing } = useTeamProfileEditorContext()
  return (
    <div
      className={cn('flex', {
        'flex-col flex-wrap gap-y-6 justify-center': !editing,
        'gap-y-8 w-full *:w-1/2': editing,
      })}
    >
      <div className="flex flex-col gap-y-6 items-center">
        <EmailAddresses />
        <PhoneNumbers />
        <WebsiteUrls />
      </div>
      <div className="flex flex-col gap-y-6 items-center">
        {teamTagCategories.map((category) => (
          <TagInfoItem key={category} category={category} />
        ))}
      </div>
    </div>
  )
}

export { ContactInfo }

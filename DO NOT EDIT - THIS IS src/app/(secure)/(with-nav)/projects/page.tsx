import { redirect } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'

export default function Page() {
  redirect(route('/dashboard').toRelativeUrl())
}

import { useMe } from './use-me.ts'

export const useOnboarding = () => {
  const { me } = useMe()
  return {
    isOnboarding: me.organization?.onboarding.status === 'onboarding',
    isOnboarded: me.organization?.onboarding.status === 'onboarded',
  }
}

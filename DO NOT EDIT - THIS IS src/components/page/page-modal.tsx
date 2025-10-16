'use client'

import type { PropsWithChildren } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { Modal, useOpenState } from '@mntn-dev/ui-components'

/** A general purpose modal used on pages with shared content that take advantage of fullpage or modal rendering using nextjs route interception. */
export function PageModal({ children }: PropsWithChildren) {
  const router = useRouter()
  const modalOpenState = useOpenState({ initialOpen: true })

  const handleClose = () => {
    router.back()
  }

  return (
    <Modal {...modalOpenState} onClose={handleClose} className="m-0">
      {children}
    </Modal>
  )
}

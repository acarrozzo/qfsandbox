import { useState } from 'react'

export const useVideoStatus = () => {
  const [status, setStatus] = useState<'loading' | 'success'>('loading')
  const isSuccess = status === 'success'
  const handleVideoSuccess = () => setStatus('success')

  return {
    isSuccess,
    handleVideoSuccess,
  }
}

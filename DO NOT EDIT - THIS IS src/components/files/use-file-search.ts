import { useState } from 'react'

export const useFileSearch = () => {
  const [search, setSearch] = useState<string>()

  return { search: search || undefined, setSearch }
}

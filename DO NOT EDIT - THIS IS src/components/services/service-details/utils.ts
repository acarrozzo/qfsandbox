'use client'

export const getNoteDataTestIdPrefix = (readonly: boolean) =>
  `service-note-${readonly ? 'display' : 'edit'}`

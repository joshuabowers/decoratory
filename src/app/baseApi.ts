import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { Identifiable } from './database'

const tagTypes = ['Decoration', 'Container', 'Scene'] as const
type TagTypes = typeof tagTypes[number]

export const baseApi = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes,
  endpoints: () => ({})
})

export const browseTags = (type: TagTypes) => 
  <T extends Identifiable>(result: T[] | undefined) => (
    result ? [
      ...result.map(({ id }) => ({ type, id } as const)),
      {type, id: 'LIST'}
    ] : [{type, id: 'LIST'}]
  )

export const readTags = (type: TagTypes) =>
  <T extends Identifiable, U>(_result: T | undefined, _error: unknown, arg: U) =>
    [{type, id: arg}]

export const editTags = (type: TagTypes) =>
  <T extends Identifiable>(_result: T | undefined, _error: unknown, arg: T) =>
    [{type, id: arg.id}]

export const addTags = (type: TagTypes) => [{type, id: 'LIST'}]

export const destroyTags = (type: TagTypes) =>
  <T>(_result: unknown, _error: unknown, arg: T) =>
    [{type, id: arg}]

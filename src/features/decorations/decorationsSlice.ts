import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { doc, getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore'
import { db, Decoration, Identifiable } from '../../app/database'

export const decorationsApi = createApi({
  reducerPath: 'decorations',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Decoration'],
  endpoints: (builder) => ({
    browseDecorations: builder.query({
      queryFn: async () => {
        try {
          const snapshot = await getDocs(db.decorations)
          return { data: snapshot.docs.map(d => d.data()) }
        } catch (error) {
          return { error }
        }
      },
      providesTags: (result) => (
        result ? [
          ...result.map(({ id }) => ({ type: 'Decoration', id } as const)),
          { type: 'Decoration', id: 'LIST' }
        ] : [{ type: 'Decoration', id: 'LIST' }]
      )
    }),
    readDecoration: builder.query({
      queryFn: async (id: string) => {
        try {
          const ref = doc(db.decorations, id)
          const decoration = await getDoc(ref)
          return { data: decoration.data() }
        } catch (error) {
          return { error }
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Decoration', id }]
    }),
    editDecoration: builder.mutation<Decoration, Partial<Omit<Decoration, 'id'>> & Identifiable>({
      queryFn: async ({id, ...data}) => {
        try {
          const ref = doc(db.decorations, id)
          await setDoc(ref, data, {merge: true})
          const decoration = await getDoc(ref)
          return { data: decoration.data() }
        } catch (error) {
          return { error }
        }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Decoration', id }]
    }),
    addDecoration: builder.mutation<Decoration, Partial<Omit<Decoration, 'id'>>>({
      queryFn: async (data) => {
        try {
          const ref = doc(db.decorations)
          await setDoc(ref, data)
          const decoration = await getDoc(ref)
          return { data: decoration.data() }
        } catch (error) {
          return { error }
        }
      },
      invalidatesTags: [{ type: 'Decoration', id: 'LIST' }]
    }),
    destroyDecoration: builder.mutation<{ success: boolean, id: string }, string>({
      queryFn: async (id) => {
        try {
          const ref = doc(db.decorations, id)
          await deleteDoc(ref)
          return { data: { success: true, id } }
        } catch (error) {
          return { error }
        }
      },
      invalidatesTags: (_result, _error, id) => [{ type: 'Decoration', id }]
    }) 
  })
})

export const { 
  useBrowseDecorationsQuery, 
  useReadDecorationQuery,
  useEditDecorationMutation,
  useAddDecorationMutation,
  useDestroyDecorationMutation
} = decorationsApi

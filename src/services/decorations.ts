import { 
  baseApi, browseTags, readTags, editTags, addTags, destroyTags
} from '../app/baseApi'
import { doc, getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore'
import { 
  db, Decoration, Model, IdentifiableModel, DestroyResult
} from '../app/database'

export const decorationsApi = baseApi.injectEndpoints({
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
      providesTags: browseTags('Decoration')
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
      providesTags: readTags('Decoration')
    }),
    editDecoration: builder.mutation<Decoration, IdentifiableModel<Decoration>>({
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
      invalidatesTags: editTags('Decoration')
    }),
    addDecoration: builder.mutation<Decoration, Model<Decoration>>({
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
      invalidatesTags: addTags('Decoration')
    }),
    destroyDecoration: builder.mutation<DestroyResult, string>({
      queryFn: async (id) => {
        try {
          const ref = doc(db.decorations, id)
          await deleteDoc(ref)
          return { data: { success: true, id } }
        } catch (error) {
          return { error }
        }
      },
      invalidatesTags: destroyTags('Decoration')
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

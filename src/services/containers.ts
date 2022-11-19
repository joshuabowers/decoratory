import { 
  baseApi, browseTags, readTags, editTags, addTags, destroyTags
} from "../app/baseApi";
import { 
  db, Container, Model, IdentifiableModel, DestroyResult
} from "../app/database";
import { doc, getDoc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

export interface BrowseContainersQuery {
  name?: string
}

export const labelFor = (container: Container) => 
  `${
    container.name.split(/\s/).map(s => s[0].toUpperCase()).join('')
  }-${container.sequence}`

export const containersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    browseContainers: builder.query<Container[], BrowseContainersQuery>({
      queryFn: async (query) => {
        try {
          const snapshot = await getDocs(db.containers)
          return { data: snapshot.docs.map(d => d.data()) }
        } catch (error) {
          return { error }
        }
      },
      providesTags: browseTags('Container')
    }),
    readContainer: builder.query<Container, string>({
      queryFn: async (id: string) => {
        try {
          const container = await getDoc(doc(db.containers, id))
          return { data: container.data() }
        } catch (error) {
          return { error }
        }
      },
      providesTags: readTags('Container')
    }),
    editContainer: builder.mutation<Container, IdentifiableModel<Container>>({
      queryFn: async ({id, ...data}) => {
        try {
          const ref = doc(db.containers, id)
          await setDoc(ref, data, {merge: true})
          const container = await getDoc(ref)
          return { data: container.data() }
        } catch (error) {
          return { error }
        }
      },
      invalidatesTags: editTags('Container')
    }),
    addContainer: builder.mutation<Container, Model<Container>>({
      queryFn: async (data) => {
        try {
          const ref = doc(db.containers)
          await setDoc(ref, data)
          const container = await getDoc(ref)
          return { data: container.data() }
        } catch (error) {
          return { error }
        }
      },
      invalidatesTags: addTags('Container')
    }),
    destroyContainer: builder.mutation<DestroyResult, string>({
      queryFn: async (id) => {
        try {
          const ref = doc(db.containers, id)
          await deleteDoc(ref)
          return { data: { success: true, id } }
        } catch (error) {
          return { error }
        }
      },
      invalidatesTags: destroyTags('Container')
    })
  })
})

export const { 
  useBrowseContainersQuery,
  useReadContainerQuery,
  useEditContainerMutation,
  useAddContainerMutation,
  useDestroyContainerMutation
} = containersApi

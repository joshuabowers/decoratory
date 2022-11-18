import { 
  baseApi, browseTags, readTags, editTags, addTags, destroyTags
} from "../app/baseApi";
import { 
  db, Scene, Model, IdentifiableModel, DestroyResult
} from "../app/database";
import { doc, getDoc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

export const scenesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    browseScenes: builder.query({
      queryFn: async () => {
        try {
          const snapshot = await getDocs(db.scenes)
          return { data: snapshot.docs.map(d => d.data()) }
        } catch (error) {
          return { error }
        }
      },
      providesTags: browseTags('Scene')
    }),
    readScene: builder.query({
      queryFn: async (id: string) => {
        try {
          const scene = await getDoc(doc(db.scenes, id))
          return { data: scene.data() }
        } catch (error) {
          return { error }
        }
      },
      providesTags: readTags('Scene')
    }),
    editScene: builder.mutation<Scene, IdentifiableModel<Scene>>({
      queryFn: async ({id, ...data}) => {
        try {
          const ref = doc(db.scenes, id)
          await setDoc(ref, data, {merge: true})
          const scene = await getDoc(ref)
          return { data: scene.data() }
        } catch (error) {
          return { error }
        }
      },
      invalidatesTags: editTags('Scene')
    }),
    addScene: builder.mutation<Scene, Model<Scene>>({
      queryFn: async (data) => {
        try {
          const ref = doc(db.scenes)
          await setDoc(ref, data)
          const scene = await getDoc(ref)
          return { data: scene.data() }
        } catch (error) {
          return { error }
        }
      },
      invalidatesTags: addTags('Scene')
    }),
    destroyScene: builder.mutation<DestroyResult, string>({
      queryFn: async (id) => {
        try {
          const ref = doc(db.scenes, id)
          await deleteDoc(ref)
          return { data: { success: true, id } }
        } catch (error) {
          return { error }
        }
      },
      invalidatesTags: destroyTags('Scene')
    })
  })
})

export const { 
  useBrowseScenesQuery,
  useReadSceneQuery,
  useEditSceneMutation,
  useAddSceneMutation,
  useDestroySceneMutation
} = scenesApi

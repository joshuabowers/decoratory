import { FirestoreDataConverter, collection } from 'firebase/firestore'
import { firestore } from "./firebase";

// largely based upon: 
// https://gist.github.com/JamieCurnow/cba3968a7f1e335d473632f9fc9f6e8b

export interface Identifiable {
  id: string
}

const converter = <T extends Identifiable>(): FirestoreDataConverter<T> => ({
  toFirestore: ({id, ...data}) => data ?? {},
  fromFirestore: (snapshot, _options?) => ({
    id: snapshot.id,
    ...snapshot.data()
  }) as T
})

const typedCollection = <T extends Identifiable>(collectionPath: string) =>
  collection(firestore, collectionPath).withConverter(converter<T>())

export interface Decoration extends Identifiable {
  name: string
  appearance: string
  storedIn: string
  stagedIn: string
  categories: string[]
}

export interface Container extends Identifiable {
  name: string
  sequence: number
  color: string
  type: 'tub' | 'box'
}

export interface Scene extends Identifiable {
  name: string
  example: string
}

export type Model<T extends Identifiable> = Partial<Omit<T, 'id'>>
export type IdentifiableModel<T extends Identifiable> = Model<T> & Identifiable
export type DestroyResult = {success: boolean} & Identifiable

export const db = {
  decorations: typedCollection<Decoration>('decorations'),
  containers: typedCollection<Container>('containers'),
  scenes: typedCollection<Scene>('scenes')
}

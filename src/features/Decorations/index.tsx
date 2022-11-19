import React from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { useBrowseDecorationsQuery, BrowseDecorationsQuery } from '../../services/decorations';
import styles from './Decorations.module.css'

export const Decorations = (props: BrowseDecorationsQuery) => {
  const { 
    data: decorations, isLoading, isError, error 
  } = useBrowseDecorationsQuery(props)

  if(isLoading){ return <div>Loading...</div> }
  if(isError && (typeof error === 'string')){ return <div>Error: <span>{error}</span></div>}
  if(!decorations){ return <div>Error: no decorations!</div> }

  return <article className={styles.normal}>
    {
      decorations.map(decoration => (
        <a key={decoration.id} href={`/decoration/${decoration.id}`}>
          <img src={decoration.appearance} alt={decoration.name}/>
          <span>{decoration.name}</span>
        </a>
      ))
    }
  </article>
}

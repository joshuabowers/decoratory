import React from 'react';
import { 
  useBrowseContainersQuery, BrowseContainersQuery, labelFor
} from '../../services/containers';
import styles from './Containers.module.css'

export const Containers = (props: BrowseContainersQuery) => {
  const {
    data: containers, isLoading, isError, error
  } = useBrowseContainersQuery(props)

  if(isLoading){ return <div>Loading...</div> }
  if(isError && typeof error === 'string'){ return <div>Error: {error}</div> }
  if(!containers){ return <div>Error: no containers</div> }

  return <article className={styles.normal}>
    {
      containers.map(container => (
        <a 
          key={container.id} 
          href={`/container/${container.id}`}
          style={{'--container-color': container.color} as React.CSSProperties}
        >
          <span>{labelFor(container)}</span>
        </a>
      ))
    }
  </article>
}

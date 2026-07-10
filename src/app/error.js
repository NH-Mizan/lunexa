'use client' // Error boundaries must be Client Components
 
export default function GlobalError({ error, reset }) {
  return (
    // global-error must include html and body tags
   <div>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
    </div>
     
  )
}
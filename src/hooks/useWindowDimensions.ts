import { useCallback, useEffect, useState } from 'react'

export function useWindowDimensions () {
  const [height, setHeight] = useState(window.innerHeight)
  const [width, setWidth] = useState(window.innerWidth)

  const resizeListener = useCallback(() => {
    setHeight(window.innerHeight)
    setWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    window.addEventListener('resize', resizeListener)

    return () => window.removeEventListener('resize', resizeListener)
  }, [])

  return { width, height }
}

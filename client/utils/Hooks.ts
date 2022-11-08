import {DependencyList, MutableRefObject, useEffect, useRef, useState} from 'react';

export const useClickOutside = ( ref:MutableRefObject<HTMLElement>, cb)=>{
  useEffect(() => {

    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        cb();
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);

    return () => {      
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref,cb]);
}

export type IntersectionPos = 'ABOVE' | 'BELOW' | 'INNER'
export const useOnScreen=(ref:MutableRefObject<HTMLElement>, parentRef:MutableRefObject<HTMLElement>)=>{

  const [isIntersecting, setIntersecting] = useState(false)
  const [intersectionPos, setIntersectionPos] = useState<IntersectionPos>('INNER');

  const observer = new IntersectionObserver(
    ([entry]) => {
      
      setIntersecting(entry.isIntersecting)
      if(entry.isIntersecting){
        setIntersectionPos('INNER');
      }
      else{
        if (entry.boundingClientRect.top > 0) {
          setIntersectionPos("BELOW");
        } else {
          setIntersectionPos("ABOVE");
        }
      }
    },
    {
      threshold:1.0,
      root:parentRef.current
    }
  )

  useEffect(() => {
    observer.observe(ref.current)
    return () => { observer.disconnect() }
  }, [])

  return {isIntersecting, intersectionPos}
}


export const useOnResize=(ref:MutableRefObject<HTMLElement>, cb:(currentHeight:number, previousHeight:number)=>void, deps:DependencyList)=>{

  const previousHeight = useRef<number>(0)

  if(typeof document !== 'undefined'){
    
    useEffect(() => {
      const observer = new ResizeObserver(
        ([entry]) => {
          cb(entry.contentRect.height, previousHeight.current);
          previousHeight.current = entry.contentRect.height;
        }
      )
      observer.observe(ref.current)
      
      previousHeight.current = ref.current.clientHeight;
      return () => { observer.disconnect() }
    }, deps)
  }
}

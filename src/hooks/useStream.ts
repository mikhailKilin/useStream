import { useEffect, useState, useMemo } from "react";
import { Observable, BehaviorSubject } from "rxjs";

const rawUseStream = <T extends object, R extends object>(
  props: T,
  piping: (obs: Observable<T>) => Observable<Partial<R>>,
  defaultProps: R
) => {
  const [state, setState] = useState(defaultProps);

  const memoizedSubj = useMemo(() => {
    return new BehaviorSubject<T>(props);
  }, []);

  useEffect(() => {
    memoizedSubj.next(props)
  }, [props]);

  useEffect(
    () => {
      const effect$ = memoizedSubj.pipe(piping).subscribe(subscribedData => {
        setState(Object.assign(state, subscribedData));
      });
      
      return () => {
        effect$.unsubscribe();
      };
    },
    []
  );

  return state;
};

export const useStream = rawUseStream;

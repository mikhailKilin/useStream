import { useEffect, useState } from "react";
import { of, Observable } from "rxjs";

const rawUseStream = <T extends object, R extends object>(
  props: T,
  piping: (obs: Observable<T>) => Observable<Partial<R>>,
  defaultProps: R
) => {
  const [state, setState] = useState(defaultProps);
  useEffect(
    () => {
      const subscribedStream$ = of(props)
        .pipe(piping)
        .subscribe(subscribedData => {
          setState(Object.assign(state, subscribedData));
        });

      return () => {
        subscribedStream$.unsubscribe();
      };
    },
    [props]
  );

  return state;
};

export const useStream = rawUseStream;

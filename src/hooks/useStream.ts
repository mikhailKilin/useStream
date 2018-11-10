import { useEffect, useState } from 'react';
import { of, interval, Observable } from 'rxjs'
import { switchMap, map } from 'rxjs/operators'

const rawUseStream = <T, R>(props: T, piping: (obs: Observable<T>) => Observable<R>, defaultProps: R) => {
    const stream$ = of(props);
    const [state, setState ] = useState(defaultProps)
    useEffect(() => {
        const subscribedStream$ = stream$.pipe(
            piping
        ).subscribe(data => {
            setState(data);
        });

        return () => {
            subscribedStream$.unsubscribe();
        }
    }, [ props ])

    return state
}

export const useStream = rawUseStream
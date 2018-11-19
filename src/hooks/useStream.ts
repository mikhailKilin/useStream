import { useEffect, useState } from 'react';
import { of, Observable } from 'rxjs'

const rawUseStream = <T, R>(props: T, piping: (obs: Observable<T>) => Observable<R>, defaultProps: R) => {
    const [state, setState ] = useState(defaultProps)
    useEffect(() => {
        const subscribedStream$ = of(props).pipe(
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
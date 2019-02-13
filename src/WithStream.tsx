import * as React from "react";
import { useStream } from "./hooks/useStream";
import { interval, of, BehaviorSubject, merge, Observable, timer } from "rxjs";
import { map, scan, switchMap, startWith, combineLatest } from "rxjs/operators";
import { toKeyValue } from "./operators/toKeyValue";
type TWithStream = {
  count: number;
  period: number;
};

const constUndefined = () => {};
const piping = (props$: Observable<TWithStream>) => {
  const toggleResetCounter$ = new BehaviorSubject<void>(undefined);
  const count$ = props$.pipe(map(props => props.count));
  const period$ = props$.pipe(map(props => props.period));
  const intervalCount$ = count$.pipe(
    combineLatest(period$),
    switchMap(([count, period]) => {
      return toggleResetCounter$.pipe(
        switchMap(_ =>
          interval(period).pipe(
            scan(acc => acc + 1, count),
            startWith(count)
          )
        )
      );
    })
  );

  const remoteDataMock$ = timer(10000).pipe(
    map(() => "Success!!")
  );
  const actions$ = of({
    resetCounter() {
      toggleResetCounter$.next(undefined);
    }
  });

  return merge(
    toKeyValue(intervalCount$, "count"),
    actions$,
    toKeyValue(remoteDataMock$, "remoteDataMock")
  );
};

const RawWithStream = (props: TWithStream): JSX.Element => {
  const { count, resetCounter, remoteDataMock } = useStream(props, piping, {
    count: 1,
    resetCounter: constUndefined,
    remoteDataMock: "Pending"
  });

  return (
    <div>
      <h1>{remoteDataMock}</h1>
      <div>{count}</div>
      <button onClick={resetCounter}>Reset counter</button>
    </div>
  );
};

export const WithStream = RawWithStream;

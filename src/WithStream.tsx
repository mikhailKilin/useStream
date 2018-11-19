import * as React from "react";
import { useStream } from "./hooks/useStream";
import { interval, Observable, of, BehaviorSubject } from "rxjs";
import { map, scan, switchMap, startWith, combineLatest } from "rxjs/operators";

type TWithStream = {
  count: number;
  period: number;
};

const constUndefined = () => { };

const RawWithStream = (props: TWithStream): JSX.Element => {
  const { count, actions } = useStream(props, (
    props$: Observable<TWithStream>
  ) => {
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

    const actions$ = of({
      resetCounter() {
        toggleResetCounter$.next(undefined);
      }
    });

    return intervalCount$.pipe(combineLatest(actions$)).pipe(map(([count, actions]) => ({ count, actions})));
  }, {count: 1, actions:{ resetCounter: constUndefined }});

  return (
    <div>
      <div>{count}</div>
      <button onClick={actions.resetCounter}>Reset counter</button>
    </div>
  );
};

export const WithStream = RawWithStream;

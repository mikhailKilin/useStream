import { Observable, merge, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export const toKeyValue = <T, Key extends string>(stream: Observable<T>, key: Key) => stream.pipe(
    map(streamData => ({
        [key]: streamData
    } as any))
)
import { from, interval, Observable, of } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';

export function fakeHttp(emitAfterMillis: number, error: boolean = false): Observable<string> {
  return new Observable<string>(subscriber => {
    from(interval(emitAfterMillis)).pipe(
      take(1)
    ).subscribe(p => {
      if (!error) {
        subscriber.next(`Response emitted after ${emitAfterMillis} milliseconds`);
      } else {
        subscriber.error(`Error emitted after ${emitAfterMillis} milliseconds`);
      }
      subscriber.complete();
    });
  });
}

export function emitMultipleTimes(delay: number, emitTimes: number, emitInterval: number): Observable<number> {
  return new Observable<number>(subscriber => {
    from(interval(delay).pipe(take(1)))
      .pipe(
        concatMap(i => interval(emitInterval).pipe(take(emitTimes)))
      ).subscribe(p => {
        subscriber.next(((p + 1) * emitInterval) + delay);
        if ((p + 1) === emitTimes) {
          subscriber.complete();
        }
    });
  });
}


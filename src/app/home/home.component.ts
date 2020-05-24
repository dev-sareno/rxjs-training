import { Component, OnInit } from '@angular/core';
import { concat, from, fromEvent, interval, Observable, of, scheduled } from 'rxjs';
import {
  catchError,
  concatAll,
  concatMap,
  concatMapTo,
  filter,
  map, mapTo,
  mergeAll,
  mergeMap,
  mergeMapTo, reduce, switchAll, switchMap,
  take, takeUntil, tap,
  timeout,
  zipAll
} from 'rxjs/operators';
import { emitMultipleTimes, fakeHttp } from '../utility.helper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  sample1() {
    // Observable
    const observer = new Observable<string>(subscriber => {
      subscriber.next(`1`);
      subscriber.next(`2`);
      subscriber.error(new Error('Test 1'));
      subscriber.error(new Error('Test 2'));
      subscriber.next(`3`);
      subscriber.complete();
    });

    observer.subscribe(value => console.log(value),
        error => console.log(error),
      () => console.log(`Completed`));
  }

  sample2() {
    // Operator
    const obs = of(1, 2, 3, 4, 5, 6);
    const even = obs.pipe(
      filter(i => i % 2 === 0)
    );
    const odd = obs.pipe(
      filter(i => i % 2 !== 0)
    );
    even.subscribe(p => console.log('even', p));
    odd.subscribe(p => console.log('odd', p));
  }

  sample3() {
    // Operator + Timeout
    from(interval(1000).pipe(timeout(500)))
      .subscribe(p => console.log(p), e => console.log(e));
  }

  sample4() {
      const obs = of(0.5, 1.5, 2);
      obs.pipe(
        map(i => fakeHttp(i * 1000)),
        // concatAll(), // Same with mergeAll() ?
        // mergeMap(i => emitMultipleTimes(0, 3, 1000)),
        // concatMap(i => emitMultipleTimes(0, 3, 1000)),
        // concatMapTo(emitMultipleTimes(0, 1, 1000)), // ???
        // mergeAll(),
        // switchAll(),
        // switchMap(i => i),
        zipAll(),
      ).subscribe((p) => console.log(p));
  }

  sample5() {
    // const obs = of(1, 2, 3);
    // obs.pipe(
    //   reduce()
    // ).subscribe(p => console.log(p));

    fromEvent(document, 'click').pipe(
      takeUntil(interval(5000).pipe(take(1))),
    ).pipe(
      tap(i => console.log(i)),
      mapTo(1)
    ).pipe(
      reduce((acc, one) => acc + one, 0),
    ).subscribe(x => console.log(x));
  }
}

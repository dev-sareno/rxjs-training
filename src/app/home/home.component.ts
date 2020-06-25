import { Component, OnInit } from '@angular/core';
import {
  combineLatest,
  concat,
  from,
  fromEvent,
  iif,
  interval,
  merge,
  Observable,
  of,
  range,
  scheduled,
  throwError,
  timer,
  zip
} from 'rxjs';
import {
  catchError, combineAll,
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

  sample6() {
    // throwError('').subscribe(p => console.log(p));
    // from(range(1, 5))
    //   .subscribe(p => console.log(p));
    // timer(1000).subscribe(p => console.log(p));
    iif(() => false, of('Good'), of('Bad'))
      .subscribe(x => console.log(x));
  }

  sample7() {
    // zip(
    //   timer(1000).pipe(mapTo('timed')),
    //   interval(1500).pipe(mapTo('1.5s'))
    // ).subscribe(p => console.log(p));

    combineLatest(
      [interval(1000).pipe(mapTo('1s')),
        interval(3000).pipe(mapTo('3s'))]
    ).subscribe(p => console.log(p));
  }

  sample8() {
    of(1000, 2000)
      .pipe(
        map(i => timer(i)),
        mergeAll()
      ).subscribe(p => console.log(p));
  }

  sample9() {
    combineLatest([of(1, 2, 3), of(null, 'a', 'b')])
      .subscribe(p => console.log(p));
    // of(1000, 2000)
    //   .pipe(
    //     map(i => timer(i)),
    //     mergeAll()
    //   ).subscribe(p => console.log(p));
  }

  sample10() {
    const obs1 = timer(700).pipe(mapTo('Obs1'));
    const obs2 = timer(700).pipe(mapTo('Obs2'));

    // of(obs1, obs2).pipe(
    //   mergeAll(),
    // ).subscribe(p => console.log(p));

    // combineLatest([obs1, obs2]).subscribe(p => console.log(p));

    merge(obs1, obs2).subscribe(p => console.log(p));
  }

  sample11() {
    interval(500)
      .pipe(
        map(i => [i]),
        takeUntil(timer(3000)),
        reduce((acc: number[], value) => acc.concat(value))
      )
      .subscribe(p => console.log(p));
  }

  sample12() {
    const obs = of('1', '2', '3').pipe(
      take(1),
      tap(i => console.log('use'))
    );
    obs.subscribe(p => console.log('s1'));
    obs.subscribe(p => console.log('s2'));
    obs.subscribe(p => console.log('s3'));
  }

  sample13() {
    const obs1 = interval(1350).pipe(
      map(i => `obs1-${i}`),
      takeUntil(timer(3000))
    );
    const obs2 = interval(800).pipe(map(i => `obs2-${i}`));
    // from([obs1, obs2])
    //   .pipe(
    //     mergeAll()
    //   )
    //   .subscribe(p => console.log(p));
    // merge(obs1, obs2).subscribe(p => console.log(p));
    from([obs1, obs2])
      .pipe(
        concatAll()
      )
      .subscribe(p => console.log(p));
  }
}

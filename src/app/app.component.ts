import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  clickCount = signal(0);
  clickCount$ = toObservable(this.clickCount);
  interval$ = interval(1000);
  intervalSignal = toSignal(this.interval$, { initialValue: 0 });

  customInterval$ = new Observable((subscriber) => {
    let count = 0;
    const interval = setInterval(() => {
      // subscriber.error(new Error('Custom interval error'));
      if (count >= 5) {
        clearInterval(interval);
        subscriber.complete();
        return;
      }
      console.log('Emitting new value...');
      subscriber.next({ message: 'New value', count });
      count++;
    }, 2000);
  });

  constructor() {
    // effect(() => {
    //   console.log(`Click count changed to: ${this.clickCount()}`);
    // });
  }

  ngOnInit(): void {
    // const subscribe = interval(1000)
    //   .pipe(map((value) => value * 2))
    //   .subscribe({
    //     next: (value) => console.log(value),
    //   });
    // this.destroyRef.onDestroy(() => {
    //   subscribe.unsubscribe();
    // });

    this.customInterval$.subscribe({
      next: (value) => console.log(value),
      complete: () => console.log('Custom interval completed'),
    });

    const subscribe = this.clickCount$.subscribe({
      next: (value) => console.log(`Click count changed to: ${value}`),
    });

    this.destroyRef.onDestroy(() => {
      subscribe.unsubscribe();
    });
  }

  handleClick() {
    this.clickCount.update((prevCount) => prevCount + 1);
  }
}

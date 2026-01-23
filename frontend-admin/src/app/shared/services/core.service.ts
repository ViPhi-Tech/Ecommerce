import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private pageTitleSubj = new Subject<{
    title: string;
    subTitle: string;
  }>();
  pageTitle$ = this.pageTitleSubj.asObservable();

  constructor() {}

  // setPageTitle(title: string, subTitle: string) {
  //   this.pageTitleSubj.next({
  //     title: title,
  //     subTitle: subTitle,
  //   });
  // }

  showLoader(): void {
    this.loadingSubject.next(true);
  }

  hideLoader(): void {
    this.loadingSubject.next(false);
  }
}

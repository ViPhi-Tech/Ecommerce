import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  private pageTitleSubj = new Subject<{
    title: string;
    subTitle: string;
  }>();
  pageTitle$ = this.pageTitleSubj.asObservable();

  constructor() {}

  setPageTitle(title: string, subTitle: string) {
    this.pageTitleSubj.next({
      title: title,
      subTitle: subTitle,
    });
  }
}

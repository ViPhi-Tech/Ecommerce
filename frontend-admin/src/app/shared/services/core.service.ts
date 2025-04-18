import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  breadcrumbSubject = new BehaviorSubject<string[]>(['']);
  breadcrumb$ = this.breadcrumbSubject.asObservable();

  constructor() {}

  adicionarBreadcrumb(breadcrumb: string[]) {
    this.breadcrumbSubject.next(breadcrumb);
  }

  clearBreadcrumb() {
    this.breadcrumbSubject.next(['']);
  }
}

import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private _isOpen = signal<boolean>(false);
  isOpen = this._isOpen.asReadonly();

  toggle() {
    this._isOpen.update((value) => !value);
  }

  open() {
    this._isOpen.set(true);
  }

  close() {
    this._isOpen.set(false);
  }
}

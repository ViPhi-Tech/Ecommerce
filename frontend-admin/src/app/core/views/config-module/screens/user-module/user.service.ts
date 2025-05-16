import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  getUsersList() {
    return of([
      {
        id: 1,
        name: 'João Silva',
        email: 'joao.silva@example.com',
        role: 'kommerz',
      },
      {
        id: 2,
        name: 'Maria Souza',
        email: 'maria.souza@example.com',
        role: 'user',
      },
    ]).pipe(delay(2000));
  }
}

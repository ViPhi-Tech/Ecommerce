import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'fuse-root',
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'admin';

  constructor() {
    // Check if the theme is set in localStorage and apply it
    const theme = localStorage.getItem('theme');
    if (theme) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }
}

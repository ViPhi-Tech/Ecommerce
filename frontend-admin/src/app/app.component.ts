import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './shared/components/loader/loader.component';
@Component({
  selector: 'fuse-root',
  imports: [RouterModule, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'kommerz';

  constructor() {
    // Check if the theme is set in localStorage and apply it
    const theme = localStorage.getItem('theme');
    if (theme) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }
}

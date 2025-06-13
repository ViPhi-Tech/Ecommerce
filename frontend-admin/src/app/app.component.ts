import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'fuse-root',
  imports: [RouterModule, LoaderComponent, ToastModule],
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

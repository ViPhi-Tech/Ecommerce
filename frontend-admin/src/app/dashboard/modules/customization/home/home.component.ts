import { Component, inject, OnInit, signal } from '@angular/core';
import { CustomizationService } from '../customization.service';

@Component({
  selector: 'fuse-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private customizationService = inject(CustomizationService);

  componentTypes = signal<any>([]);
  components = signal<any>([]);

  constructor() { }

  ngOnInit() {
    this.componentTypes.set(
      this.customizationService.getComponents()
    )
  }


  addComponent(component: any) {
    component.id = this.generateCode();
    
    this.components.update((prev: any) => {
      return [...prev, component]
    })

    console.log(this.components());
    
  }

  generateCode() {
    return Math.random().toString(36).substring(2, 42).toUpperCase();
  }

}

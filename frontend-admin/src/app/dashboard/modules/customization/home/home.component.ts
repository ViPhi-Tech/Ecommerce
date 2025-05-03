import { Component, inject, OnInit, signal } from '@angular/core';
import { CustomizationService } from '../customization.service';
import { BannerHeroComponent } from '../components/banner-hero/banner-hero.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '../../../../shared/components/form/form.module';

@Component({
  selector: 'fuse-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [BannerHeroComponent, ReactiveFormsModule, FormModule],
})
export class HomeComponent implements OnInit {
  private customizationService = inject(CustomizationService);
  private formBuilder = inject(FormBuilder);

  componentTypes = signal<any>([]);
  components = signal<any>([]);
  componentSelected = signal<any>(null);

  form: FormGroup | undefined = undefined;

  constructor() {}

  ngOnInit() {
    this.componentTypes.set(this.customizationService.getComponents());
  }

  addComponent(component: any) {
    const newComponent = JSON.parse(JSON.stringify(component));
    // Generate a unique ID for the new component
    newComponent.id = this.generateCode();
    this.components.update(components => [...components, newComponent]);

    this.generateComponentFormGroup(newComponent);
    this.form?.valueChanges.subscribe((value: any) => {
      this.setComponentValueById(value.id, value);
    });
  }

  generateComponentFormGroup(component: any) {
    if (!component.properties) return;

    const formGroup = this.formBuilder.group({
      id: [component.id],
      type: [component.type],
    });

    component?.properties.map((property: any) => {
      formGroup.addControl(
        property.name,
        this.formBuilder.control(component.value[property.name])
      );
    });

    this.form = formGroup;
    this.selectComponent(component);
  }

  selectComponent(component: any) {
    this.componentSelected.set(component);
  }

  getComponentRefById(id: string) {
    return this.components().find((component: any) => component.id === id);
  }

  setComponentValueById(id: string, value: any) {
    const component = this.getComponentRefById(id);
    if (component) {
      component.value = value;
    }
    this.components.update(components =>
      components.map((comp: any) => {
        if (comp.id === id) {
          return { ...comp, value };
        }
        return comp;
      })
    );
  }

  generateCode() {
    return Math.random().toString(36).substring(2, 42).toUpperCase();
  }
}

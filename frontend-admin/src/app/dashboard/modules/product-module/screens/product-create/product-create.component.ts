import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Drawer } from 'primeng/drawer';
import { FormModule } from '../../../../../shared/components/form/form.module';
import { TabIdEnum } from '../../../../../shared/enums/tabs.create-product.enum';
import { NgClass } from '@angular/common';

@Component({
  selector: 'fuse-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
  imports: [DialogModule, ButtonModule, ReactiveFormsModule, FormModule, NgClass],
})
export class ProductCreateComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  @ViewChild('drawerRef') drawerRef!: Drawer;

  formGroup = this.formBuilder.group({});

  
  // signals
  visible = signal(true);
  title = signal('Adicionar Produto');
  subtitle = signal('Preencha os dados do novo produto abaixo');
  
  TabIdEnum = TabIdEnum;
  activeTab = signal<string>(TabIdEnum.BasicInfo);
  tabs = signal([
    { id: 'basic-info', icon: '🏷️', label: 'Informações Básicas' },
    { id: 'images', icon: '🖼️', label: 'Imagens e Mídia' },
    { id: 'commercial-info', icon: '💲', label: 'Informações Comerciais' },
    { id: 'stock', icon: '📦', label: 'Estoque e Logística' },
    { id:  'technical-details', icon: '📐', label: 'Características Técnicas' },
    { id: 'variations', icon: '🧩', label: 'Variações' },
    { id: 'publishing', icon: '🌍', label: 'Publicação' },
  ])

  constructor() {}

  ngOnInit() {
    console.log(TabIdEnum);
    
  }

  setActiveTab(tabId: string) {
    this.activeTab.set(tabId);
  }

  closeDrawer(e: Event) {
    this.drawerRef.close(e);
  }

  onHide() {
    setTimeout(() => {
      this.router.navigate([{ outlets: { drawer: null } }], {
        relativeTo: this.activatedRoute.root,
      });
    }, 200);
  }
}


import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'fuse-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss'],
  imports: [ButtonModule, SelectModule, NgIcon, ReactiveFormsModule],
})
export class ProductSearchComponent implements OnInit {
  products: any[] | undefined;

  selectedProduct = new FormControl();
  searchTerm = signal('');

  @Output() searchChange = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {

  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);

  }

}

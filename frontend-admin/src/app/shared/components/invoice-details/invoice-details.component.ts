import { Component, input, OnInit } from '@angular/core';
import { InvoiceDetails } from '../../interfaces/invoice.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'fuse-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss'],
  imports: [CurrencyPipe],
})
export class InvoiceDetailsComponent implements OnInit {
  invoice = input<InvoiceDetails>();

  constructor() {}

  ngOnInit() {
    console.log('Invoice Details:', this.invoice());
  }
}

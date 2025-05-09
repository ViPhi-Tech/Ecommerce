import { Component, input, OnInit } from '@angular/core';
import { InvoiceDetails } from '../../interfaces/invoice.interface';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'fuse-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss'],
  imports: [CurrencyPipe, DatePipe],
})
export class InvoiceDetailsComponent implements OnInit {
  invoice = input<InvoiceDetails>();

  constructor() {}

  ngOnInit() {
    console.log('Invoice Details:', this.invoice());
  }
}

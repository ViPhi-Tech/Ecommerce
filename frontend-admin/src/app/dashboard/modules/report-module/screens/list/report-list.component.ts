import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CoreService } from 'app/shared/services/core.service';
import { TableComponent } from 'app/shared/components/table/table.component';
import { SelectComponent } from 'app/shared/components/form/select/select.component';
import { DatePickerComponent } from 'app/shared/components/form/datepicker/datepicker.component';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { ReportState } from '../../report.state';
import { IReportFilter } from 'app/shared/interfaces/report/report.interface';
import { FormControl, FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'fuse-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    TableComponent,
    SelectComponent,
    DatePickerComponent,
    ButtonModule,
    TooltipModule,
    NgIcon
  ],
})
export class ReportListComponent implements OnInit {
  private coreService = inject(CoreService);
  private destroyedRef = inject(DestroyRef);
  private toast = inject(MessageService);

  state = inject(ReportState);

  // Form controls
  selectedReportType = signal<string>('sales');
  selectedPeriodType = signal<string>('current_month');
  customStartDate = signal<string>('');
  customEndDate = signal<string>('');

  // Form controls for the custom components
  selectedReportTypeControl = new FormControl('sales');
  selectedPeriodTypeControl = new FormControl('current_month');
  customStartDateControl = new FormControl('');
  customEndDateControl = new FormControl('');

  // Table configuration
  tableConfig = signal<TableConfig>({
    rowsPerPageOptions: [10, 20, 50],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    columns: []
  });

  constructor() {
    // Update table config when report type changes - using effect pattern from other components
    effect(() => {
      const currentType = this.state.currentReportType();
      if (currentType) {
        this.updateTableConfig();
      }
    });
  }

  ngOnInit() {
    this.coreService.setPageTitle('Relatórios', 'Consulte e analise os dados do sistema');
    this.state.loadReportData();
    this.updateTableConfig();
    
    // Sync form controls with signals
    this.selectedReportTypeControl.setValue(this.selectedReportType());
    this.selectedPeriodTypeControl.setValue(this.selectedPeriodType());
  }

  onReportTypeChange() {
    const value = this.selectedReportTypeControl.value;
    if (value) {
      this.selectedReportType.set(value);
      this.updateFilter();
    }
  }

  onPeriodTypeChange() {
    const value = this.selectedPeriodTypeControl.value;
    if (value) {
      this.selectedPeriodType.set(value);
      if (value !== 'custom') {
        this.customStartDate.set('');
        this.customEndDate.set('');
        this.customStartDateControl.setValue('');
        this.customEndDateControl.setValue('');
      }
      this.updateFilter();
    }
  }

  onCustomDateChange() {
    const startDate = this.customStartDateControl.value;
    const endDate = this.customEndDateControl.value;
    
    if (startDate) this.customStartDate.set(startDate);
    if (endDate) this.customEndDate.set(endDate);
    
    if (this.selectedPeriodType() === 'custom' && startDate && endDate) {
      this.updateFilter();
    }
  }

  private updateFilter() {
    const filter: Partial<IReportFilter> = {
      reportType: this.selectedReportType(),
      periodType: this.selectedPeriodType() as any
    };

    if (this.selectedPeriodType() === 'custom') {
      if (this.customStartDate() && this.customEndDate()) {
        filter.startDate = this.customStartDate();
        filter.endDate = this.customEndDate();
      }
    }

    this.state.setFilter(filter);
  }

  private updateTableConfig() {
    const currentType = this.state.currentReportType();
    if (currentType) {
      this.tableConfig.update(config => ({
        ...config,
        columns: currentType.columns.map(col => ({
          field: col.field,
          caption: col.caption,
          type: col.type as any,
          sortable: col.sortable,
          filter: col.filter
        }))
      }));
    }
  }

  exportToPDF() {
    this.state.exportReport('pdf')
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: (blob) => {
          this.downloadFile(blob, 'relatorio.pdf');
          this.toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Relatório exportado para PDF com sucesso'
          });
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao exportar relatório para PDF'
          });
        }
      });
  }

  exportToExcel() {
    this.state.exportReport('excel')
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: (blob) => {
          this.downloadFile(blob, 'relatorio.xlsx');
          this.toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Relatório exportado para Excel com sucesso'
          });
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao exportar relatório para Excel'
          });
        }
      });
  }

  refreshReport() {
    this.state.loadReportData();
  }

  private downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

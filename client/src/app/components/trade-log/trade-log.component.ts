import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';
import { TradeService } from '../../services/trade.service';

import { Component, OnInit, OnDestroy } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, interval } from 'rxjs';

interface Trade {
  id: string;
  date: string;
  symbol: string;
  entryTime: string;
  exitTime: string;
  entryPrice: number;
  exitPrice: number;
  strategy: string;
}



interface tradePayload {
  assetType: string,
  date: string,
  entryPrice: number,
  exitPrice: number,
  fees: number,
  quantity: number,
  symbol: string,
  tradeType: string

}



@Component({
  selector: 'app-trade-log',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './trade-log.component.html',
  styleUrl: './trade-log.component.css'
})
export class TradeLogComponent implements OnInit, OnDestroy {
  tradeForm!: FormGroup;
  trades: Trade[] = [];
  currentTime: string = '';
  isLoading: boolean = false;
  isSuccess: boolean = false;
  private timeSubscription: Subscription = new Subscription();

  // Form options
  indexOptions = [
    { value: 'NIFTY', label: 'NIFTY 50' },
    { value: 'BANKNIFTY', label: 'BANK NIFTY' },
    { value: 'FINNIFTY', label: 'FIN NIFTY' },
    { value: 'SENSEX', label: 'SENSEX' },
    { value: 'SPX', label: 'S&P 500' },
    { value: 'NASDAQ', label: 'NASDAQ' }
  ];

  strategyOptions = [
    'Scalping',
    'Day Trading',
    'Swing Trading',
    'Options Trading',
    'Futures Trading',
    'Arbitrage'
  ];

  constructor(private fb: FormBuilder) {
    this.initializeForm();
    this.loadDemoData();
  }

  ngOnInit(): void {
    this.updateCurrentTime();
    this.timeSubscription = interval(1000).subscribe(() => {
      this.updateCurrentTime();
    });
  }

  ngOnDestroy(): void {
    this.timeSubscription.unsubscribe();
  }

  private initializeForm(): void {
    this.tradeForm = this.fb.group({
      tradeDate: [this.getCurrentDate(), Validators.required],
      indexName: ['', Validators.required],
      entryTime: ['', Validators.required],
      exitTime: ['', Validators.required],
      entryPrice: ['', [Validators.required, Validators.min(0.01)]],
      exitPrice: ['', [Validators.required, Validators.min(0.01)]],
      strategy: ['', Validators.required]
    });

    // Add custom validator for exit time
    // this.tradeForm.addValidators(this.exitTimeValidator.bind(this));
  }

  private exitTimeValidator(form: FormGroup) {
    const entryTime = form.get('entryTime')?.value;
    const exitTime = form.get('exitTime')?.value;
    
    if (entryTime && exitTime && exitTime <= entryTime) {
      return { exitTimeInvalid: true };
    }
    return null;
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private updateCurrentTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  private loadDemoData(): void {
    this.trades = [
      {
        id: 'T001',
        date: '2024-08-10',
        symbol: 'NIFTY',
        entryTime: '09:30',
        exitTime: '10:15',
        entryPrice: 24850.00,
        exitPrice: 24920.00,
        strategy: 'Scalping'
      },
      {
        id: 'T002',
        date: '2024-08-10',
        symbol: 'BANKNIFTY',
        entryTime: '10:30',
        exitTime: '11:45',
        entryPrice: 51200.00,
        exitPrice: 51050.00,
        strategy: 'Day Trading'
      },
      {
        id: 'T003',
        date: '2024-08-09',
        symbol: 'FINNIFTY',
        entryTime: '14:20',
        exitTime: '15:00',
        entryPrice: 23400.00,
        exitPrice: 23580.00,
        strategy: 'Options Trading'
      },
      {
        id: 'T004',
        date: '2024-08-09',
        symbol: 'NIFTY',
        entryTime: '11:15',
        exitTime: '12:30',
        entryPrice: 24750.00,
        exitPrice: 24880.00,
        strategy: 'Swing Trading'
      },
      {
        id: 'T005',
        date: '2024-08-08',
        symbol: 'BANKNIFTY',
        entryTime: '13:45',
        exitTime: '14:30',
        entryPrice: 51100.00,
        exitPrice: 51350.00,
        strategy: 'Scalping'
      },
      {
        id: 'T006',
        date: '2024-08-08',
        symbol: 'SPX',
        entryTime: '21:30',
        exitTime: '22:15',
        entryPrice: 5520.00,
        exitPrice: 5485.00,
        strategy: 'Futures Trading'
      },
      {
        id: 'T007',
        date: '2024-08-07',
        symbol: 'NASDAQ',
        entryTime: '22:00',
        exitTime: '23:30',
        entryPrice: 17800.00,
        exitPrice: 17950.00,
        strategy: 'Day Trading'
      },
      {
        id: 'T008',
        date: '2024-08-07',
        symbol: 'NIFTY',
        entryTime: '09:45',
        exitTime: '10:20',
        entryPrice: 24680.00,
        exitPrice: 24720.00,
        strategy: 'Arbitrage'
      }
    ];
  }

  calculatePL(entryPrice: number, exitPrice: number): number {
    return exitPrice - entryPrice;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN');
  }

  getPLClass(pl: number): string {
    return pl > 0 ? 'profit' : pl < 0 ? 'loss' : 'neutral';
  }

  get totalTrades(): number {
    return this.trades.length;
  }

  get totalPL(): number {
    return this.trades.reduce((sum, trade) => {
      return sum + this.calculatePL(trade.entryPrice, trade.exitPrice);
    }, 0);
  }

  get winRate(): string {
    const winningTrades = this.trades.filter(trade => 
      this.calculatePL(trade.entryPrice, trade.exitPrice) > 0
    ).length;
    const rate = this.totalTrades > 0 ? (winningTrades / this.totalTrades * 100) : 0;
    return `${rate.toFixed(1)}%`;
  }

  get totalPLClass(): string {
    return this.getPLClass(this.totalPL);
  }

  onSubmit(): void {
    if (this.tradeForm.valid) {
      const formValue = this.tradeForm.value;
      const newTrade: Trade = {
        id: `T${String(this.trades.length + 1).padStart(3, '0')}`,
        date: formValue.tradeDate,
        symbol: formValue.indexName,
        entryTime: formValue.entryTime,
        exitTime: formValue.exitTime,
        entryPrice: parseFloat(formValue.entryPrice),
        exitPrice: parseFloat(formValue.exitPrice),
        strategy: formValue.strategy
      };

      this.isLoading = true;

      // Simulate API call
      setTimeout(() => {
        this.trades.unshift(newTrade);
        this.isLoading = false;
        this.isSuccess = true;

        // Reset success state and form
        setTimeout(() => {
          this.isSuccess = false;
          this.tradeForm.reset();
          this.tradeForm.patchValue({
            tradeDate: this.getCurrentDate()
          });
        }, 1500);
      }, 1000);
    } else {
      // Mark all fields as touched to show validation errors
      this.tradeForm.markAllAsTouched();
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.tradeForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['min']) return `${fieldName} must be greater than 0`;
    }
    if (this.tradeForm.errors?.['exitTimeInvalid'] && (fieldName === 'exitTime' || fieldName === 'entryTime')) {
      return 'Exit time must be after entry time';
    }
    return '';
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.tradeForm.get(fieldName);
    return !!(field?.errors && field.touched) || 
           !!(this.tradeForm.errors?.['exitTimeInvalid'] && (fieldName === 'exitTime' || fieldName === 'entryTime'));
  }

  getPLPreview(): string {
    const entryPrice = parseFloat(this.tradeForm.get('entryPrice')?.value) || 0;
    const exitPrice = parseFloat(this.tradeForm.get('exitPrice')?.value) || 0;
    
    if (entryPrice > 0 && exitPrice > 0) {
      const pl = exitPrice - entryPrice;
      return pl >= 0 ? `+₹${pl.toFixed(2)}` : `-₹${Math.abs(pl).toFixed(2)}`;
    }
    return '';
  }
}
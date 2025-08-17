import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

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

@Component({
  selector: 'app-trade-log',
  imports: [CommonModule],
  templateUrl: './trade-log.component.html',
  styleUrls: ['./trade-log.component.css']
})
export class TradeLogComponent {
  trades: Trade[] = [
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
      date: '2024-08-11',
      symbol: 'BANKNIFTY',
      entryTime: '09:45',
      exitTime: '10:30',
      entryPrice: 42500.00,
      exitPrice: 42400.00,
      strategy: 'Day Trading'
    }
  ];

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

  getPLClass(pl: number): string {
    if (pl > 0) return 'profit';
    if (pl < 0) return 'loss';
    return 'neutral';
  }

  get totalTrades(): number {
    return this.trades.length;
  }

  get totalPL(): number {
    return this.trades.reduce((sum, t) => sum + this.calculatePL(t.entryPrice, t.exitPrice), 0);
  }

  get totalPLClass(): string {
    return this.getPLClass(this.totalPL);
  }
}

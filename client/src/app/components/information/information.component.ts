import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Strategy {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

interface Index {
  id: string;
  name: string;
  symbol: string;
  isSelected: boolean;
}

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './information.component.html',
  styleUrl: './information.component.css'
})
export class InformationComponent {

  strategies: Strategy[] = [
    {
      id: '1',
      name: 'Moving Average Crossover',
      description: 'Buy when short MA crosses above long MA, sell when it crosses below',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'RSI Divergence',
      description: 'Trade based on RSI divergence patterns with price action',
      createdAt: new Date('2024-01-20')
    }
  ];

  newStrategy = {
    name: '',
    description: ''
  };

  showAddStrategyForm = false;

  availableIndices: Index[] = [
    { id: '1', name: 'S&P 500', symbol: 'SPX', isSelected: true },
    { id: '2', name: 'Nasdaq 100', symbol: 'NDX', isSelected: true },
    { id: '3', name: 'Dow Jones', symbol: 'DJI', isSelected: false },
    { id: '4', name: 'Russell 2000', symbol: 'RUT', isSelected: false },
    { id: '5', name: 'FTSE 100', symbol: 'UKX', isSelected: false },
    { id: '6', name: 'Nikkei 225', symbol: 'NKY', isSelected: true },
    { id: '7', name: 'DAX', symbol: 'DAX', isSelected: false },
    { id: '8', name: 'CAC 40', symbol: 'CAC', isSelected: false },
    { id: '9', name: 'Hang Seng', symbol: 'HSI', isSelected: false },
    { id: '10', name: 'ASX 200', symbol: 'AS51', isSelected: false }
  ];

  toggleAddStrategyForm(): void {
    this.showAddStrategyForm = !this.showAddStrategyForm;
    if (!this.showAddStrategyForm) {
      this.resetStrategyForm();
    }
  }

  addStrategy(): void {
    const name = this.newStrategy.name.trim();
    const description = this.newStrategy.description.trim();

    if (name && description) {
      const strategy: Strategy = {
        id: Date.now().toString(),
        name,
        description,
        createdAt: new Date()
      };
      this.strategies.unshift(strategy);
      this.resetStrategyForm();
      this.showAddStrategyForm = false;
    }
  }

  deleteStrategy(id: string): void {
    this.strategies = this.strategies.filter(s => s.id !== id);
  }

  resetStrategyForm(): void {
    this.newStrategy = { name: '', description: '' };
  }

  toggleIndex(id: string): void {
    const index = this.availableIndices.find(i => i.id === id);
    if (index) {
      index.isSelected = !index.isSelected;
    }
  }

  getSelectedIndices(): Index[] {
    return this.availableIndices.filter(i => i.isSelected);
  }

  clearAllIndices(): void {
    this.availableIndices.forEach(i => i.isSelected = false);
  }

  selectAllPopular(): void {
    const popularNames = ['S&P 500', 'Nasdaq 100', 'Dow Jones', 'Russell 2000', 'FTSE 100', 'Nikkei 225'];
    this.availableIndices.forEach(index => {
      if (popularNames.includes(index.name)) {
        index.isSelected = true;
      }
    });
  }
}

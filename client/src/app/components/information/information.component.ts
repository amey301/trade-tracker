import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../navbar/navbar.component";

interface Strategy {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  // isActive: boolean;
}

interface Index {
  id: string;
  name: string;
  symbol: string;
  isSelected: boolean;
}


@Component({
  selector: 'app-information',
  imports: [CommonModule, FormsModule],
  templateUrl: './information.component.html',
  styleUrl: './information.component.css'
})
export class InformationComponent implements OnInit {
  
  // Strategy Management
  strategies: Strategy[] = [
    {
      id: '1',
      name: 'Moving Average Crossover',
      description: 'Buy when short MA crosses above long MA, sell when it crosses below',
      createdAt: new Date('2024-01-15'),
      // isActive: true
    },
    {
      id: '2',
      name: 'RSI Divergence',
      description: 'Trade based on RSI divergence patterns with price action',
      createdAt: new Date('2024-01-20'),
      // isActive: false
    }
  ];

  newStrategy = {
    name: '',
    description: ''
  };

  showAddStrategyForm = false;

  // Index Management
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

  popularIndices = ['S&P 500', 'Nasdaq 100', 'Dow Jones', 'Russell 2000', 'FTSE 100', 'Nikkei 225'];

  ngOnInit(): void {
    // Component initialization
  }

  // Strategy Methods
  toggleAddStrategyForm(): void {
    this.showAddStrategyForm = !this.showAddStrategyForm;
    if (!this.showAddStrategyForm) {
      this.resetStrategyForm();
    }
  }

  addStrategy(): void {
    if (this.newStrategy.name.trim() && this.newStrategy.description.trim()) {
      const strategy: Strategy = {
        id: Date.now().toString(),
        name: this.newStrategy.name.trim(),
        description: this.newStrategy.description.trim(),
        createdAt: new Date(),
        // isActive: false
      };
      
      this.strategies.unshift(strategy);
      this.resetStrategyForm();
      this.showAddStrategyForm = false;
    }
  }

  deleteStrategy(id: string): void {
    this.strategies = this.strategies.filter(s => s.id !== id);
  }

  toggleStrategyStatus(id: string): void {
    const strategy = this.strategies.find(s => s.id === id);
    if (strategy) {
      // strategy.isActive = !strategy.isActive;
    }
  }

  resetStrategyForm(): void {
    this.newStrategy = { name: '', description: '' };
  }

  // Index Methods
  toggleIndex(id: string): void {
    const index = this.availableIndices.find(i => i.id === id);
    if (index) {
      index.isSelected = !index.isSelected;
    }
  }

  addPopularIndex(indexName: string): void {
    const index = this.availableIndices.find(i => i.name === indexName);
    if (index && !index.isSelected) {
      index.isSelected = true;
    }
  }

  getSelectedIndices(): Index[] {
    return this.availableIndices.filter(i => i.isSelected);
  }

  clearAllIndices(): void {
    this.availableIndices.forEach(i => i.isSelected = false);
  }

  selectAllPopular(): void {
    this.popularIndices.forEach(indexName => {
      this.addPopularIndex(indexName);
    });
  }

  isIndexSelected(indexName: string): boolean {
  const found = this.availableIndices.find(i => i.name === indexName);
  return found ? !!found.isSelected : false;
}
}
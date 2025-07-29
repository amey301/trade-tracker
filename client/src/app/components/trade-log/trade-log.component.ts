import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';
import { TradeService } from '../../services/trade.service';

interface Trade {
  date: string;
  symbol: string;
  asset: string;
  type: string;
  qty: number;
  entry: number;
  exit: number;
  fees: number;
  pl: number;
  _id: string;

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
export class TradeLogComponent implements OnInit{
  
  tradeForm : FormGroup
  
  trades: Trade[] = [];


  tradePayload: [] =[]
  // trades: [] = []
  ngOnInit(): void {
      this.tradeService.getTrades().subscribe(
        (res: any) => {
 this.trades = res.data.map((trade: any) => {
    return {
      date: new Date(trade.date).toLocaleDateString(),
      symbol: trade.symbol,
      asset: trade.assetType,
      type: trade.tradeType,
      qty: trade.quantity,
      entry: trade.entryPrice,
      exit: trade.exitPrice,
      fees: trade.fees,
      pl: (trade.exitPrice - trade.entryPrice - trade.fees) * trade.quantity,
      _id: trade._id
    };
  });
  console.log(`This is trades`,this.trades)
        },
        (err: any) => {
          console.error(err)
        }
      )
  }


    constructor(private fb: FormBuilder, private tradeService: TradeService) {
    this.tradeForm = this.fb.group({
      date: ['', Validators.required],
      symbol: ['', Validators.required],
      assetType: ['', Validators.required], // e.g., dropdown crypto/stock
      tradeType: ['', Validators.required], // buy/sell
      quantity: [0, [Validators.required, Validators.min(1)]],
      entryPrice: [0, [Validators.required, Validators.min(0)]],
      exitPrice: [0, [Validators.required, Validators.min(0)]],
      fees: [0], // optional
    });
  }


  // trades: Trade[] = [
  //   {
  //     date: '2025-07-24',
  //     symbol: 'BTCUSDT',
  //     type: 'Buy',
  //     qty: 0.01,
  //     entry: 29500,
  //     exit: 29800,
  //     pl: 300
  //   },
  //   {
  //     date: '2025-07-23',
  //     symbol: 'ETHUSDT',
  //     type: 'Sell',
  //     qty: 0.5,
  //     entry: 1900,
  //     exit: 1850,
  //     pl: 250
  //   },
  //   {
  //     date: '2025-07-22',
  //     symbol: 'BNBUSDT',
  //     type: 'Buy',
  //     qty: 1,
  //     entry: 320,
  //     exit: 310,
  //     pl: -10
  //   }
  // ];


    editTrade(trade: Trade) {
    console.log('Editing trade:', trade);
    // Add logic to populate form for editing
  }

deleteTrade(id: Trade["_id"]) {
  console.log('Deleting trade:', id);

  this.tradeService.deleteTrade(id).subscribe(
    (res: any) => {
      console.log(res);
      // ✅ Remove from local trades array
      this.trades = this.trades.filter(t => t._id !== id);
    },
    (err: any) => {
      console.error('Delete failed:', err);
    }
  );
}


 isModalActive: boolean = false

openModal(){
  this.isModalActive = true
  console.log(`true`)
}

closeModal() {
  this.isModalActive = false;
  console.log('Modal closed');
}

onSubmit() {
  if (this.tradeForm.valid) {
    console.log('Form submitted:', this.tradeForm.value);
    this.tradePayload = this.tradeForm.value;

    this.tradeService.submitTrade(this.tradePayload).subscribe(
      (res: any) => {
        console.log('Trade submitted:', res);

        // ✅ Push new trade to trades array to update UI
        const newTrade = {
          date: new Date(res.data.date).toLocaleDateString(),
          symbol: res.data.symbol,
          asset: res.data.assetType,
          type: res.data.tradeType,
          qty: res.data.quantity,
          entry: res.data.entryPrice,
          exit: res.data.exitPrice,
          fees: res.data.fees,
          pl: (res.data.exitPrice - res.data.entryPrice - res.data.fees) * res.data.quantity,
          _id: res.data._id
        };

        this.trades.push(newTrade);

        // ✅ Close modal and reset form
        this.closeModal();
        this.tradeForm.reset();
      },
      (err: any) => {
        console.error('Error submitting trade:', err);
      }
    );
  } else {
    console.log('Form not valid');
  }
}

}

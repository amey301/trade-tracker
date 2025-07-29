import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// interface SubmitTrade {
//   assetType: string,
//   date: Date,
//   entryPrice: number,
//   exitPrice: number,
//   fees: number,
//   quantity: number,
//   symbol: string,
//   tradeType: string
// }


@Injectable({
  providedIn: 'root'
})
export class TradeService {

  constructor(private http: HttpClient) { }

  getTrades(){
    return this.http.get('http://localhost:5000/v1/user/trades', {withCredentials: true})
  }

  submitTrade(payload:any){
    return this.http.post('http://localhost:5000/v1/user/form', payload, {withCredentials: true})
  }

  deleteTrade(id: string){
    return this.http.delete(`http://localhost:5000/v1/user/trade/delete/${id}`, {withCredentials: true})
  }
}




import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TradeLogComponent } from "./components/trade-log/trade-log.component";
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TradeLogComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'client';
}

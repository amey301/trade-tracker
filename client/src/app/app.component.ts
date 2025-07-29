import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingPageComponent } from "./components/landing-page/landing-page.component";
import { TradeLogComponent } from "./components/trade-log/trade-log.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LandingPageComponent, TradeLogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'client';
}

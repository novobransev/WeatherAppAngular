import { NgIf } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-right-container',
  imports: [NgIf],
  templateUrl: './right-container.component.html',
  styleUrl: './right-container.component.css'
})
export class RightContainerComponent {
  today:boolean = false;
  week:boolean = true;

  celsius:boolean = true;
  fahrenheit:boolean = false;

  onTodayClick() {
    this.today = true;
    this.week = false;
  }

  onWeekClick() {
    this.today = false;
    this.week = true;
  }

  onCelsiusClick() {
    this.celsius = true;
    this.fahrenheit = false;
  }

  onFahrenheitClick() {
    this.celsius = false;
    this.fahrenheit = true;
  }
}

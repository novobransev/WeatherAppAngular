import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import { faThumbsUp, faThumbsDown, faFaceSmile, faFaceFrown } from '@fortawesome/free-solid-svg-icons'
import { WeatherService } from '../Services/weather.service';


@Component({
  selector: 'app-right-container',
  imports: [NgIf, FaIconComponent, NgFor],
  templateUrl: './right-container.component.html',
  styleUrl: './right-container.component.css'
})
export class RightContainerComponent {
  constructor(public weatherSerice: WeatherService){};

  faThumbsUp:any = faThumbsUp;
  faThumbsDown:any = faThumbsDown;
  faFaceSmile:any = faFaceSmile;
  faFaceFrown:any = faFaceFrown;

  onTodayClick() {
    this.weatherSerice.today = true;
    this.weatherSerice.week = false;
  }

  onWeekClick() {
    this.weatherSerice.week = true;
    this.weatherSerice.today = false;
  }

  onCelsiusClick() {
    this.weatherSerice.celsius = true;
    this.weatherSerice.fahrenheit = false;
  }

  onFahrenheitClick() {
    this.weatherSerice.celsius = false;
    this.weatherSerice.fahrenheit = true;
  }


}

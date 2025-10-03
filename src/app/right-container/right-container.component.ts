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
  today:boolean = false;
  week:boolean = true;

  celsius:boolean = true;
  fahrenheit:boolean = false;

  faThumbsUp:any = faThumbsUp;
  faThumbsDown:any = faThumbsDown;
  faFaceSmile:any = faFaceSmile;
  faFaceFrown:any = faFaceFrown;

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

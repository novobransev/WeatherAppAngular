  import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { LocationDetails } from '../Models/LocationDetails';
  import { WeatherDetails } from '../Models/WeatherDetails';
  import { TemperatureData } from '../Models/TemperatureData';
  import { TodayData } from '../Models/TodayData';
  import { WeekData } from '../Models/WeekData';
  import { TodayHightlight } from '../Models/TodaysHightlights';
  import { Observable } from 'rxjs';
  import { get } from 'http';
  import { EnvironmentVariables } from '../Environment/EnvironmentVariables';
  import { response } from 'express';

  @Injectable({
    providedIn: 'root'
  })
  export class WeatherService {
    cityName:string = "Moscow";
    language:string = "en-US";
    date:string = '20251002'
    units:string = 'm'

    today:boolean = false;
    week:boolean = true;
  
    celsius:boolean = true;
    fahrenheit:boolean = false;

    currentTime:Date = new Date();

    locationDetails?: LocationDetails;
    weatherDetails?: WeatherDetails;

    temperatureData: TemperatureData;
    todayData?: TodayData[] = [];
    weekData?: WeekData[] = [];
    todaysHightlights?: TodayHightlight = new TodayHightlight();

    constructor(private httpClient: HttpClient) {
      this.temperatureData = new TemperatureData(); 
      this.getData();
    }

    getSummaryImage(summary:string):string{
      var cloudySunny = "https://cdn-icons-png.flaticon.com/128/1146/1146869.png"
      var rainSunny = "https://cdn-icons-png.flaticon.com/128/12607/12607703.png"
      var windy = "https://cdn-icons-png.flaticon.com/128/2044/2044028.png"
      var sunny = "https://cdn-icons-png.flaticon.com/128/9231/9231728.png"
      var rainy = "https://cdn-icons-png.flaticon.com/128/4724/4724094.png"

      if(String(summary).includes("Partly Cloudy") || String(summary).includes("P Cloudy")) return cloudySunny
      else if(String(summary).includes("Partly Rainy") || String(summary).includes("P Rainy")) return rainSunny
      else if(String(summary).includes("wind")) return windy
      else if(String(summary).includes("rain")) return rainy
      else if(String(summary).includes("Sun")) return sunny

      return cloudySunny
    }

    fillTemperatureDataModel() {
      
      this.currentTime = new Date();
      this.temperatureData.day = this.weatherDetails['v3-wx-observations-current'].dayOfWeek;
      this.temperatureData.time = `${String(this.currentTime.getHours()).padStart(2, '0')}:${String(this.currentTime.getMinutes()).padStart(2, '0')}`
      this.temperatureData.temperature = this.weatherDetails['v3-wx-observations-current'].temperature;
      this.temperatureData.location = `${this.locationDetails.location.city[0]},${this.locationDetails.location.country[0]}`
      this.temperatureData.rainPercent = this.weatherDetails['v3-wx-observations-current'].precip24Hour;
      this.temperatureData.SummaryPhrase = this.weatherDetails['v3-wx-observations-current'].wxPhraseShort;
      this.temperatureData.summaryImage = this.getSummaryImage(this.temperatureData.SummaryPhrase)
    }

    fillWeekData() {
      var weekCount = 0;

      while(weekCount < 7) {
        this.weekData.push(new WeekData())
        this.weekData[weekCount].day = this.weatherDetails['v3-wx-forecast-daily-15day'].dayOfWeek[weekCount].slice(0, 3);
        this.weekData[weekCount].tempMax = this.weatherDetails['v3-wx-forecast-daily-15day'].calendarDayTemperatureMax[weekCount].toString();
        this.weekData[weekCount].tempMin = this.weatherDetails['v3-wx-forecast-daily-15day'].calendarDayTemperatureMin[weekCount].toString();
        this.weekData[weekCount].summaryImage = this.getSummaryImage(this.weatherDetails['v3-wx-forecast-daily-15day'].narrative[weekCount])
        weekCount++
      }
      }

      fillTodayData() {
    var todayCount = 0;

      while(todayCount < 7) {
        this.todayData.push(new TodayData())
        this.todayData[todayCount].time = this.weatherDetails['v3-wx-forecast-hourly-10day'].validTimeLocal[todayCount].slice(11, 16);
        this.todayData[todayCount].temperature = this.weatherDetails['v3-wx-forecast-hourly-10day'].temperature[todayCount];
        this.todayData[todayCount].time = this.getSummaryImage(this.weatherDetails['v3-wx-forecast-hourly-10day'].wxPhraseShort[todayCount]);
        todayCount++
      }
    }

    getTimeFromString(localTime: string) {
      return localTime.slice(12, 17)
    }

    fillTodaysHilights() {
      this.todaysHightlights.airQuality = this.weatherDetails['v3-wx-globalAirQuality'].globalairquality.airQualityIndex;
      this.todaysHightlights.humidity = this.weatherDetails['v3-wx-observations-current'].precip24Hour;
      this.todaysHightlights.sunrise = this.getTimeFromString( this.weatherDetails['v3-wx-observations-current'].sunriseTimeLocal);
      this.todaysHightlights.sunset = this.getTimeFromString(this.weatherDetails['v3-wx-observations-current'].sunsetTimeLocal);
      this.todaysHightlights.uvindex = this.weatherDetails['v3-wx-observations-current'].uvIndex;
      this.todaysHightlights.visibility = this.weatherDetails['v3-wx-observations-current'].visibility;
      this.todaysHightlights.windStatus = this.weatherDetails['v3-wx-observations-current'].windSpeed;
    }

    prepareData():void {
    this.fillTemperatureDataModel()
    this.fillWeekData()
    this.fillTodayData()
    this.fillTodaysHilights()
    console.log(this.temperatureData);
    console.log(this.weekData);
    console.log(this.todayData);
    console.log(this.todaysHightlights);
    }

    celciusToFahrenheit(celsuis: number) {
      return (celsuis * 1.8) + 32;
    }

    fahrenheitToCelcius(fahrenheit: number) {
      return (fahrenheit - 32) * 0.555;
    }

    getLocationDetails(cityName: string, language:string):Observable<LocationDetails>{
      return this.httpClient.get<LocationDetails>(EnvironmentVariables.weatherApiLocationBaseURL, {
        headers: new HttpHeaders()
          .set(EnvironmentVariables.xRapidApiKeyName, EnvironmentVariables.xRapidApiKeyValue)
          .set(EnvironmentVariables.xRapidApiHostName, EnvironmentVariables.xRapidApiHostValue),
        params: new HttpParams()
          .set('query', cityName)
          .set('language', language)
      })
    }

    getWeatherReport(date: string, latitude: number, longitude: number, language: string, units: string):Observable<WeatherDetails> {
      return this.httpClient.get<WeatherDetails>(EnvironmentVariables.weatherApiForecastBaseURL, {
        headers: new HttpHeaders()
          .set(EnvironmentVariables.xRapidApiKeyName, EnvironmentVariables.xRapidApiKeyValue)
          .set(EnvironmentVariables.xRapidApiHostName, EnvironmentVariables.xRapidApiHostValue),
        params: new HttpParams()
          .set('date', date)
          .set('latitude', latitude)
          .set('longitude', longitude)
          .set('language', language)
          .set('units', units)
      });
    }

    getData() {
      var latitude = 0;
      var longitude = 0;
      this.getLocationDetails(this.cityName, this.language).subscribe({
        next:(response)=> {
          this.locationDetails = response;
          latitude = this.locationDetails?.location.latitude[0];
          longitude = this.locationDetails?.location.longitude[0];

          this.getWeatherReport(
            this.date,
            latitude,
            longitude,
            this.language,
            this.units
          ).subscribe({
            next:(response) => {
              this.weatherDetails = response;
              this.prepareData();
            }
          })
        }
      })
    }
  }

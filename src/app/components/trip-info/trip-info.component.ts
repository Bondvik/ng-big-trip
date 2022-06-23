import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { IPoint } from 'src/app/shared/interfaces/ipoint';

const MAX_COUNT_CITIES = 3;

@Component({
  selector: 'app-trip-info',
  templateUrl: './trip-info.component.html',
  styleUrls: ['./trip-info.component.scss']
})
export class TripInfoComponent implements OnInit {

  trip: IPoint[] = [];
  startDate: Date | null = null;
  endDate!: Date;
  tripCities = '';
  totalPrice = 0;

  constructor(public api: ApiService) { }

  ngOnInit(): void {
    this.getTripInfo();
  }

  getTripInfo() {
    this.api.getPoints('points').subscribe((data) => {
      this.trip = data.map((item) => {
        return {
          ...item,
          date_from: new Date(item.date_from),
          date_to: new Date(item.date_to),
        }
      })
      this.trip.sort((prev, next) => {
        return prev.date_from.getTime() - next.date_from.getTime()
      })
      this.getStartEndDate();
      this.getTripCities();
      this.getTotalPrice();
    })
  }

  protected getStartEndDate() {
    this.startDate = this.trip[0].date_from as Date;
    this.endDate = this.trip[this.trip.length - 1].date_from as Date;
  }

   getTripCities() {
    const cities = this.trip.map((item) => item.destination['name']);
    if (cities.length > MAX_COUNT_CITIES) {
      this.tripCities = `${cities[0]} - ... - ${cities[cities.length - 1]}`;
    } else {
      this.tripCities = cities.join(' - ');
    }
  }

  protected getTotalPrice() {
    this.totalPrice = this.trip.reduce((accum, item) => {
      return accum + item.base_price
    }, 0)
  }
}

import { Component, OnInit, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { IPoint } from 'src/app/shared/interfaces/ipoint';
import { Mode } from 'src/app/shared/mode.enum';
import { Sorttype } from 'src/app/shared/sorttype.enum';
import { PointComponent } from '../point/point.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  points: IPoint[] = [];
  defaultPoints: IPoint[] = [];
  currentType = '';
  filterValue: string = '';
  @Output() changedDestination = new EventEmitter();
  @Output() isCheckedType = new EventEmitter();

  @ViewChildren('listChild') listChildren!: QueryList<PointComponent>;

  constructor(public api: ApiService) { }

  ngOnInit(): void {
    this.loadPoints();
  }

  loadPoints() {
    this.api.getPoints('points').subscribe((data) => {
      const points = data.map((item) => {
        return {
          ...item,
          date_from: new Date(item.date_from),
          date_to: new Date(item.date_to),
        }
      })
      points.sort((prev, next) => {
        return prev.date_from.getTime() - next.date_from.getTime()
      })
      this.points = points;
      this.defaultPoints = points;
      this.filterOutPoints();
    })
  }

  updateList() {
    this.loadPoints();
  }

  changeDestination(value: any) {
    this.changedDestination.emit(value);
  }

  editPoint(value: any) {
    this.listChildren.forEach(item => {
      if (item.point.id !== value) {
        item.mode = Mode.default;
      }
    })
  }

  filterOutPoints(value: string = '') {
    this.filterValue = value ? value : this.filterValue;
    switch (this.filterValue) {
      case 'everything':
        this.points = [...this.defaultPoints]
        break;
      case 'future':
        this.points = this.defaultPoints.filter((item: IPoint) => item.date_from > new Date() || item.date_from === new Date());
        break;
      case 'past':
        this.points = this.defaultPoints.filter((item: IPoint) => item.date_to < new Date());
        break;
      default:
        this.points = [...this.defaultPoints];
    }
    this.isCheckedType.emit('day');
    this.points.sort((prev, next) => {
      return prev.date_from.getTime() - next.date_from.getTime()
    })
  }

  sortPoints(value: any) {
      switch (value) {
        case 'day':
          this.points.sort((prev, next) => {
            return prev.date_from.getTime() - next.date_from.getTime()
          })
          break;
        case 'time':
          this.points.sort((prevPoint: any, nextPoint: any) => (nextPoint.date_to - nextPoint.date_from) - (prevPoint.date_to - prevPoint.date_from));
          break;
        case 'price':
          this.points.sort((prevPoint, nextPoint) => nextPoint.base_price - prevPoint.base_price);
          break;
        default:
          this.points = [...this.defaultPoints]
      }
  }

}

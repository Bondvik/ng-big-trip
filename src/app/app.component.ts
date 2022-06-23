import { Component, ViewChild } from '@angular/core';
import { ListSortComponent } from './components/list-sort/list-sort.component';
import { ListComponent } from './components/list/list.component';
import { TripInfoComponent } from './components/trip-info/trip-info.component';
import { MenuItem } from './shared/menuItem.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('listPoints') list!: ListComponent;
  @ViewChild('refInfoTrip') infoTrip!: TripInfoComponent;
  @ViewChild('sortList') sortList!: ListSortComponent;

  title = 'big-trip';
  isDisabledButton = false;
  mode = '';
  type = '';
  clickItem = MenuItem.TABLE;
  isTable!: boolean;

  onAddNewEvent(value: any) {
    this.isDisabledButton = value.isDisabledButton;
    this.mode = value.mode;
    this.isTable = value.isTable;
  }

  saveNewPoint(value: any) {
    this.mode = value.mode;
    this.isDisabledButton = value.isDisabledButton;
    this.isTable = value.isTable;
    this.list.updateList();
  }

  onCancelCard(value: any) {
    this.isDisabledButton = value.isDisabledButton;
    this.isTable = value.isTable;
  }

  changeDestination(value:any) {
    if (!value) {
      return
    }
    this.infoTrip.getTripInfo();
  }

  checkedFilter(value: string) {
    this.list.filterOutPoints(value);
  }

  checkedSort(value: string) {
    this.list.sortPoints(value)
  }

  isCheckedType(value: string) {
    this.sortList.currentType = 'day';
  }

  checkedItemMenu(value: MenuItem) {
    this.clickItem = value;
    this.isTable = false;
  }

}

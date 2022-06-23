import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { IPoint } from 'src/app/shared/interfaces/ipoint';
import { Sorttype } from 'src/app/shared/sorttype.enum';

@Component({
  selector: 'app-list-sort',
  templateUrl: './list-sort.component.html',
  styleUrls: ['./list-sort.component.scss']
})
export class ListSortComponent implements OnInit {
  @Output() checkedSort = new EventEmitter();
  sortTypes: string[] = [];
  currentType = 'day';

  constructor(public api: ApiService) { }

  ngOnInit(): void {
    this.getSortView();
  }

  changedSort(value: any) {
    this.currentType = value
    this.checkedSort.emit(this.currentType);
  }

  getSortView() {
    this.sortTypes = Object.values(Sorttype);
  }

}

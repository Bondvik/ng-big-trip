import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FilterType } from 'src/app/shared/filtertype.enum';
import { IPoint } from 'src/app/shared/interfaces/ipoint';

@Component({
  selector: 'app-list-filter',
  templateUrl: './list-filter.component.html',
  styleUrls: ['./list-filter.component.scss']
})
export class ListFilterComponent implements OnInit {
  filters: string[] = [];
  isCheckedFilter = false;
  @Output() checkedFilter = new EventEmitter();

  constructor(public api: ApiService) { }

  ngOnInit(): void {
    this.getFilterView();
  }

  getFilterView() {
    this.filters = Object.values(FilterType);
  }

  changedFilter(event: any) {
    const value = (event.target.value) as string;
    this.checkedFilter.emit(value);
  }

}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem } from 'src/app/shared/menuItem.enum';

@Component({
  selector: 'app-page-navigation',
  templateUrl: './page-navigation.component.html',
  styleUrls: ['./page-navigation.component.scss']
})
export class PageNavigationComponent implements OnInit {
  menuItems: string[] = [];
  itemMenu = '';

  @Output() checkedItemMenu = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.getMenuItems();
  }

  getMenuItems() {
    this.menuItems = Object.values(MenuItem);
  }

  onClickItemMenu(event: any) {
    this.itemMenu = (event.target.text as string).toUpperCase();
    this.checkedItemMenu.emit(this.itemMenu);
  }

}

import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Mode } from 'src/app/shared/mode.enum';

@Component({
  selector: 'app-add-new-point',
  templateUrl: './add-new-point.component.html',
  styleUrls: ['./add-new-point.component.scss']
})
export class AddNewPointComponent implements OnInit {
  @Input() isDisabledButton!: boolean;
  @Output() addNewEvent = new EventEmitter();

  mode = Mode.default;

  constructor() { }

  ngOnInit(): void {
  }

  onClickAddNewEvent() {
    this.isDisabledButton = Boolean(true);
    this.mode = Mode.add;
    this.addNewEvent.emit({
      isDisabledButton: this.isDisabledButton,
      mode: this.mode,
      isTable: true
    });
  }

}

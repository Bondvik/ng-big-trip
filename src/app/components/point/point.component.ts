import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyValidators } from 'src/app/my.validators';
import { ApiService } from 'src/app/services/api.service';
import { IDestination } from 'src/app/shared/interfaces/idestination';
import { IOffer } from 'src/app/shared/interfaces/ioffer';
import { IOffers } from 'src/app/shared/interfaces/ioffers';
import { IPoint } from 'src/app/shared/interfaces/ipoint';
import { Mode } from 'src/app/shared/mode.enum';

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.scss']
})
export class PointComponent implements OnInit {
  @Input() point: IPoint = {} as IPoint;
  @Output() updateList = new EventEmitter();
  @Output() changedDestination = new EventEmitter();
  @Output() editPointId = new EventEmitter();

  mode = Mode.default;
  type = '';
  price = 0;
  name = '';

  date7!: Date;
  date_from!: Date;
  date_to!: Date;

  form!: FormGroup;
  types: IOffers[] = [];

  pointDefault!: IPoint;

  //Список городов
  destinations: IDestination[]  = [];
  //Описание города
  description = '';
  //Выпадающий список types
  //Когда false - список не открывается
  eventTypeToggle = false;

  offers: IOffers[] = [];
  offersByEventType: any;
  offersByEvent: any;

  isChangeDestination = false;

  constructor(protected api: ApiService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      price: new FormControl(this.point.base_price, [
        Validators.required,
        MyValidators.restrictedPrice
      ]
        ),
      type: new FormControl(''),
      destination: new FormControl(this.point.destination.name, Validators.required),
      startDateEvent: new FormControl(this.point.date_from, MyValidators.rectrictedStartEventDate(this.point.date_to)),
      endDateEvent: new FormControl(this.point.date_to, MyValidators.rectrictedEndEventDate(this.point.date_from))
    });
    this.type = this.point.type;
    this.name = this.point.destination.name;
    this.description = this.point.destination.description;
    this.price = this.point.base_price;
    this.date_from = this.point.date_from;
    this.date_to = this.point.date_to;

    this.getEventTypes();
    this.getDestinations();
    this.getOffers();

    this.pointDefault = Object.assign({}, this.point)
  }

  getDuration(date_from: Date, date_to: Date) {
    const dateFrom = new Date (date_from);
    const dateTo = new Date (date_to);
    //Разница в днях
    const diffDate = dateTo.getDate() - dateFrom.getDate();
    //Разница в часах
    const diffHours= Math.abs(dateTo.getHours() - dateFrom.getHours());
    // Разница в минутах
    const diffMinutes = Math.abs(dateTo.getMinutes() - dateFrom.getMinutes());

    if (diffDate === 0 && diffHours === 0) {
      return `${diffMinutes}M`;
    }

    if (diffDate === 0) {
      return `${diffHours}H ${diffMinutes}M`;
    }

    return `${diffDate}D ${diffHours}H ${diffMinutes}M`
  }

  getOffers() {
    this.api.getOffers('offers').subscribe((data) => {
      this.offers = data as IOffers[];
      this.offersByEvent = this.point.offers;
      this.getOffersByType();
      this.getCheckedOffers();
    })
  }

  getOffersByType() {
    const data = this.offers.find((item) => item.type === this.type);
    this.offersByEventType = data?.offers.map((item: IOffer)=> {
      return {
        ...item,
        isChecked: false
      }
    })
  }

  getCheckedOffers() {
    this.offersByEventType = this.offersByEventType.reduce((accum: any, elem: any) => {
      if (this.offersByEvent.find((item: any) => item.title === elem.title)) {
        accum.push({
          ...elem,
          isChecked: true
        })
      } else {
        accum.push({
          ...elem,
          isChecked: false
        })
      }
      return accum;
    }, [])
  }

  getEventTypes() {
    this.api.getOffers('offers').subscribe((data) => {
      this.types = data as IOffers[];
    })
  }

  getDestinations() {
    this.api.getDestinations('destinations').subscribe((data) => {
      this.destinations = data;
    })
  }

  onChangedDestination(event: any) {
    const data = this.destinations.find((item) => item.name === event.target.value);
    this.description = (data?.description) as string;
    this.name = (data?.name) as string;
  }

  onChangedPrice(event: any) {
    this.price = event.target.value;
  }

  onChangedOffer(offer: any) {
    offer.isChecked = !offer.isChecked;
  }

  onChangedTypeHandler(item: string) {
    this.eventTypeToggle = false;
    this.type = item;
    this.getOffersByType();
  }

  onSelectStartDateEvent(event: Date) {
    this.date_from = event;
  }

  onSelectEndDateEvent(event: Date) {
    this.date_to = event;
  }

  setFavoriteClickHandler(point: IPoint) {
    point.is_favorite = !point.is_favorite;
    this.api.setFavoriteClick('points', point).subscribe(
      (point: IPoint) => {},
      (error: any) => {console.log(error)}
    )
  }

  openEventClickHandler(id: string) {
    this.mode = Mode.editing;
    this.editPointId.emit(id);
  }

  submitHandler(point: IPoint) {
    if (!this.form.valid) {
      return
    }
    const offers = (this.offersByEventType as []).filter((item: IOffer) => item.isChecked).map((item: IOffer) => {
      const {
        price,
        title
      } = item;
      return {price, title}
    });
    const editPoint = {
      ...point,
      base_price: +this.price,
      date_from: this.date_from.toISOString(),
      date_to: this.date_to.toISOString(),
      destination: {
        description: this.description,
        name: this.name,
        pictures: []
      },
      offers,
      type: this.type
    }
    this.api.editPointClick('points', editPoint).subscribe(
      (editPoint: IPoint) => {
        this.mode = Mode.default;
        this.isChangeDestination = Boolean(true);
        this.updateList.emit();
        this.changedDestination.emit(this.isChangeDestination);
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  deletePoint(id: string) {
    this.api.deleteData(`points`, id).subscribe((data) => {
      console.log('Delete successful');
      this.updateList.emit();
    }
    )
  }

  closeEditCard() {
    this.api.editPointClick('points', this.pointDefault).subscribe(
      (editPoint: IPoint) => {
        this.mode = Mode.default;
        this.updateList.emit();
      },
      (error: any) => {
        console.log(error)
      }
    )
  }
}

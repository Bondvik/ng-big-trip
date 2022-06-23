import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyValidators } from 'src/app/my.validators';
import { ApiService } from 'src/app/services/api.service';
import { IDestination } from 'src/app/shared/interfaces/idestination';
import { IOffer } from 'src/app/shared/interfaces/ioffer';
import { IOffers } from 'src/app/shared/interfaces/ioffers';
import { IPostPoint } from 'src/app/shared/interfaces/ipostpoint';
import { Mode } from 'src/app/shared/mode.enum';

@Component({
  selector: 'app-new-point',
  templateUrl: './new-point.component.html',
  styleUrls: ['./new-point.component.scss']
})
export class NewPointComponent implements OnInit {
  @Input() mode!: string;
  @Output() saveNewPoint = new EventEmitter();

  type = 'bus';
  types: IOffers[] = [];
  eventTypeToggle = false;
  city = 'Geneva';
  destinations: IDestination[]  = [];
  description = '';
  name = '';
  pictures: any = [];
  destination: any = {};
  price!: number;

  offers: IOffers[] = [];
  offersByEventType: any;
  offersByEvent: any;

  form!: FormGroup;

  date7!: Date;
  date_from: Date = new Date();
  date_to: Date = new Date();

  constructor(protected api: ApiService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      destination: new FormControl(this.city, Validators.required),
      startDateEvent: new FormControl(this.date_from, MyValidators.rectrictedStartEventDate(this.date_to)),
      endDateEvent: new FormControl(this.date_to, MyValidators.rectrictedEndEventDate(this.date_from)),
      price: new FormControl(this.price, [
        Validators.required,
        MyValidators.restrictedPrice
      ]),
    });

   this.getEventTypes();
   this.getOffers();
   this.getDestinations();
  }

  getOffers() {
    this.api.getOffers('offers').subscribe((data) => {
      this.offers = data as IOffers[];
      this.getOffersByType();
    })
  }

  getEventTypes() {
    this.api.getOffers('offers').subscribe((data) => {
      this.types = data as IOffers[];
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

  onChangeType(type: any) {
    this.eventTypeToggle = false;
    this.type = type;
    this.getOffersByType();
  }

  onChangedOffer(offer: any) {
    offer.isChecked = !offer.isChecked;
  }

  getDestinations() {
    this.api.getDestinations('destinations').subscribe((data) => {
      this.destinations = data;
      this.onChangedDestination({target: { value: this.city}})
    })
  }

  onChangedDestination(event: any) {
    const data = this.destinations.find((item) => item.name === event.target.value);
    this.description = (data?.description) as string;
    this.name = (data?.name) as string;
    this.destination = this.destinations.find((item) => item.name === event.target.value);
    this.getDestinationDescription();
    this.getDestinationPictures();
  }

  getDestinationPictures() {
    this.pictures = this.destination?.pictures;
  }

  getPictures() {
    const data = this.pictures.reduce((accum: any, elem: any) => {
      accum.push({
        description: elem.description,
        src: elem.src
      })
      return accum
    }, []);
    return data
  }

  getDestinationDescription() {
    this.description = this.destination?.description;
  }

  onChangedPrice(event: any) {
    this.price = event.target.value;
  }

  onSelectStartDateEvent(event: Date) {
    this.date_from = event;
  }

  onSelectEndDateEvent(event: Date) {
    this.date_to = event;
    //Для корректной валидации и обновления поля даты начала поездки
    this.form.get('startDateEvent')?.setValidators([MyValidators.rectrictedStartEventDate(this.date_to)]);
    this.form.get('startDateEvent')?.updateValueAndValidity();
  }

  onClickSave() {
    const offers = (this.offersByEventType as []).filter((item: IOffer) => item.isChecked).map((item: IOffer) => {
      const {
        price,
        title
      } = item;
      return {price, title}
    });

    const newPoint: IPostPoint = {
      id: null,
      base_price: +this.price,
      date_from: this.date_from.toISOString(),
      date_to: this.date_to.toISOString(),
      destination: {
        description: this.description,
        name: this.city,
        pictures: this.getPictures()
      },
      offers,
      type: this.type,
      is_favorite: false
    }

    this.api.postData('points', newPoint).subscribe((data) => {
      this.onSaveNewPoint();
    })

  }

  onSaveNewPoint() {
    this.saveNewPoint.emit({
      isDisabledButton: Boolean(false),
      mode: Mode.default,
      isTable: true
    })
  }

  onClickCancel() {
    this.saveNewPoint.emit({
      isDisabledButton: Boolean(false),
      mode: Mode.default,
      isTable: true
    })
  }

}

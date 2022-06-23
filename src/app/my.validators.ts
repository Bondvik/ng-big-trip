import { AbstractControl, FormControl } from "@angular/forms";

export class MyValidators {

  static restrictedPrice(control: FormControl): {[key: string]: boolean} | null {
    if (control.value <= 0) {
      return {
        'restrictedPrice': true
      }
    }
    return null
  }

  static rectrictedEndEventDate(startEventTime: Date) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value < startEventTime) {
        return {
          'restrictedEndEventDate': true
        }
      }
      return null
    }
  }

  static rectrictedStartEventDate(endEventTime: Date) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value > endEventTime) {
        return {
          'restrictedEndEventDate': true
        }
      }
      return null
    }
  }
}

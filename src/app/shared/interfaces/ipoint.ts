import { IDestination } from "./idestination"
import { IOffer } from "./ioffer"

export interface IPoint {
  base_price: number,
  date_from: Date,
  date_to: Date,
  destination: IDestination,
  id: string,
  is_favorite: boolean,
  offers: IOffer[],
  type: string
}

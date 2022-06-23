import { IOffer } from "./ioffer"

export interface IPostPoint {
  base_price: number,
  date_from: string,
  date_to: string,
  destination: {
    description: string,
    name: string,
    pictures: [{
      description: string,
      src: string
    }
    ]
  },
  offers: IOffer[],
  type: string,
  id: string | null,
  is_favorite: boolean
}

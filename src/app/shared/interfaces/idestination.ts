import { IPicture } from "./ipicture"

export interface IDestination {
  description: string,
  name: string,
  pictures?: IPicture[]
}

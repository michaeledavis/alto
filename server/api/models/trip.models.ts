import {Moment} from "moment";

export interface Money {
  currency: string,
  amount: number,
}

export interface FareEstimate {
  lowEstimate: Money,
  highEstimate: Money
}

export interface GpsCoordinates {
  latitude: number,
  longitude: number
}

export interface Location {
  shortName?: string,
  fullName: string[],
  coordinates: GpsCoordinates
}

export interface Driver {
  friendlyName: string,
  description: string
}

export interface Vehicle {
  id: string,
  imageURI?: string,
  makeAndModel?: string,
  color?: string,
  name?: string
}

export interface Vibe {
  name: string
}

export interface Trip {
  id: string,
  userId: string,
  estimatedArrival: Moment,
  requested: Moment,
  completed?: Moment,
  cancelled?: Moment,
  estimatedFare: FareEstimate,
  note: string,
  destination: Location,
  origin: Location,
  vehicle: Vehicle,
  driver: Driver,
  vibe: Vibe
}

import { IReserva } from "./Reservations";
export interface IReservationDetail {
    id: string;
    reservation: IReserva;
    checkIn: string;
    checkOut: string;
    pax: number;
    property: string; 
  }
  
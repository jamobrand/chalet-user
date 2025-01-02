export interface BookingParams {
    checkIn: Date;
    checkOut: Date;
    adults: number;
    children: number;
    type: "Chalet";
  }
  
  export interface DateRange {
    checkIn: Date;
    checkOut: Date;
  }
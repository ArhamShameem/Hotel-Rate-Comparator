export interface HotelSearchInput {
  city: string;
  checkIn: string;
  checkOut: string;

  supplierABehavior?: SupplierBehavior;
  supplierBBehavior?: SupplierBehavior;
  supplierCBehavior?: SupplierBehavior;
  supplierDBehavior?: SupplierBehavior;
}

export type SupplierBehavior =
  | "normal"
  | "delay"
  | "timeout"
  | "empty"
  | "error"
  | "fail-twice";

export interface Hotel {
  hotelId: string;
  name: string;
  price: number;
}

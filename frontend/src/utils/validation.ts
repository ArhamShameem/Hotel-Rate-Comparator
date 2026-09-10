export interface ValidationErrors {
  city?: string;
  checkIn?: string;
  checkOut?: string;
}

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getMinCheckOutDate(checkIn: string): string {
  if (!checkIn) {
    return getTodayDateString();
  }
  const date = new Date(checkIn);
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function validateSearchForm(
  city: string,
  checkIn: string,
  checkOut: string
): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};

  const trimmedCity = city.trim();
  if (!trimmedCity) {
    errors.city = "City is required";
  }

  if (!checkIn) {
    errors.checkIn = "Check-in date is required";
  }

  if (!checkOut) {
    errors.checkOut = "Check-out date is required";
  } else if (checkIn) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) {
      errors.checkOut = "Check-out must be after check-in";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

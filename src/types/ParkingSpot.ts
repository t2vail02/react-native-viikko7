export interface ParkingSpot {
  carParkId: number;
  name: string;
  lat: number;
  lon: number;
  spacesAvailable: number;
  maxCapacity?: number;
}
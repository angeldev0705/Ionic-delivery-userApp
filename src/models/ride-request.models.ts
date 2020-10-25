export class CreateRideRequest {
    vehicle_type_id: number;
    ride_on: string;
    address_from: string;
    latitude_from: string;
    longitude_from: string;
    address_to: string;
    latitude_to: string;
    longitude_to: string;
    payment_method: string;
}
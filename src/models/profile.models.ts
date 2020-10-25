import { User } from "./user.models";

export class Profile {
    id: number;
    user_id: number;
    vehicle_type_id: number;
    document_url: string;
    vehicle_details: string;
    vehicle_details_array: Array<string>;
    license_url: string;
    current_latitude: string;
    current_longitude: string;
    user: User;
}
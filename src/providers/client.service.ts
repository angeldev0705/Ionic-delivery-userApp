import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { APP_CONFIG, AppConfig } from "../app/app.config";
import { Setting } from '../models/setting.models';
import { BaseListResponse } from '../models/base-list.models';
import { Country } from '../models/country.models';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';
import { AuthResponse } from '../models/auth-response.models';
import { SignUpRequest } from '../models/signup-request.models';
import { User } from '../models/user.models';
import { VehicleType } from '../models/vehicle-type.models';
import { CreateRideRequest } from '../models/ride-request.models';
import { Ride } from '../models/ride.models';
import { Helper } from '../models/helper.models';
import { SupportRequest } from '../models/support-request.models';
import { RateRequest } from '../models/rate-request.models';
import { Faq } from '../models/faq.models';
import { BankDetail } from '../models/bank-detail.models';
import { WalletResponse } from '../models/wallet-response.models';
import { MyLocation } from '../models/my-location.models';
import { Driver } from '../models/driver.models';

@Injectable()
export class ClientService {
    constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: HttpClient) {

    }

    public getCountries(): Observable<Array<Country>> {
        return this.http.get<Array<Country>>('./assets/json/countries.json').concatMap((data) => {
            return Observable.of(data);
        });
    }

    public logActivity(token: string): Observable<{}> {
        const myHeaders = (token && token.length) ? new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }) : new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.post<{}>(this.config.apiBase + 'api/activity-log', {}, { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public getSettings(): Observable<Array<Setting>> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.get<Array<Setting>>(this.config.apiBase + "api/settings", { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public vehicleTypes(locFrom: MyLocation, locTo: MyLocation): Observable<{ vehicle_types: Array<VehicleType>, fares: Array<{ vehicle_type_id: number, estimated_fare: number }> }> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        let urlParams = new URLSearchParams();
        urlParams.append("latitude_from", locFrom.lat);
        urlParams.append("longitude_from", locFrom.lng);
        urlParams.append("latitude_to", locTo.lat);
        urlParams.append("longitude_to", locTo.lng);
        return this.http.get<{ vehicle_types: Array<VehicleType>, fares: Array<{ vehicle_type_id: number, estimated_fare: number }> }>(this.config.apiBase + "api/driver/vehicle-type?" + urlParams.toString(), { headers: myHeaders }).concatMap(data => {
            for (let vt of data.vehicle_types) {
                for (let fare of data.fares) {
                    if (fare.vehicle_type_id == vt.id) {
                        vt.estimated_fare = fare.estimated_fare;
                        break;
                    }
                }
            }
            return Observable.of(data);
        });
    }

    public nearbyDrivers(token: string, vhType: number, locFrom: MyLocation): Observable<Array<Driver>> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        let urlParams = new URLSearchParams();
        urlParams.append("vehicle_type_id", String(vhType));
        urlParams.append("latitude_from", locFrom.lat);
        urlParams.append("longitude_from", locFrom.lng);
        return this.http.get<Array<Driver>>(this.config.apiBase + "api/customer/drivers/nearby?" + urlParams.toString(), { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public verifyMobile(verifyRequest: any): Observable<AuthResponse> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.post<AuthResponse>(this.config.apiBase + "api/verify-mobile", JSON.stringify(verifyRequest), { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public checkUser(checkUserRequest: any): Observable<{}> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.post<{}>(this.config.apiBase + "api/check-user", JSON.stringify(checkUserRequest), { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public login(loginTokenRequest: any): Observable<AuthResponse> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.post<AuthResponse>(this.config.apiBase + "api/login", JSON.stringify(loginTokenRequest), { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public signUp(signUpRequest: SignUpRequest): Observable<AuthResponse> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.post<AuthResponse>(this.config.apiBase + "api/register", JSON.stringify(signUpRequest), { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    // public profile(token: string): Observable<Profile> {
    //     const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    //     return this.http.get<Profile>(this.config.apiBase + "api/driver/profile", { headers: myHeaders }).concatMap(data => {
    //         if (data.vehicle_details && data.vehicle_details.length)
    //             data.vehicle_details_array = data.vehicle_details.split("|");
    //         return Observable.of(data);
    //     });
    // }

    public walletHistory(token, pageNo): Observable<BaseListResponse> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get<BaseListResponse>(this.config.apiBase + "api/wallet/transactions?page=" + pageNo, { headers: myHeaders }).concatMap(data => {
            for (let wh of data.data) {
                if (wh.ride) {
                    wh.ride.created_at = Helper.formatTimestampDateTime(wh.ride.created_at);
                    wh.ride.updated_at = Helper.formatTimestampDateTime(wh.ride.updated_at);
                    if (wh.ride.estimated_fare) wh.ride.estimated_fare = Number(wh.ride.estimated_fare.toFixed(2));
                    if (wh.ride.final_fare) wh.ride.final_fare = Number(wh.ride.final_fare.toFixed(2));
                    if (wh.ride.estimated_distance) wh.ride.estimated_distance = Number(Number(wh.ride.estimated_distance).toFixed(1));
                    //if (r.estimated_time) r.estimated_time = Number(Number(r.estimated_time / 60).toFixed(1));
                    if (!wh.ride.driver.user.ratings) wh.ride.driver.user.ratings = 0;
                    wh.ride.driver.user.ratings = Number(Number(wh.ride.driver.user.ratings).toFixed(1));
                    if (wh.ride.driver.vehicle_details && wh.ride.driver.vehicle_details.length)
                        wh.ride.driver.vehicle_details_array = wh.ride.driver.vehicle_details.split("|");
                    let rating = window.localStorage.getItem("rate" + wh.ride.id);
                    wh.ride.myRating = rating ? Number(rating) : -1;
                }
                wh.amount = Number(wh.amount.toFixed(0));
                wh.created_at = Helper.formatTimestampDateTime(wh.created_at);
                wh.updated_at = Helper.formatTimestampTime(wh.updated_at);
            }
            return Observable.of(data);
        });
    }

    public faqs(): Observable<Array<Faq>> {
        const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
        return this.http.get<Array<Faq>>(this.config.apiBase + 'api/faq-help', { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public referralRefer(token: string, code: string): Observable<{}> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.post<{}>(this.config.apiBase + "api/user/refer", { "code": code }, { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public rateUser(token: string, uId: number, rateRequest: RateRequest): Observable<{}> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.post<{}>(this.config.apiBase + "api/user/ratings/" + uId, JSON.stringify(rateRequest), { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public getUser(token: string): Observable<User> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get<User>(this.config.apiBase + "api/user", { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public updateUser(token: string, requestBody: any): Observable<User> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.put<User>(this.config.apiBase + "api/user", requestBody, { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public createRide(token: string, requestBody: CreateRideRequest): Observable<Ride> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.post<Ride>(this.config.apiBase + "api/customer/ride", requestBody, { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public rideCancel(token: string, apId: number): Observable<Ride> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.post<Ride>(this.config.apiBase + "api/customer/ride/" + apId + '/cancel', {}, { headers: myHeaders }).concatMap(ap => {
            return Observable.of(ap);
        });
    }

    public myRides(token: string, pageNo: number): Observable<BaseListResponse> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get<BaseListResponse>(this.config.apiBase + "api/customer/ride?page=" + pageNo, { headers: myHeaders }).concatMap(data => {
            for (let r of data.data) {
                r.created_at = Helper.formatTimestampDateTime(r.created_at);
                r.updated_at = Helper.formatTimestampDateTime(r.updated_at);
                if (r.estimated_fare) r.estimated_fare = Number(r.estimated_fare.toFixed(2));
                if (r.final_fare) r.final_fare = Number(r.final_fare.toFixed(2));
                if (r.estimated_distance) r.estimated_distance = Number(Number(r.estimated_distance).toFixed(1));
                //if (r.estimated_time) r.estimated_time = Number(Number(r.estimated_time / 60).toFixed(1));
                if (!r.driver.user.ratings) r.driver.user.ratings = 0;
                r.driver.user.ratings = Number(Number(r.driver.user.ratings).toFixed(1));
                if (r.driver.vehicle_details && r.driver.vehicle_details.length)
                    r.driver.vehicle_details_array = r.driver.vehicle_details.split("|");
                let rating = window.localStorage.getItem("rate" + r.id);
                r.myRating = rating ? Number(rating) : -1;
            }
            return Observable.of(data);
        });
    }

    public contactUs(adminToken: string, obj): Observable<SupportRequest> {
        const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + adminToken });
        return this.http.post<SupportRequest>(this.config.apiBase + 'api/support', obj, { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public walletBalance(token): Observable<WalletResponse> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get<WalletResponse>(this.config.apiBase + "api/wallet/check-balance", { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public bankDetailUpdate(token, bankDetailUpdateRequest): Observable<BankDetail> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.post<BankDetail>(this.config.apiBase + "api/bank-detail", JSON.stringify(bankDetailUpdateRequest), { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public bankDetail(token): Observable<BankDetail> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get<BankDetail>(this.config.apiBase + "api/bank-detail", { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public walletWithdraw(token, amount): Observable<WalletResponse> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.post<WalletResponse>(this.config.apiBase + "api/wallet/withdraw", JSON.stringify({ "amount": amount }), { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public walletRecharge(token, amount, stripeToken): Observable<WalletResponse> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.post<WalletResponse>(this.config.apiBase + "api/wallet/recharge", JSON.stringify({ "token": stripeToken, "amount": amount }), { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }
    
    public getWhatsappDetails() {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.get('https://dashboard.vtlabs.dev/whatsapp.php?product_name=q-cabs', { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }
}
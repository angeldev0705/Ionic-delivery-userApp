import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Trip_infoPage } from '../trip_info/trip_info';
import { ClientService } from '../../providers/client.service';
import { CommonUiElement } from '../../providers/app.commonelements';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { Constants } from '../../models/constants.models';
import { Ride } from '../../models/ride.models';
import { Helper } from '../../models/helper.models';
import { Rate_ridePage } from '../rate_ride/rate_ride';

@Component({
  selector: 'page-my_trips',
  templateUrl: 'my_trips.html',
  providers: [ClientService, CommonUiElement]
})
export class My_tripsPage {
  private subscriptions: Array<Subscription> = [];
  private rides = new Array<Ride>();
  private doneAll = false;
  private isLoading = true;
  private pageNo = 1;
  private infiniteScroll: any;
  private currency: string;

  constructor(private navCtrl: NavController, private service: ClientService,
    private cue: CommonUiElement, private translate: TranslateService) {
    this.currency = Helper.getSetting("currency");
    this.translate.get("rides_loading").subscribe(value => {
      this.cue.presentLoading(value);
      this.loadRides();
    });
  }

  ionViewWillLeave() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.cue.dismissLoading();
  }

  ionViewDidEnter() {
    let ratecheckId = window.localStorage.getItem("ratecheck");
    if (ratecheckId) {
      let index = -1;
      for (let i = 0; i < this.rides.length; i++) {
        if (Number(ratecheckId) == this.rides[i].id) {
          index = i;
          break;
        }
      }
      if (index != -1) {
        let rating = window.localStorage.getItem("rate" + this.rides[index].id);
        this.rides[index].myRating = rating ? Number(rating) : -1;
      }
    }
    window.localStorage.removeItem("ratecheck");
  }

  loadRides() {
    this.isLoading = true;
    this.subscriptions.push(this.service.myRides(window.localStorage.getItem(Constants.KEY_TOKEN), this.pageNo).subscribe(res => {
      this.rides = this.rides.concat(res.data);
      this.isLoading = false;
      this.doneAll = (!res.data || !res.data.length);
      if (this.infiniteScroll) {
        this.infiniteScroll.complete();
      }
      this.cue.dismissLoading();
    }, err => {
      this.isLoading = false;
      if (this.infiniteScroll) {
        this.infiniteScroll.complete();
      }
      this.cue.dismissLoading();
      console.log('myRides', err);
    }));
  }

  doInfinite(infiniteScroll: any) {
    if (this.doneAll) {
      infiniteScroll.complete();
    } else {
      this.infiniteScroll = infiniteScroll;
      this.pageNo = this.pageNo + 1;
      this.loadRides();
    }
  }

  tripInfo(ride) {
    this.navCtrl.push(Trip_infoPage, { ride: ride });
  }

  rateRider(ride) {
    this.navCtrl.push(Rate_ridePage, { ride: ride });
  }

}

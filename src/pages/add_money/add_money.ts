import { Component } from '@angular/core';
import { Helper } from '../../models/helper.models';
import { CardInfo } from '../../models/card-info.models';
import { TranslateService } from '@ngx-translate/core';
import { CommonUiElement } from '../../providers/app.commonelements';
import { Constants } from '../../models/constants.models';
import { Subscription } from 'rxjs/Subscription';
import { ClientService } from '../../providers/client.service';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-add_money',
  templateUrl: 'add_money.html',
  providers: [CommonUiElement, ClientService]
})
export class Add_moneyPage {
  private currency: string;
  private cardInfo = new CardInfo();
  private loadingShown: Boolean = false;
  private amount: number;
  private subscriptions: Array<Subscription> = [];

  constructor(private translate: TranslateService, private cue: CommonUiElement,
    private service: ClientService, private navCtrl: NavController) {
    this.currency = Helper.getSetting("currency");
    let savedCardInfo = JSON.parse(window.localStorage.getItem(Constants.KEY_CARD_INFO));
    if (savedCardInfo) {
      this.cardInfo.name = savedCardInfo.name;
      this.cardInfo.number = savedCardInfo.number;
      this.cardInfo.expMonth = savedCardInfo.expMonth;
      this.cardInfo.expYear = savedCardInfo.expYear;
    }
  }

  confirm() {
    if (this.amount && this.amount > 0) {
      // if (this.cardInfo.areFieldsFilled()) {
      //   // this.translate.get('verifying_card').subscribe(text => {
      //   //   this.presentLoading(text);
      //   // });
      //   // this.stripe.setPublishableKey(this.config.stripeKey);
      //   // this.stripe.createCardToken(this.cardInfo as StripeCardTokenParams).then(token => {
      //   //   this.dismissLoading();
      //   //   window.localStorage.setItem(Constants.KEY_CARD_INFO, JSON.stringify(this.cardInfo));
      //   //   this.addMoney(token.id);
      //   // }).catch(error => {
      //   //   this.dismissLoading();
      //   //   this.presentErrorAlert(error);
      //   //   this.translate.get('invalid_card').subscribe(text => {
      //   //     this.showToast(text);
      //   //   });
      //   //   console.error(error);
      //   // });

      //   this.translate.get('verifying_card').subscribe(text => {
      //     this.cue.presentLoading(text);
      //     this.addMoney("fakeId");
      //   });
      // } else {
      //   this.translate.get('fill_valid_card').subscribe(text => {
      //     this.cue.showToast(text);
      //   });
      // }
      this.translate.get('just_moment').subscribe(text => {
        this.cue.presentLoading(text);
        this.addMoney("fakeId");
      });
    } else {
      this.translate.get('fill_valid_amount').subscribe(text => {
        this.cue.showToast(text);
      });
    }
  }

  addMoney(stripeToken) {
    this.subscriptions.push(this.service.walletRecharge(window.localStorage.getItem(Constants.KEY_TOKEN), this.amount, stripeToken).subscribe(res => {
      this.cue.dismissLoading();
      this.translate.get(res && res.status ? 'amount_add_success' : 'something_went_wrong').subscribe(text => this.cue.showToast(text));
      this.navCtrl.pop();
    }, err => {
      this.translate.get('something_went_wrong').subscribe(text => this.cue.showToast(text));
      console.log('walletRecharge', err);
      this.cue.dismissLoading();
      this.navCtrl.pop();
    }));
  }

  ionViewWillLeave() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.cue.dismissLoading();
  }

}

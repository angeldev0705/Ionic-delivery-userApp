import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MyApp } from './app.component';
import { Add_moneyPage } from '../pages/add_money/add_money';
import { Contact_usPage } from '../pages/contact_us/contact_us';
import { HelpPage } from '../pages/help/help';
import { My_profilePage } from '../pages/my_profile/my_profile';
import { My_tripsPage } from '../pages/my_trips/my_trips';
import { Promo_codePage } from '../pages/promo_code/promo_code';
import { Rate_ridePage } from '../pages/rate_ride/rate_ride';
import { Ride_infoPage } from '../pages/ride_info/ride_info';
import { Trip_infoPage } from '../pages/trip_info/trip_info';
import { SearchPage } from '../pages/search/search';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { VerificationPage } from '../pages/verification/verification';
import { WalletPage } from '../pages/wallet/wallet';
import { ManagelanguagePage } from '../pages/managelanguage/managelanguage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { File } from '@ionic-native/file';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { GoogleMaps } from '../providers/google-maps';
import { Connectivity } from '../providers/connectivity-service';
import { CallNumber } from '@ionic-native/call-number';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BaseAppConfig, APP_CONFIG } from './app.config';
import { BankTransfer } from '../pages/banktransfer/banktransfer';
import { InAppBrowser } from '@ionic-native/in-app-browser';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    MyApp,
    Add_moneyPage,
    Contact_usPage,
    HelpPage,
    My_profilePage,
    My_tripsPage,
    Promo_codePage,
    Rate_ridePage,
    Ride_infoPage,
    Trip_infoPage,
    SearchPage,
    SigninPage,
    SignupPage,
    VerificationPage,
    WalletPage,
    ManagelanguagePage,
    BankTransfer
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Add_moneyPage,
    Contact_usPage,
    HelpPage,
    My_profilePage,
    My_tripsPage,
    Promo_codePage,
    Rate_ridePage,
    Ride_infoPage,
    Trip_infoPage,
    SearchPage,
    SigninPage,
    SignupPage,
    VerificationPage,
    WalletPage,
    ManagelanguagePage,
    BankTransfer
  ],
  providers: [
    StatusBar,
    SplashScreen,
    OneSignal,
    Network,
    Geolocation,
    File,
    ImagePicker,
    Crop,
    GoogleMaps,
    Connectivity,
    CallNumber,
    Clipboard,
    SocialSharing, InAppBrowser,
    { provide: APP_CONFIG, useValue: BaseAppConfig },
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }

import {NgModule, Provider} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TripInfoComponent } from './components/trip-info/trip-info.component';
import { PageNavigationComponent } from './components/page-navigation/page-navigation.component';
import { ListFilterComponent } from './components/list-filter/list-filter.component';
import { AddNewPointComponent } from './components/add-new-point/add-new-point.component';
import { ListSortComponent } from './components/list-sort/list-sort.component';
import { ListComponent } from './components/list/list.component';
import { PointComponent } from './components/point/point.component';
import { StatsComponent } from './components/stats/stats.component';
import { ListEmptyComponent } from './components/list-empty/list-empty.component';
import { LoadingComponent } from './components/loading/loading.component';
import { NewPointComponent } from './components/new-point/new-point.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {AuthInterceptor} from "./services/auth.interceptor";

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
}

@NgModule({
  declarations: [
    AppComponent,
    TripInfoComponent,
    PageNavigationComponent,
    ListFilterComponent,
    AddNewPointComponent,
    ListSortComponent,
    ListComponent,
    PointComponent,
    StatsComponent,
    ListEmptyComponent,
    LoadingComponent,
    NewPointComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    MessagesModule,
    MessageModule,
    NgChartsModule,
    AppRoutingModule
  ],
  providers: [INTERCEPTOR_PROVIDER],
  bootstrap: [AppComponent]
})
export class AppModule { }

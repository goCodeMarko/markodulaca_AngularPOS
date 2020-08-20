import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { FlashMessagesModule } from "angular2-flash-messages";
import { ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { routedComponents } from "./app-routing.module";
import { NavbarComponent } from './components/navbar/navbar.component';

import { BasicGuard } from "./guards/basic.guard";
import { HigherGuard } from "./guards/higher.guard";

@NgModule({
  declarations: [
    AppComponent,
    routedComponents,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    NgbModule,
    FlashMessagesModule.forRoot()
  ],
  providers: [BasicGuard, HigherGuard, NgbActiveModal],
  bootstrap: [AppComponent]
})
export class AppModule { }

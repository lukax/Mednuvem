import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MaterialModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {routing, RootComponent} from './routes';

import {TechsModule} from './techs';

import {MainComponent} from './main';
import {HeaderComponent} from './header';
import {TitleComponent} from './title';
import {FooterComponent} from './footer';

@NgModule({
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    
    TechsModule,
  ],
  declarations: [
    RootComponent,
    MainComponent,
    HeaderComponent,
    TitleComponent,
    FooterComponent
  ],
  bootstrap: [RootComponent]
})
export class AppModule {}

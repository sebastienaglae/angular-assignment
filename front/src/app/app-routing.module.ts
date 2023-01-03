import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  /*

  * README IMPORTANT

  * WE ARE USING THE ROUTER BUT IT IS NOT LOAD HERE

  * IT IS LOADED IN THE APP.MODULE.TS->APP_INITIALIZER BY THE CONFIG SERVICE

  * BY USING THE FACTORY METHOD WE CAN LOAD THE ROUTER AFTER THE CONFIG SERVICE HAS LOADED THE CONFIG

  */
  imports: [BrowserModule, RouterModule.forRoot([])],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WhiteboardComponent } from './whiteboard/whiteboard.component';
import { NgWhiteboardModule } from 'ng-whiteboard';

@NgModule({
  declarations: [
    AppComponent,
    WhiteboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgWhiteboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

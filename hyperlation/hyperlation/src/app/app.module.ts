import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WaveformComponent } from './waveform/waveform.component';
import { NgWaveformModule } from 'ng-waveform';
import { DrawingComponent } from './drawing/drawing.component';
import { DrawingTableComponent } from './drawing-table/drawing-table.component';
import { BackendService } from './shared/backend.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    WaveformComponent,
    DrawingComponent,
    DrawingTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgWaveformModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [BackendService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ITimeUpdateEvent, NgWaveformComponent, IRegionPositions } from 'ng-waveform';
import { map } from 'rxjs/operators'; 
import { DrawingTableComponent } from '../drawing-table/drawing-table.component';
import { BackendService } from '../shared/backend.service';

@Component({
  selector: 'app-waveform',
  templateUrl: './waveform.component.html',
  styleUrls: ['./waveform.component.scss']
})
export class WaveformComponent implements OnInit {
  @ViewChild('waveform', { static: false }) waveform: NgWaveformComponent;
  @ViewChild(DrawingTableComponent ) drawingTable: DrawingTableComponent ; 

  play = false;
  isLoaded = false;
  trackLoadTime: number;
  renderingTime: number;
  duration: number;
  currentTime: ITimeUpdateEvent;
  regionPositions: IRegionPositions;

  srcForm: FormGroup;
  isSrcError = false;
  isAudioQueried = false;

  isRegionCtrl = new FormControl(true);
  regionStartCtrl = new FormControl(0);
  regionEndCtrl = new FormControl(0);

  useRegion = true;
  src: string;

  width:number = 256;
  height:number = 256;

  timer:any=null;
  brushSize=15;

  mfccImage: any;
  isImageLoading=false;

  audioFile:File;

  frs:number[]=[12,24,30,60,120]
  fr:number=24;
  srs:number[]=[2400,4800,8000,16000,22050]
  sr:number=2400;
  ns:number[]=[12,15,20,26,30,60]
  n:number=12;
  constructor(private http: HttpClient, protected backendService: BackendService) { }

  ngOnInit() {
    this.srcForm = new FormGroup({src: new FormControl()});
    this.srcForm.valueChanges.subscribe(() => this.isSrcError = false);
    this.isRegionCtrl.valueChanges.subscribe(value => this.useRegion = value);
    this.regionStartCtrl.valueChanges.subscribe(value => {
      if (!this.waveform) {
        return;
      }
      this.waveform.setRegionStart(value);
    });
    this.regionEndCtrl.valueChanges.subscribe(value => {
      if (!this.waveform) {
        return;
      }
      this.waveform.setRegionEnd(value);
    });

  }
  onPlayButtonClick() {
    this.waveform.play();
    this.play = true;
    this.playRec();
  }

  onPauseButtonClick() {
    this.waveform.pause();
    this.play = false;
    this.stopVideo();
  }

  onGoToStartButtonClick(){    
  }

  onTrackLoaded(time: number) {
    this.trackLoadTime = time;
  }

  onTrackRendered(time: number) {
    this.renderingTime = time;
    this.isLoaded = true;
  }

  onDurationChange(duration: number) {
    this.duration = duration;
  }

  onTimeUpdate(event: ITimeUpdateEvent) {
    this.currentTime = event;
  }

  onPaused() {
    this.play = false;
  }

  onRegionChange(region: IRegionPositions) {
    this.regionPositions = region;
    this.regionStartCtrl.setValue(this.regionPositions.start);
    this.regionEndCtrl.setValue(this.regionPositions.end);
  }

  handleFileInput(target: any) {
    let files = target.files;
    if(files.length>0){
      this.audioFile=files.item(0);
      var file = URL.createObjectURL(this.audioFile); 
      this.src = file;
      this.isAudioQueried = true;
      this.mfccImage=null;
    }    
  }

  addKeyframe(){
    var index = this.drawingTable.drawings.findIndex(x => x.progress==this.currentTime?.progress ); 
    if (index ===-1){
      this.drawingTable.addDrawing(this.currentTime)
    }else{
      alert("KeyFrame already exists!")
    }    
  }

  playRec(){
    let time = (this.drawingTable.drawings[0].progress-this.currentTime?.progress)*this.duration*10
    this.timer = setTimeout(this.func(0), time); 
  }

  func(i:number){    
    const canvas = <HTMLCanvasElement> document.getElementById('playerCanvas');
    var ctxm = canvas.getContext("2d")!;    
    var drawing = this.drawingTable.drawings[i];
    return () =>{
      if (i >= this.drawingTable.drawings.length) return;
      if(this.play) {
        ctxm.putImageData(drawing.data, 0, 0);  
      }
      if(!this.play) {
          console.log('Player won');
      } else {
          ++i;
          drawing = this.drawingTable.drawings[i];
          if(drawing && this.play){
            let time = (drawing.progress-this.currentTime?.progress)*this.duration*10            
            this.timer = setTimeout(this.func(i), time); 
          }
      }

    }   
  }

  stopVideo(){
    clearTimeout(this.timer);
    this.timer=null;
  }

  setSize(s:number){
    this.brushSize=s;
    this.drawingTable.setBrushSize(s);
  }

  getMFCC(){
    this.isImageLoading = true;
    let params = new HttpParams()
      .set('filename', this.audioFile.name)
      .set('sr',this.sr)
      .set('n',this.n)
      .set('fr',this.fr);    
    this.backendService.getMFCC(this.audioFile,params).subscribe(response => {
      this.createImageFromBlob(response);
      this.isImageLoading = false;
    },
      err => {
        this.isImageLoading = false;
        console.log(err);
      });
  }


  createImageFromBlob(image: Blob) {
     let reader = new FileReader();
     reader.addEventListener("load", () => {
        this.mfccImage = reader.result;
     }, false);
  
     if (image) {
        reader.readAsDataURL(image);
     }
  }
  
}

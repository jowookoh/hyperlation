import {  Component, Input,Output,EventEmitter, ElementRef, AfterViewInit, ViewChild, OnInit} from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'
import { Drawing } from './drawing.model';


@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss']
})
export class DrawingComponent implements OnInit, AfterViewInit {

  ngOnInit(): void {
  }

  @Input() drawing:Drawing;
  @Input() size:number;

  @ViewChild('canvas') public canvas: ElementRef;

  @Input() public width = 256;
  @Input() public height = 256;

  private cx: CanvasRenderingContext2D;

  @Output() deleteEvent = new EventEmitter<number>();
  @Output() updateDrawingEvent = new EventEmitter<Drawing>();
  @Output() leftEvent = new EventEmitter<number>();
  @Output() rightEvent = new EventEmitter<number>();

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d')!;

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 15;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.captureEvents(canvasEl);
    this.setSize(this.size);
  }
  
  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event    
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point    
              pairwise()
            )
        })
      )
      .subscribe((res:any) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
    this.drawing.data=this.cx.getImageData(0,0,this.width,this.height);
    this.updateDrawingEvent.emit(this.drawing);
  }

  clear(){
    this.cx.clearRect(0, 0, this.width, this.height);
  }

  setSize(s: number){
    this.cx.lineWidth=s;
  }

  save(){
    this.cx.save();
  }

  delete(){
      this.deleteEvent.emit(this.drawing.id);
  }

  left(){
    this.leftEvent.emit(this.drawing.id);
  }
  right(){
    this.rightEvent.emit(this.drawing.id);
  }

}

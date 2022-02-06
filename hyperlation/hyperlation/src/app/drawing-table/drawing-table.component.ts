import { Component, OnInit, ViewChildren,Input } from '@angular/core';
import { DrawingComponent } from '../drawing/drawing.component';
import { Drawing } from '../drawing/drawing.model';

@Component({
  selector: 'app-drawing-table',
  templateUrl: './drawing-table.component.html',
  styleUrls: ['./drawing-table.component.scss']
})
export class DrawingTableComponent implements OnInit {

  @ViewChildren(DrawingComponent ) drawingComponents: DrawingComponent[] ; 
  constructor() { }

  drawings: Drawing[]=[];

  @Input() size:number;

  ngOnInit(): void {    
  }

  sortDrawings(){
    this.drawings.sort((a,b)=>a.progress-b.progress)
    let c=1
    this.drawings.forEach(element => {
      element.order=c;
      c++;
    });
  }

  addDrawing(time:any){
    let drawing= new Drawing();
    drawing.id=this.drawings.length+1;
    drawing.progress=Number(time.progress.toFixed(2));
    drawing.time=Number(time.time.toFixed(2));
    this.drawings.push(drawing);
    this.sortDrawings();
  }

  deleteDrawing(id:number){
    this.drawings = this.drawings.filter(item => item.id !== id);
    this.sortDrawings();
  }

  updateDrawing(drawing:Drawing){
    var foundIndex = this.drawings.findIndex(x => x.id == drawing.id);
    this.drawings[foundIndex] = drawing;
  }

  leftEvent(id:number){
    var foundIndex = this.drawings.findIndex(x => x.id == id);
    this.drawings[foundIndex].progress-=0.25;
    this.sortDrawings();
  }

  rightEvent(id:number){
    var foundIndex = this.drawings.findIndex(x => x.id == id);
    this.drawings[foundIndex].progress+=0.25;
    this.sortDrawings();
  }

  setBrushSize(s:number){
    this.drawingComponents.forEach(drawingComponent => {
      drawingComponent.setSize(s);
    });
  }

}

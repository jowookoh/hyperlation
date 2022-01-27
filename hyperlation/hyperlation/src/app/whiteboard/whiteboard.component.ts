import { Component, OnInit } from '@angular/core';
import { NgWhiteboardService, FormatType } from 'ng-whiteboard';

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent implements OnInit {

  size:number = 20; 

  constructor(private whiteboardService: NgWhiteboardService) {
    this.whiteboardService.save(FormatType.Base64);
   }

  ngOnInit(): void {

    this.size=15;
  }

  erase(){
    this.whiteboardService.erase()
  }

  setSize(s: number){
    this.size=s;
  }

  save(){
    this.whiteboardService.save(FormatType.Base64);
  }

}







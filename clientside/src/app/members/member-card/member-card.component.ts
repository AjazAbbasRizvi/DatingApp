import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_model/member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member : Member | undefined;

  constructor(){

  }


  ngOnInit(){
    console.log(this.member);
  }

}

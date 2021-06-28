import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/_models/message';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { MessageSerice } from 'src/app/_services/message.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {

  @Input() recipientId: number;
  @ViewChild('messageForm') messageForm: NgForm; 
  // @Input() username : string;
  @Input() messages: Message[];
  newMessage: any = {};
  messageContent : string;
  
  constructor(private messageService: MessageSerice, private authService: AuthService, private alertfy: AlertifyService) { }

  ngOnInit() {
    // this.loadMessages();
  }
  // loadMessages(){
  //   this.messageService.getMessageThread(this.authService.decodedToken.nameid, this.recipientId)
  //   .subscribe( (messages: Message[]) => {
  //       this.messages = messages;`
  //      }, error => { this.alertfy.error(error)});
  // }
  sendMessage(){
    // this.newMessage.recipientId = this.recipientId;
    this.messageService.sendMessage(this.authService.decodedToken.nameid,this.recipientId,this.messageContent)
    .subscribe((message : Message) => { 
      this.messages.push(message);
      this.messageForm.reset();
    },error =>{
      this.alertfy.error(error);
    });
  }
}

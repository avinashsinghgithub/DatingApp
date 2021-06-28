import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { PaginatedResult, Pagination } from '../_models/Pagination';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { MessageSerice } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';
  constructor(private messageService: MessageSerice,
              private authService: AuthService, private route: ActivatedRoute, private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
  }
 loadMessages() {
   this.messageService.getMessages(this.authService.decodedToken.nameid, this.pagination.currentPage,
    this.pagination.itemsPerPage, this.messageContainer).subscribe((res: PaginatedResult<Message[]>) => {
        this.messages = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
 }
 pageChanged(event: any): void{
  this.pagination.currentPage = event.page;
  this.loadMessages();
}
}


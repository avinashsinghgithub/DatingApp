import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { MessageSerice } from 'src/app/_services/message.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
// import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import {NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {NgxGalleryImage} from '@kolkov/ngx-gallery';
import {NgxGalleryAnimation} from '@kolkov/ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { Message } from 'src/app/_models/message';
import { AuthService } from 'src/app/_services/auth.service';
@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs',{static : true}) memberTabs: TabsetComponent ;
  user: User;
  messages : Message[];
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  constructor(private messageService: MessageSerice, private alertify: AlertifyService,private authService: AuthService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
    this.loadMessages();
    this.route.queryParams.subscribe(params => {
      let selectedTab = params['tab'];
      this.memberTabs.tabs[selectedTab>0? selectedTab: 0 ].active = true;
    });
    this.galleryOptions = [
      {
      width: '500px',
      height: '500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false

    } ,
    {
      breakpoint: 800,
      width: '100%',
      height: '600px',
      imagePercent: 80,
      thumbnailsPercent: 20,
      thumbnailsMargin: 20,
      thumbnailMargin: 20
    },
    // max-width 400
    {
      breakpoint: 400,
      preview: false
    }];
    this.galleryImages = this.getImages();
  }
  getImages() {
    const imageUrls = [];
    for (const photo of this.user.photos)  {
      imageUrls.push({
        small : photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description
      });
    }
    return imageUrls;
  }
  selectTab (tabId : number){
    this.memberTabs.tabs[tabId].active = true;
  }
  loadMessages(){
    this.messageService.getMessageThread(this.authService.decodedToken.nameid, this.user.id)
    .subscribe( (messages: Message[]) => {
        this.messages = messages;
       }, error => { this.alertify.error(error)});
  }
  // loadUser(){
  //   this.userService.getUser(+this.route.snapshot.params['id']).subscribe((user: User) => {
  //     this.user = user;
  //   }, error => {
  //     this.alertify.error(error);
  //   });
  // }
}

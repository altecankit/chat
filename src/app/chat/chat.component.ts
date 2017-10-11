import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import {MyServiceService} from '../my-service.service';
import * as io from 'socket.io-client';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked  {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  chats = [];
  currActiveName = 'Select someone to chat with';
  currActiveUser:any;
  socket;
  msg = {
    msgFrom : '' ,
    msgFromEmail : '' ,
    msgTo : '',
    msg : '',
    room: '',
    createdOn:''
  }
  availableUsers=[];
  constructor(private service:MyServiceService) {}

  ngOnInit() {
    var self = this;
    console.log(this.service.currentUser);
    // create socket with server
    this.socket = io('/');
    this.socket.emit('new_connection',this.service.currentUser);
    this.socket.on('new_user',function(data){    
      self.availableUsers = data;
      console.log(self.availableUsers);
      self.availableUsers.filter(function(obj,index){
        if(obj.email === self.service.currentUser.email){
          self.availableUsers.splice(index,1);
        }
      })
    })
    // get new message
    this.socket.on('newChat',function(data){
      console.log(data);
      if(data.room === 'group'){
        if(data.msgTo === self.currActiveName){
          self.chats.push(data);
        }
        this.scrollToBottom();
      }
      else if(data.room === 'private'){
        if(self.currActiveUser != null){
          if(data.msgFromEmail === self.currActiveUser.email){
            self.chats.push(data);          
          }
          this.scrollToBottom();
        }
      }
    })
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
  logout(){
  	this.socket.disconnect();
    this.service.logout().subscribe((data) =>{
  		console.log('from subscribe: '+ data);
  	})
  }
  // select whom to chat
  selectChat(x:any){
    var self1 = this;
    if(typeof(x) === 'object'){
      console.log('in object')
      this.currActiveUser = x;
      this.currActiveName = this.currActiveUser.name;
      this.msg.room = 'private';
      this.msg.msgTo = this.currActiveUser.email;
      this.socket.emit('getChat',{room: this.msg.room, user1: this.service.currentUser.email, user2: this.currActiveUser.email});
      this.socket.on('privateChat',function(data){
        console.log(data);
        self1.chats = data;
      })
    }
    else if(typeof(x)==='string'){
      console.log('in string');
      this.currActiveUser = null;
      this.msg.room = 'group';
      this.currActiveName = x;
      this.msg.msgTo = this.currActiveName;
      this.socket.emit('getChat',this.msg.room);
      this.socket.on('groupChat',function(data){
        console.log(data);
        self1.chats = data;
      })
    }
  }
  // send message
  messageSubmit(x){
    var date = new Date();
    this.msg.msgFrom = this.service.currentUser.name;
    this.msg.msgFromEmail = this.service.currentUser.email;
    this.msg.msg = x.message;
    this.msg.createdOn= date.toISOString()
    this.chats.push(this.msg);
    this.socket.emit('new-message',{
      msgFrom: this.msg.msgFrom,
      msgFromEmail: this.msg.msgFromEmail,
      msgTo: this.msg.msgTo,
      msg: x.message,
      room: this.msg.room,
      date: date
    }); 
  }
}

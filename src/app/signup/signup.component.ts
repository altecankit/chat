import { Component, OnInit } from '@angular/core';
import {MyServiceService} from '../my-service.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private service:MyServiceService) { }

  ngOnInit() {
  }
  signupSubmit(obj){
  	this.service.saveUser(obj).subscribe((data:any)=>{
  		console.log('from subscribe: ' + data);
  		
  });
  }
}

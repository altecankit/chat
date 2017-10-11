import { Component, OnInit } from '@angular/core';
import {MyServiceService} from '../my-service.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private service:MyServiceService) { }

  ngOnInit() {
  	// this.service.isAuthenticated().subscribe((data)=>console.log('from subsribe: '+data));
  }
  loginSubmit(obj){
  	this.service.login(obj).subscribe((data)=>console.log('from subscriube' + data));
  }
}

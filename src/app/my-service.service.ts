import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
@Injectable()
export class MyServiceService {

  constructor(private http:Http,private router: Router) { }
  currentUser;
  saveUser(obj){
  	return this.http.post('/signup',obj).map((data)=>{
  		var temp = data.json();
  		if(temp.status === 'ok'){
  			this.currentUser = temp.content;
  			console.log(this.currentUser);
  			this.router.navigateByUrl('/chat');
  		}
  		else{
  			alert(temp.content);
  		}

  	});
  }
  login(obj){
  	return this.http.post('/login',obj).map((data) =>{
  		var temp = JSON.parse(data.text());
  		if(temp.status === 'false'){
  			alert(temp.content);
  		}
  		else{
  			this.currentUser = temp.content;
  			this.router.navigateByUrl('/chat');
  		}
  	})
  }
  isAuthenticated(){
  	return this.http.get('/login').map((data)=>{
  		var temp = JSON.parse(data.text());
  		if(temp.status === 'authenticated'){
  			this.currentUser = temp.content;
  			this.router.navigateByUrl('/chat');
  		}
  	})
  }
  logout(){
  	return this.http.get('/logout').map((data)=>{
     
      var temp = JSON.parse(data.text());
  		if(temp.status === 'true'){
        this.router.navigateByUrl('/');
      }  
  	})
  }
}


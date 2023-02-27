import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../interface/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  allUsers: User[] =[];
  isLoaded:boolean = false;
  constructor(private userService: UserService,private router: Router) { }

  ngOnInit() {
    this.initialization();
  }

  initialization(){
    this.userService.getAllUsers().subscribe(data=>{
      console.log(data);
      this.allUsers = data;
      this.isLoaded= true;
    })
  }
  btnClick(value){
    console.log(value);
    this.router.navigate(['unique',value.email]);
  }

}

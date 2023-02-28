import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from "ng6-toastr-notifications";

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {
  user: any;
  userId: string;
  isLoaded: boolean = false;
  constructor(public toastr: ToastrManager, private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.params['id'];
    this.initialization();
  }
  initialization() {
    this.userService.getUser(this.userId).subscribe(data => {
      console.log(data);
      this.user = data;
      this.userService.getUser(this.user.email).subscribe(data => {
        this.user = data;
      });
      this.isLoaded = true;
    });
  }

  deleteUser() {
    this.userService.deleteUser(this.user.mid).subscribe(data => {
      this.toastr.successToastr("Successfully Deleted user", "Success");
      this.router.navigateByUrl('users');
      
      
  
    });
   
  }

  updateProfile() {
    this.router.navigate(['update', this.user.email]);
  }

}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  user: any;
  userId: string;
  oldUser: any;
  profileForm: FormGroup;
  isLoaded:boolean = false;
  constructor(public toastr: ToastrManager,private router: Router,private activatedRoute: ActivatedRoute,private userService:UserService) { }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.params['id'];
    this.initialization();
    this.updateProfileControl();
  }
  updateProfileControl() {
    this.profileForm = new FormGroup({
      name: new FormControl(''),
      emailId: new FormControl(''),
      age: new FormControl('')
    });
  }
  initialization() {
    this.userService.getUser(this.userId).subscribe(data => {
      console.log(data);
      this.user = data;
      this.oldUser = data;
      this.isLoaded = true;
    });
  }

  updateProfile() {
   
    if (this.profileForm.value.name)
      this.user.name = this.profileForm.value.name;
    else
      this.user.name = this.oldUser.name;
    if (this.profileForm.value.emailId)
      this.user.email = this.profileForm.value.emailId;
    else
      this.user.email = this.oldUser.email;
    if (this.profileForm.value.age)
      this.user.age = this.profileForm.value.age;
    else
      this.user.age = this.oldUser.age;

    this.userService.updateUser(this.user).subscribe(data => {
      this.toastr.successToastr("User updated Successfully!!!","Success");
      this.router.navigateByUrl('users');
    });

  }
}

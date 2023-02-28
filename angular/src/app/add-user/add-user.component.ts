import { Component, OnInit } from '@angular/core';
import { User } from '../interface/User';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  registrationForm: FormGroup;
  user: User = new User();
  constructor(public toastr: ToastrManager, private userService: UserService, private router: Router) { }


  ngOnInit() {
    this.formControl();
  }

  formControl() {
    this.registrationForm = new FormGroup({
      name: new FormControl('', Validators.required),
      emailId: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required)
    });
  }
  get f() {
    return this.registrationForm.controls;
  }

  register() {
    
    this.user.name = this.registrationForm.value.name;
    this.user.email = this.registrationForm.value.emailId;
    this.user.age = this.registrationForm.value.age;
    console.log(this.user);
    this.userService.addUser(this.user).subscribe(data=>{
      console.log(data);
    })
    this.toastr.successToastr('User Added Successfully', 'Success!');
    this.router.navigateByUrl('users');
  }
}

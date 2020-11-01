import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { APIService } from '../API.service';
import { User } from '../../types/user';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  columns: string[] = ['name', 'email', 'description', 'action'];
  data_source: MatTableDataSource<User>;
  create_form: FormGroup;
  users: Array<User>;
  filter_label: string = 'Filter';
  table_header: string = 'App Users';
  action_label: string = 'Action';
  edit_lable: string = 'Edit';
  delete_lable: string = 'Delete';
  allowed_sizes: number[] = [5];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private api: APIService, private fb: FormBuilder, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.create_form = this.fb.group({
      'name': ['', Validators.required],
      'email': ['', Validators.required],
      'description': ['', Validators.required]
    });

    this.api.ListUsers().then(event => {
      this.users = event.items;
      this.data_source = new MatTableDataSource(this.users);
      this.data_source.paginator = this.paginator;
      this.data_source.sort = this.sort;
    });

    this.api.OnCreateUserListener.subscribe( (event: any) => {
      const new_user = event.value.data.onCreateUser;
      this.users = [...this.users, new_user];
      this.data_source.data = this.users;
    });

    this.api.OnDeleteUserListener.subscribe( (event: any) => {
      const deleted_user = event.value.data.onDeleteUser;
      this.users = this.users.filter(user => user.id !== deleted_user.id);
      this.data_source.data = this.users;
    });

    this.api.OnUpdateUserListener.subscribe( (event: any) => {
      const updated_user = event.value.data.onUpdateUser;
      let user_index = this.users.findIndex(user => user.id === updated_user.id);
      this.users[user_index] = updated_user;
      this.data_source.data = this.users;
    });
  }

  onCreate(user: User) {
    this.api.CreateUser(user)
    .then(event => {
      this.create_form.reset();
    })
    .catch(e => {
      console.log('error creating user...', e);
    });
  }

  onApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data_source.filter = filterValue.trim().toLowerCase();

    if (this.data_source.paginator) {
      this.data_source.paginator.firstPage();
    }
  }

  onOpenDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '50%',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.onAddUser(result.data);
      }else if(result.event == 'Update'){
        this.onUpdateUser(result.data);
      }else if(result.event == 'Delete'){
        this.onDeleteUser(result.data);
      }
    });
  }

  onAddUser(row_obj) {
    this.api.CreateUser({
      name: row_obj.name,
      email: row_obj.name.toLowerCase().trim() + '@gmail.com',
      description: row_obj.name + ' is a mock user'
    })
    .then(event => {
      console.log('user added'); 
    })
    .catch(e => {
      console.log('error creating user...', e);
    });
  }

  onUpdateUser(row_obj) {
    this.api.UpdateUser({
      id: row_obj.id,
      name: row_obj.name,
      email: row_obj.name.toLowerCase().trim() + '@gmail.com',
      description: row_obj.name + ' is a mock user'
    })
    .then(event => {
      console.log('user updated'); 
    })
    .catch(e => {
      console.log('error editing user...', e);
    });
  }

  onDeleteUser(row_obj) {
    this.api.DeleteUser({ id: row_obj.id })
    .then(event => {
      console.log('user deleted'); 
    })
    .catch(e => {
      console.log('error deleting user...', e);
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

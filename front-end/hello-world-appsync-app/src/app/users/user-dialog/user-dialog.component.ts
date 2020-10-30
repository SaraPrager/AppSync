import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
  DELETE_ACTION_NAME = 'Delete';
  action: string;
  local_data: any;
  name_label: string = 'Name';
  cancel_label: string = 'Cancel';
  delete_msg: string = 'Are you sure you want to delete ';

  // @Optional() is used to prevent error if no data is passed
  constructor(public dialogRef: MatDialogRef<UserDialogComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = {...data};
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
  }

  onDoAction(){
    this.dialogRef.close({ event:this.action, data:this.local_data });
  }

  onCloseDialog(){
    this.dialogRef.close({ event:'Cancel' });
  }
}
import { KeyValuePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-modal',
  template: `
  <div class="modal-overlay">
  <div class="modal-content">
    <div class="modal-header">
      <h2>{{ title() }}</h2>
        <button class="close-button" (click)="close.emit()">&times;</button>
    </div>
    <div class="modal-body">
    <form [formGroup]="formGroup()" (ngSubmit)="save.emit(); close.emit()">
        <div>
            <label for="title">Title</label>
            <input id="title" type="text" formControlName="title" />
        </div>
        <div>
            <label for="description">Description</label>
            <input id="description" type="text" formControlName="description" />
        </div>
        <div>
            <label for="dueDate">DueDate</label>
            <input id="dueDate" type="date" formControlName="dueDate" />
        </div>
        <div>
            <label for="priority">Priority</label>
            <select id="priority" formControlName="priority">
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
            </select>
        </div>
        <div>
            <label for="category">Category</label>
            <input id="category" type="text" formControlName="category" />
        </div>
        <div>
            <label for="status">Status</label>
            <select id="status" formControlName="status">
                <option value="To Do" selected>To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
            </select>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>   
  </div>
  </div>
  `,
  imports: [ReactiveFormsModule],
})
export class FormModalComponent {
  formGroup = input.required<FormGroup>();
  title = input.required<string>();
  save = output();
  close = output();
}
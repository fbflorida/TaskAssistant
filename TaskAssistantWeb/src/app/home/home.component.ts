import { Component, effect, inject, signal } from '@angular/core';
import { ModalComponent } from '../shared/ui/modal.component';
import { TaskList } from '../shared/interfaces/tasklist';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormModalComponent } from "../shared/ui/form-modal.component";
import { TaskListService } from '../shared/data-access/tasklist.service';
import TaskListListComponent from "./ui/tasklist-list.component";
import { formatDate } from '@angular/common';
import { AuthService } from '../shared/data-access/auth.service';
import { RegisterInfo, UserInfo } from '../shared/interfaces/userinfo';

@Component({
  selector: 'app-home',
  template: ` 
    <header>
      <h1>Task Assistant</h1>
      <button (click)="authService.logout$.next()">Log Out</button>
    </header> 
    <div class="control-nav">
        <h2>Welcome {{ userInfo().firstName }} {{ userInfo().lastName }}!</h2>
    </div>
    <div class="control-nav">
        <button (click)="tasklistBeingEdited.set({})">Add Task</button>
    </div>
    <app-modal [isOpen]="!!tasklistBeingEdited()">
      <ng-template>
        <app-form-modal
          [title]="
            tasklistBeingEdited()?.title
              ? tasklistBeingEdited()!.title!
              : 'Add Tasklist'
          "
          [formGroup]="tasklistForm"
          (close)="tasklistBeingEdited.set(null)"
          (save)="tasklistService.add$.next(tasklistForm.getRawValue())"
        />
      </ng-template>
    </app-modal>

    <section>
        <h2>Your Task List</h2>
        <app-tasklist-list [tasklists]="tasklistService.tasklists()"
            (delete)="tasklistService.remove$.next($event)">

        </app-tasklist-list>
    </section>
    `,
   imports: [ModalComponent, FormModalComponent, TaskListListComponent]
})
export default class HomeComponent {
    formBuilder = inject(FormBuilder);
    tasklistService = inject(TaskListService);
    authService = inject(AuthService);
    tasklistBeingEdited = signal<Partial<TaskList> | null>(null);

    tasklistForm = this.formBuilder.nonNullable.group({
        title: ['', Validators.required],
        description: [''],
        dueDate:[new Date()],
        priority:[Number(), Validators.required],
        category:[''],
        status:['To DO', Validators.required]
    });

    userInfo = signal<RegisterInfo>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        userName: ''
    });

    constructor() {
        effect(() => {
        const tasklist = this.tasklistBeingEdited();

        if (!tasklist) {
            this.tasklistForm.reset();
        }
        });

        this.authService.getUserInfo().subscribe((data) => this.userInfo.set(data));
    }
}
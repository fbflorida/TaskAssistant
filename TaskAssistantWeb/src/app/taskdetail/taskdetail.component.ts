import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TaskListService } from '../shared/data-access/tasklist.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-tasklist',
  template: ` 
    <header>
      <a routerLink="/home">Back</a>
    </header>
    <section>
      <form [formGroup]="taskForm" (ngSubmit)="update()">
        <div>
            <label for="title">Title:</label>
            <input id="title" type="text" formControlName="title" />
        </div>
        <div>
            <label for="description">Description:</label>
            <input id="description" type="text" formControlName="description" />
        </div>
        <div>
            <label for="dueDate">DueDate:</label>
            <input id="dueDate" type="date" formControlName="dueDate" />
        </div>
        <div>
            <label for="priority">Priority:</label>
            <select id="priority" formControlName="priority">
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
            </select>
        </div>
        <div>
            <label for="category">Category:</label>
            <input id="category" type="text" formControlName="category" />
        </div>
        <div>
            <label for="status">Status:</label>
            <select id="status" formControlName="status" >
                <option value="To Do" selected>To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
            </select>
        </div>
        <button type="submit">Save</button>
      </form>
    </section>
    
    
  `,
  imports: [RouterLink, ReactiveFormsModule],
})

export default class TaskDetailComponent implements OnInit {
    formBuilder = inject(FormBuilder);
    tasklistService = inject(TaskListService);
    route = inject(ActivatedRoute);
    router = inject(Router)


    taskForm = this.formBuilder.nonNullable.group({
        title: ['', Validators.required],
        description: [''],
        dueDate:[new Date()],
        priority:[Number(), Validators.required],
        category:[''],
        status:['To DO', Validators.required]
    });


    ngOnInit(): void {
        this.tasklistService.getTask(this.route.snapshot.params['id']).subscribe((data) =>{
            this.taskForm.patchValue({
                title: data.title,
                description: data.description,
                dueDate: data.dueDate,
                priority: data.priority,
                category: data.category,
                status: data.status
            });
        });
        
        
    }

    update() {
        this.tasklistService.edit$.next({ 
                        id: this.route.snapshot.params['id'], 
                        data: this.taskForm.getRawValue()});
        this.router.navigate(['/home']);
    }
}
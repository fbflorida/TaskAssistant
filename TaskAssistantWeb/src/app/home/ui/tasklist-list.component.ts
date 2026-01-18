import { Component, input, output } from "@angular/core";
import { RemoveTaskList, TaskList } from "../../shared/interfaces/tasklist";
import { RouterLink } from "@angular/router";


@Component({
    selector: "app-tasklist-list",
    template:`
        <table class="elegant-table">            
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                @for (tasklist of tasklists(); track tasklist.id){
                <tr>
                    <td>
                        <a routerLink="/tasklist/{{ tasklist.id }}">
                        {{ tasklist.title }}
                        </a>
                    </td>
                    <td>{{ tasklist.dueDate }}</td>
                    <td>{{ tasklist.status }}</td>
                    <td><div>
                        <button (click)="delete.emit(tasklist.id)">Delete</button>
                    </div></td>
                </tr>
                } @empty {
                    <tr>
                        <td colspan="4"><p>Click the add button to create your first Task!</p></td>
                    </tr>
                }
            </tbody>
        </table>    
        
    `,
    imports: [RouterLink],
    styles: [
            `
            .elegant-table {
            width: 100%;
            border-collapse: collapse; /* */
            margin: 25px 0;
            font-size: 0.9em;
            font-family: sans-serif;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
            }

            .elegant-table thead tr {
            background-color: #009879;
            color: #ffffff;
            text-align: left;
            }

            .elegant-table th,
            .elegant-table td {
            padding: 12px 15px;
            }

            .elegant-table tbody tr {
            border-bottom: 1px solid #dddddd;
            }

            .elegant-table tbody tr:nth-of-type(even) {
            background-color: #f3f3f3; /* */
            }

            .elegant-table tbody tr:last-of-type {
            border-bottom: 2px solid #009879;
            }

            .elegant-table tbody tr:hover {
            background-color: #e0e0e0; /* */
            }
            `,
        ],


})

export default class TaskListListComponent {
    tasklists = input.required<TaskList[]>();
    delete = output<RemoveTaskList>();
    edit = output<TaskList>();
}
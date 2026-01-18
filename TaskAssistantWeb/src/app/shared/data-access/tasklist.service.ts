import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, concatMap, EMPTY, map, merge, mergeMap, startWith, Subject, switchMap } from 'rxjs';
import { AddTaskList, EditTaskList, ReadTaskList, RemoveTaskList, TaskList } from '../interfaces/tasklist';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment/environment';

export interface TaskListsState {
  tasklists: TaskList[];
}

@Injectable({
  providedIn: 'root',
})
export class TaskListService {
    http = inject(HttpClient);

    // state
    private state = signal<TaskListsState>({
        tasklists: [],
    });

    // selectors
    tasklists = computed(() => this.state().tasklists);

    // sources
    add$ = new Subject<AddTaskList>();
    edit$ = new Subject<EditTaskList>();
    remove$ = new Subject<RemoveTaskList>();
    read$ = new Subject<ReadTaskList>();

    headers = new HttpHeaders({
    'Content-Type': 'application/json',    
    });

    getTask(id: string){
        return this.http
            .get<ReadTaskList>(`${environment.API_URL}/api/task/${id}`, { headers: this.headers})
            .pipe(catchError((err) => this.handleError(err)))
    }
    
    taskListAdded$ = this.add$.pipe(
        concatMap((addTaskList) =>
        this.http
            .post(`${environment.API_URL}/api/task`, 
                JSON.stringify(addTaskList), 
                { headers: this.headers})
            .pipe(catchError((err) => this.handleError(err))),
        ),
    );   

    taskListRemoved$ = this.remove$.pipe(
        mergeMap((id) =>
        this.http
            .delete(`${environment.API_URL}/api/task/${id}`)
            .pipe(catchError((err) => this.handleError(err))),
        ),
    );

    taskListEdited$ = this.edit$.pipe(
        mergeMap((update) =>
        this.http
            .put(
            `${environment.API_URL}/api/task/${update.id}`,
                JSON.stringify(update.data),
                { headers: this.headers}
            )
            .pipe(catchError((err) => this.handleError(err))),
        ),
    );

    constructor() {       
        
        merge(this.taskListAdded$, this.taskListEdited$, this.taskListRemoved$)
            .pipe(
                startWith(null),
                switchMap(() =>
                    this.http.get<TaskList[]>(`${environment.API_URL}/api/task/usertasks`)
                             .pipe(catchError((err) => this.handleError(err)))
                ),
                takeUntilDestroyed(),
            )
            .subscribe((tasklists) =>
                this.state.update((state) => ({
                ...state,
                tasklists,
                loaded: true,
                })),
            );
    }

    private handleError(err: any) {
        this.state.update((state) => ({ ...state, error: err }));
        return EMPTY;
    }

    
}
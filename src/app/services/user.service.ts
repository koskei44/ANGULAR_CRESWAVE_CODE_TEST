import { Injectable, inject } from '@angular/core';
import { Task } from '../models/todo';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  
  private readonly tasks: Task[] = [
    { id: 1, title: 'Task 1', description: 'Description of Task 1', status: 'Incomplete' },
    { id: 2, title: 'Task 2', description: 'Description of Task 2', status: 'Complete' },
    { id: 3, title: 'Task 3', description: 'Description of Task 3', status: 'incomplete' },
    { id: 4, title: 'Task 4', description: 'Description of Task 4', status: 'Complete' },
    { id: 5, title: 'Task 5', description: 'Description of Task 5', status: 'Incomplete' },
  ];
  // BehaviorSubject to hold the current list of tasks
  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);


  /**
   * @deprecated api methods for testing only
   * @returns Observable<Task[]>
   */
  getApiTasks(): Observable<Task[]> {
    return this.http.get<Task[]>('https://jsonplaceholder.typicode.com/todos');
  }

  /**
   * @deprecated api methods for testing only
   * @returns Observable<Task>
   */
  addApiTask(task: Task): Observable<Task> {
    return this.http.post<Task>('https://jsonplaceholder.typicode.com/todos', task);
  }

  // Observable to expose current tasks
  getAllTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(task: Task): void {
    task.id = this.tasks.length + 1; // Assign new ID
    this.tasks.push(task);
    this.tasksSubject.next(this.tasks); // Emit the updated tasks
  }

  updateTask(task: Task): void {
    const index = this.tasks.findIndex((t) => task.id === t.id);
    if (index !== -1) {
      this.tasks[index] = task;
      this.tasksSubject.next(this.tasks); // Emit the updated tasks
    }
  }

  deleteTask(task: Task): void {
    const index = this.tasks.findIndex((t) => task.id === t.id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.tasksSubject.next(this.tasks); // Emit the updated tasks
    }
  }
}

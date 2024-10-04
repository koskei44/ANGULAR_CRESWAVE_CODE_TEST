import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskService } from './services/user.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from './models/todo';
import { ModeEnum } from './models/mode.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private taskService = inject(TaskService);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    id: [0],
    title: ['', Validators.required],
    description: ['', Validators.required],
    status: ['', Validators.required],
  });

  ModeEnum = ModeEnum;
  tasks: Task[] = []; // Initialize tasks as an empty array
  mode = ModeEnum.NON;

  ngOnInit(): void {
    this.setTasks();
  }

  private setTasks() {
    // Subscribe to the observable to get the tasks
    this.taskService.getAllTasks().subscribe((tasks) => {
      this.tasks = tasks; // Assign the received tasks to the tasks property
    });
  }

  addNewTask() {
    this.mode = ModeEnum.ADD;
  }

  editTask(task: Task) {
    this.mode = ModeEnum.EDIT;
    this.form.setValue(task);
  }

  saveTask() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const task = this.form.value as Task;

    if (this.mode === ModeEnum.ADD) {
      this.taskService.addTask(task);
    } else {
      this.taskService.updateTask(task);
    }
    this.setTasks(); // Refresh tasks after saving
    this.cancel();
  }

  removeTask(task: Task) {
    this.taskService.deleteTask(task);
    this.setTasks(); // Refresh tasks after deletion
  }

  cancel() {
    this.form.reset();
    this.mode = ModeEnum.NON;
  }
}

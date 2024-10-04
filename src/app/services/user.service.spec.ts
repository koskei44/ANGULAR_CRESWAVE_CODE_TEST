import { TestBed } from '@angular/core/testing';
import { TaskService } from './user.service';
import { Task } from '../models/todo';
import { of } from 'rxjs';
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('TaskService', () => {
  let service: TaskService;
  let httpClientSpy = { get: jest.fn(), post: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        {
          provide: HttpClient,
          useValue: httpClientSpy,
        },
      ],
    });
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all tasks', () => {
    const tasks: Task[] = service.getAllTasks();
    expect(tasks.length).toBe(2);
    expect(tasks[0].id).toBe(1);
    expect(tasks[0].title).toBe('Complete Project');
    expect(tasks[0].description).toBe('Finish the Angular project');
    expect(tasks[1].id).toBe(2);
    expect(tasks[1].title).toBe('Team Meeting');
    expect(tasks[1].description).toBe('Discuss project progress');
  });

  it('should add a new task', () => {
    const task: Task = {
      id: 3,
      title: 'Write Tests',
      description: 'Write unit tests for the service',
      status: 'Pending',
    };
    service.addTask(task);
    const tasks: Task[] = service.getAllTasks();
    expect(tasks.length).toBe(3);
    expect(tasks[2]).toEqual(task);
  });

  it('should update an existing task', () => {
    const task: Task = {
      id: 1,
      title: 'Updated Task',
      description: 'Updated description',
      status: 'In Progress',
    };
    service.updateTask(task);
    const tasks: Task[] = service.getAllTasks();
    expect(tasks[0]).toEqual(task);
  });

  it('should delete an existing task', () => {
    const task: Task = {
      id: 2,
      title: 'Team Meeting',
      description: 'Discuss project progress',
      status: 'Completed',
    };
    service.deleteTask(task);
    const tasks: Task[] = service.getAllTasks();
    expect(tasks.length).toBe(1);
    expect(tasks[0].id).toBe(1);
    expect(tasks[0].title).toBe('Complete Project');
    expect(tasks[0].description).toBe('Finish the Angular project');
  });

  it('should return API tasks', () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Write Documentation',
        description: 'Document the features of the application',
        status: 'Pending',
      },
      {
        id: 2,
        title: 'Review Code',
        description: 'Review pull requests from the team',
        status: 'In Progress',
      },
    ];

    httpClientSpy.get.mockReturnValue(of(mockTasks));

    service.getApiTasks().subscribe((tasks) => {
      expect(tasks).toEqual(mockTasks);
    });

    expect(httpClientSpy.get).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/tasks'
    );
  });

  it('should add a new task via API', () => {
    const task: Task = {
      id: 3,
      title: 'Deploy Application',
      description: 'Deploy the application to the server',
      status: 'Pending',
    };

    httpClientSpy.post.mockReturnValue(of(task));

    service.addApiTask(task).subscribe((addedTask) => {
      expect(addedTask).toEqual(task);
    });

    expect(httpClientSpy.post).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/tasks',
      task
    );
  });
});

export interface TaskList {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: number;
  category: string;
  status: string;
}

export type AddTaskList = Omit<TaskList, 'id'>;
export type ReadTaskList = Omit<TaskList, 'id'>;
export type EditTaskList = { id: TaskList['id']; data: AddTaskList };
export type RemoveTaskList = TaskList['id'];
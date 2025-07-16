**Kanban Board -Task Management Application**

Thi is an task management application using React JS that allows users to create, organize, and move tasks between columns like "To Do", "In Progress", and "Done". This project focuses on drag-and-drop interaction, state management using Context API, and local persistence using localStorage.


**Task Board Layout:**

Display multiple task columns: To Do, In Progress, and Done.


Each column should show task cards with key info like title, description, and optional tags or priority.


Responsive layout using TailwindCSS.


**Add/Edit/Delete Tasks:**

Allow users to create new tasks via an input form (task name, description, status).


Enable editing or deleting tasks using actions on each task card.


Task data should persist via localStorage, even after refresh.


**Drag and Drop:**

Implement drag-and-drop functionality to move tasks between columns.


Dragging should update the internal task state and persist it.


Use either react-beautiful-dnd or dnd-kit.


**Task Details Modal :**

On clicking a task, open a modal to view full details.


Enable inline editing of fields like description or status.



**User Features:**

View tasks organized into visual columns.


Drag and drop tasks between columns smoothly.


Create, edit, or delete task cards.


Data is persisted locally so user doesn’t lose progress on reload.


Optional: Add tags, priorities, or deadlines for tasks.



**Tech Stack to be Used:**

React JS


TailwindCSS for styling


React Hooks (useState, useContext, useEffect) for state management


Context API for global task state


react-beautiful-dnd or dnd-kit for drag-and-drop


localStorage for persistence (no external APIs required)



package com.hahnsoftware.projecttasks.controller;

import com.hahnsoftware.projecttasks.dto.CreateTaskRequest;
import com.hahnsoftware.projecttasks.dto.UpdateTaskRequest;
import com.hahnsoftware.projecttasks.model.Task;
import com.hahnsoftware.projecttasks.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/projects/{projectId}/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(@PathVariable Long projectId) {
        List<Task> tasks = taskService.getAllTasks(projectId);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@PathVariable Long projectId, @Valid @RequestBody CreateTaskRequest request) {
        Task task = taskService.createTask(projectId, request);
        return ResponseEntity.ok(task);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long projectId, @PathVariable Long id) {
        Task task = taskService.getTaskById(projectId, id);
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long projectId, @PathVariable Long id, @Valid @RequestBody UpdateTaskRequest request) {
        Task task = taskService.updateTask(projectId, id, request);
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long projectId, @PathVariable Long id) {
        taskService.deleteTask(projectId, id);
        return ResponseEntity.ok().build();
    }
}

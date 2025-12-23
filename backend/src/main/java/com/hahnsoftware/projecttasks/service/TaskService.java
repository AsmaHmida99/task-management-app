package com.hahnsoftware.projecttasks.service;

import com.hahnsoftware.projecttasks.dto.CreateTaskRequest;
import com.hahnsoftware.projecttasks.dto.UpdateTaskRequest;
import com.hahnsoftware.projecttasks.model.Project;
import com.hahnsoftware.projecttasks.model.Task;
import com.hahnsoftware.projecttasks.model.User;
import com.hahnsoftware.projecttasks.repository.ProjectRepository;
import com.hahnsoftware.projecttasks.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserService userService;

    public TaskService(TaskRepository taskRepository,
                       ProjectRepository projectRepository,
                       UserService userService) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<Task> getAllTasks(Long projectId) {
        Project project = verifyProjectAccess(projectId);
        return taskRepository.findByProject(project);
    }

    @Transactional
    public Task createTask(Long projectId, CreateTaskRequest request) {
        Project project = verifyProjectAccess(projectId);

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCompleted(false);
        task.setProject(project);

        return taskRepository.save(task);
    }

    @Transactional(readOnly = true)
    public Task getTaskById(Long projectId, Long taskId) {
        verifyProjectAccess(projectId);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Task not found in this project");
        }

        return task;
    }

    @Transactional
    public Task updateTask(Long projectId, Long taskId, UpdateTaskRequest request) {
        verifyProjectAccess(projectId);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Task not found in this project");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getCompleted() != null) {
            task.setCompleted(request.getCompleted());
        }

        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(Long projectId, Long taskId) {
        verifyProjectAccess(projectId);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Task not found in this project");
        }

        taskRepository.delete(task);
    }

    private Project verifyProjectAccess(Long projectId) {
        User currentUser = userService.getCurrentUser();
        return projectRepository.findById(projectId)
                .filter(p -> p.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));
    }
}

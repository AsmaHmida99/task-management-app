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

    /**
     * Récupère toutes les tâches d'un projet
     * @param projectId ID du projet
     * @return Liste des tâches
     * @throws RuntimeException si le projet n'existe pas ou si l'utilisateur n'y a pas accès
     */
    @Transactional(readOnly = true)
    public List<Task> getAllTasks(Long projectId) {
        Project project = verifyProjectAccess(projectId);
        return taskRepository.findByProject(project);
    }

    /**
     * Crée une nouvelle tâche dans un projet
     * @param projectId ID du projet
     * @param request Requête de création de tâche
     * @return La tâche créée
     * @throws RuntimeException si le projet n'existe pas ou si l'utilisateur n'y a pas accès
     */
    @Transactional
    public Task createTask(Long projectId, CreateTaskRequest request) {
        Project project = verifyProjectAccess(projectId);

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setCompleted(false);
        task.setProject(project);

        return taskRepository.save(task);
    }

    /**
     * Récupère une tâche par son ID
     * @param projectId ID du projet
     * @param taskId ID de la tâche
     * @return La tâche
     * @throws RuntimeException si la tâche ou le projet n'existe pas, ou si l'utilisateur n'y a pas accès
     */
    @Transactional(readOnly = true)
    public Task getTaskById(Long projectId, Long taskId) {
        verifyProjectAccess(projectId);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // Vérifier que la tâche appartient au projet
        if (!task.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Task not found in this project");
        }

        return task;
    }

    /**
     * Met à jour une tâche existante
     * @param projectId ID du projet
     * @param taskId ID de la tâche à mettre à jour
     * @param request Requête de mise à jour
     * @return La tâche mise à jour
     * @throws RuntimeException si la tâche ou le projet n'existe pas, ou si l'utilisateur n'y a pas accès
     */
    @Transactional
    public Task updateTask(Long projectId, Long taskId, UpdateTaskRequest request) {
        verifyProjectAccess(projectId);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // Vérifier que la tâche appartient au projet
        if (!task.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Task not found in this project");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        if (request.getCompleted() != null) {
            task.setCompleted(request.getCompleted());
        }

        return taskRepository.save(task);
    }

    /**
     * Supprime une tâche
     * @param projectId ID du projet
     * @param taskId ID de la tâche à supprimer
     * @throws RuntimeException si la tâche ou le projet n'existe pas, ou si l'utilisateur n'y a pas accès
     */
    @Transactional
    public void deleteTask(Long projectId, Long taskId) {
        verifyProjectAccess(projectId);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // Vérifier que la tâche appartient au projet
        if (!task.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Task not found in this project");
        }

        taskRepository.delete(task);
    }

    /**
     * Vérifie que l'utilisateur connecté a accès au projet
     * @param projectId ID du projet
     * @return Le projet si l'accès est autorisé
     * @throws RuntimeException si le projet n'existe pas ou si l'utilisateur n'y a pas accès
     */
    private Project verifyProjectAccess(Long projectId) {
        User currentUser = userService.getCurrentUser();
        return projectRepository.findById(projectId)
                .filter(p -> p.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));
    }
}

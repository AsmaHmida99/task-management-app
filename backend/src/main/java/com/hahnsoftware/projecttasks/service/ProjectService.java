package com.hahnsoftware.projecttasks.service;

import com.hahnsoftware.projecttasks.dto.CreateProjectRequest;
import com.hahnsoftware.projecttasks.dto.ProjectResponseDTO;
import com.hahnsoftware.projecttasks.dto.UpdateProjectRequest;
import com.hahnsoftware.projecttasks.model.Project;
import com.hahnsoftware.projecttasks.model.User;
import com.hahnsoftware.projecttasks.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserService userService;

    public ProjectService(ProjectRepository projectRepository,
                          UserService userService) {
        this.projectRepository = projectRepository;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponseDTO> getAllProjects() {
        User currentUser = userService.getCurrentUser();
        List<Project> projects = projectRepository.findByUser(currentUser);
        return projects.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectResponseDTO createProject(CreateProjectRequest request) {
        User currentUser = userService.getCurrentUser();

        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setUser(currentUser);

        Project savedProject = projectRepository.save(project);
        return mapToDTO(savedProject);
    }

    @Transactional(readOnly = true)
    public ProjectResponseDTO getProjectById(Long id) {
        User currentUser = userService.getCurrentUser();
        Project project = projectRepository.findById(id)
                .filter(p -> p.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));
        return mapToDTO(project);
    }

    @Transactional
    public ProjectResponseDTO updateProject(Long id, UpdateProjectRequest request) {
        User currentUser = userService.getCurrentUser();
        Project project = projectRepository.findById(id)
                .filter(p -> p.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());

        Project updatedProject = projectRepository.save(project);
        return mapToDTO(updatedProject);
    }

    @Transactional
    public void deleteProject(Long id) {
        User currentUser = userService.getCurrentUser();
        Project project = projectRepository.findById(id)
                .filter(p -> p.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));

        projectRepository.delete(project);
    }

    private ProjectResponseDTO mapToDTO(Project project) {
        int taskCount = project.getTasks() != null ? project.getTasks().size() : 0;
        int completedTaskCount = project.getTasks() != null
                ? (int) project.getTasks().stream()
                    .filter(task -> Boolean.TRUE.equals(task.getCompleted()))
                    .count()
                : 0;

        return new ProjectResponseDTO(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getCreatedAt(),
                taskCount,
                completedTaskCount
        );
    }
}

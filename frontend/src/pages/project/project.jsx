"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Edit2, Folder, CheckCircle2, Circle, ChevronRight } from "lucide-react"
import Header from "../../components/header/header"
import "./project.css"


const ProjectPage = () => {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("projects")
    return saved ? JSON.parse(saved) : []
  })

  const [selectedProject, setSelectedProject] = useState(null)
  const [showProjectDialog, setShowProjectDialog] = useState(false)
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [editingTask, setEditingTask] = useState(null)

  const [projectForm, setProjectForm] = useState({ title: "", description: "" })
  const [taskForm, setTaskForm] = useState({ title: "", description: "" })

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects))
  }, [projects])

  const getProgress = (projectId) => {
    const project = projects.find((p) => p.id === projectId)
    if (!project || project.tasks.length === 0) return 0
    const completed = project.tasks.filter((t) => t.completed).length
    return Math.round((completed / project.tasks.length) * 100)
  }

  const createProject = () => {
    const newProject = {
      id: Date.now().toString(),
      title: projectForm.title,
      description: projectForm.description,
      tasks: [],
    }
    setProjects([...projects, newProject])
    setProjectForm({ title: "", description: "" })
    setShowProjectDialog(false)
  }

  const updateProject = () => {
    if (!editingProject) return
    setProjects(
      projects.map((p) =>
        p.id === editingProject.id ? { ...p, title: projectForm.title, description: projectForm.description } : p,
      ),
    )
    setProjectForm({ title: "", description: "" })
    setEditingProject(null)
    setShowProjectDialog(false)
  }

  const deleteProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id))
    if (selectedProject?.id === id) setSelectedProject(null)
  }

  const addTask = () => {
    if (!selectedProject) return
    const newTask = {
      id: Date.now().toString(),
      title: taskForm.title,
      description: taskForm.description,
      completed: false,
    }
    setProjects(projects.map((p) => (p.id === selectedProject.id ? { ...p, tasks: [...p.tasks, newTask] } : p)))
    setTaskForm({ title: "", description: "" })
    setShowTaskDialog(false)
  }

  const updateTask = () => {
    if (!selectedProject || !editingTask) return
    setProjects(
      projects.map((p) =>
        p.id === selectedProject.id
          ? {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === editingTask.id ? { ...t, title: taskForm.title, description: taskForm.description } : t,
              ),
            }
          : p,
      ),
    )
    setTaskForm({ title: "", description: "" })
    setEditingTask(null)
    setShowTaskDialog(false)
  }

  const toggleTask = (taskId) => {
    if (!selectedProject) return
    setProjects(
      projects.map((p) =>
        p.id === selectedProject.id
          ? {
              ...p,
              tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
            }
          : p,
      ),
    )
  }

  const deleteTask = (taskId) => {
    if (!selectedProject) return
    setProjects(
      projects.map((p) => (p.id === selectedProject.id ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) } : p)),
    )
  }

  const openEditProject = (project) => {
    setEditingProject(project)
    setProjectForm({ title: project.title, description: project.description })
    setShowProjectDialog(true)
  }

  const openEditTask = (task) => {
    setEditingTask(task)
    setTaskForm({ title: task.title, description: task.description })
    setShowTaskDialog(true)
  }

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logout")
  }

  const currentProject = projects.find((p) => p.id === selectedProject?.id)

  return (
    <div className="app-container">
      <Header showLogout={true} onLogout={handleLogout} />
      {/* Header */}
      <div className="app-header mt-6">
        <div className="header-content">
          <div className="header-left">
            {selectedProject && (
              <button onClick={() => setSelectedProject(null)} className="back-button" title="Retour aux projets">
                <ChevronRight className="icon-rotate" />
              </button>
            )}
            <div className="header-title-section">
              <h1 className="header-title">{selectedProject ? currentProject?.title : "Mes Projets"}</h1>
              <p className="header-subtitle">
                {selectedProject ? (
                  <>
                    <CheckCircle2 className="icon-small" />
                    <span>
                      {currentProject?.tasks.filter((t) => t.completed).length}/{currentProject?.tasks.length || 0}{" "}
                      tâches
                    </span>
                  </>
                ) : (
                  <>
                    <Folder className="icon-small" />
                    {projects.length} projet{projects.length > 1 ? "s" : ""}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button
              onClick={() => {
                if (selectedProject) {
                  setTaskForm({ title: "", description: "" })
                  setEditingTask(null)
                  setShowTaskDialog(true)
                } else {
                  setProjectForm({ title: "", description: "" })
                  setEditingProject(null)
                  setShowProjectDialog(true)
                }
              }}
              className="primary-button"
            >
              <Plus className="icon" />
              <span className="button-text">{selectedProject ? "Nouvelle tâche" : "Nouveau projet"}</span>
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <main className="main-content">
        {selectedProject && currentProject && (
          <div className="progress-card">
            <div className="progress-header">
              <div className="progress-info">
                <h2 className="progress-title">Progression globale</h2>
                <p className="progress-subtitle">
                  {currentProject.tasks.filter((t) => t.completed).length} sur {currentProject.tasks.length} tâches
                </p>
              </div>
              <div className="progress-percentage">
                <div className="percentage-value">{getProgress(selectedProject.id)}%</div>
                <p className="percentage-label">Complété</p>
              </div>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${getProgress(selectedProject.id)}%` }} />
            </div>
          </div>
        )}

        {!selectedProject ? (
          projects.length === 0 ? (
            <div className="empty-state">
              <h3 className="empty-title">Aucun projet pour le moment</h3>
              <p className="empty-text">Commencez par créer votre premier projet</p>
              <button
                onClick={() => {
                  setProjectForm({ title: "", description: "" })
                  setShowProjectDialog(true)
                }}
                className="primary-button"
              >
                <Plus className="icon" />
                Créer un projet
              </button>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => {
                const progress = getProgress(project.id)
                const completedTasks = project.tasks.filter((t) => t.completed).length

                return (
                  <div key={project.id} className="project-card" onClick={() => setSelectedProject(project)}>
                    <div className="project-card-header">
                      <div className="project-info">
                        <h3 className="project-title">{project.title}</h3>
                        <p className="project-tasks">
                          <CheckCircle2 className="icon-small" />
                          <span>
                            {project.tasks.length} tâche{project.tasks.length > 1 ? "s" : ""}
                          </span>
                        </p>
                      </div>
                      <ChevronRight className="icon chevron-icon" />
                    </div>

                    {project.description && <p className="project-description">{project.description}</p>}

                    <div className="project-progress">
                      <div className="progress-label">
                        <span>Progression</span>
                        <span className="progress-count">
                          {completedTasks}/{project.tasks.length}
                        </span>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="progress-badge-container">
                        <span className="progress-badge">{progress}% complété</span>
                      </div>
                    </div>

                    <div className="project-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditProject(project)
                        }}
                        className="action-button edit-button"
                      >
                        <Edit2 className="icon-small" />
                        <span>Modifier</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (window.confirm(`Supprimer "${project.title}" ?`)) {
                            deleteProject(project.id)
                          }
                        }}
                        className="action-button delete-button"
                      >
                        <Trash2 className="icon-small" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        ) : (
          <div className="tasks-container">
            {currentProject?.tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <CheckCircle2 className="icon-large" />
                </div>
                <h3 className="empty-title">Aucune tâche pour le moment</h3>
                <p className="empty-text">Commencez par créer votre première tâche pour ce projet</p>
                <button
                  onClick={() => {
                    setTaskForm({ title: "", description: "" })
                    setShowTaskDialog(true)
                  }}
                  className="primary-button"
                >
                  <Plus className="icon" />
                  Créer une tâche
                </button>
              </div>
            ) : (
              <div className="tasks-list">
                {currentProject?.tasks.map((task) => (
                  <div key={task.id} className={`task-card ${task.completed ? "completed" : ""}`}>
                    <div className="task-content">
                      <button onClick={() => toggleTask(task.id)} className="task-checkbox">
                        {task.completed ? (
                          <CheckCircle2 className="icon-checked" />
                        ) : (
                          <Circle className="icon-unchecked" />
                        )}
                      </button>

                      <div className="task-info">
                        <p className={`task-title ${task.completed ? "task-completed" : ""}`}>{task.title}</p>
                        {task.description && (
                          <p className={`task-description ${task.completed ? "task-completed" : ""}`}>
                            {task.description}
                          </p>
                        )}
                      </div>

                      <div className="task-actions">
                        <button onClick={() => openEditTask(task)} className="task-action-button" title="Modifier">
                          <Edit2 className="icon-small" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Supprimer cette tâche ?")) {
                              deleteTask(task.id)
                            }
                          }}
                          className="task-action-button delete"
                          title="Supprimer"
                        >
                          <Trash2 className="icon-small" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Project Dialog */}
      {showProjectDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <div className="dialog-icon project-icon">
                <Folder className="icon" />
              </div>
              <h2 className="dialog-title">{editingProject ? "Modifier le projet" : "Nouveau projet"}</h2>
            </div>

            <div className="dialog-content">
              <div className="form-group">
                <label className="form-label">Titre du projet</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="Ex: Site Web E-commerce"
                  className="form-input"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Décrivez votre projet en quelques mots..."
                  rows={4}
                  className="form-textarea"
                />
              </div>
            </div>

            <div className="dialog-actions">
              <button
                onClick={() => {
                  setShowProjectDialog(false)
                  setEditingProject(null)
                  setProjectForm({ title: "", description: "" })
                }}
                className="secondary-button"
              >
                Annuler
              </button>
              <button
                onClick={editingProject ? updateProject : createProject}
                disabled={!projectForm.title.trim()}
                className="primary-button"
              >
                {editingProject ? "Enregistrer" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Dialog */}
      {showTaskDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <div className="dialog-icon task-icon">
                <CheckCircle2 className="icon" />
              </div>
              <h2 className="dialog-title">{editingTask ? "Modifier la tâche" : "Nouvelle tâche"}</h2>
            </div>

            <div className="dialog-content">
              <div className="form-group">
                <label className="form-label">Titre de la tâche</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Ex: Design de la maquette"
                  className="form-input"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Description <span className="optional-label">(optionnel)</span>
                </label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Détails supplémentaires sur cette tâche..."
                  rows={4}
                  className="form-textarea"
                />
              </div>
            </div>

            <div className="dialog-actions">
              <button
                onClick={() => {
                  setShowTaskDialog(false)
                  setEditingTask(null)
                  setTaskForm({ title: "", description: "" })
                }}
                className="secondary-button"
              >
                Annuler
              </button>
              <button
                onClick={editingTask ? updateTask : addTask}
                disabled={!taskForm.title.trim()}
                className="primary-button"
              >
                {editingTask ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectPage

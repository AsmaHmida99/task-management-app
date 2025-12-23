"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Trash2, Edit2, Folder, CheckCircle2, Circle, ChevronRight } from "lucide-react"
import Header from "../../components/header/header"
import { useAuth } from "../../context/AuthContext"
import { projectService, taskService } from "../../services"
import "./project.css"


const ProjectPage = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showProjectDialog, setShowProjectDialog] = useState(false)
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [deleteType, setDeleteType] = useState(null) // 'task' or 'project'
  const [deleteId, setDeleteId] = useState(null)
  const [deleteName, setDeleteName] = useState('')

  const [projectForm, setProjectForm] = useState({ title: "", description: "" })
  const [taskForm, setTaskForm] = useState({ title: "", description: "" })

  // Charger les projets depuis le backend au montage
  useEffect(() => {
    loadProjects()
  }, [])

  // Charger les tâches quand on sélectionne un projet
  useEffect(() => {
    if (selectedProject) {
      loadTasks(selectedProject.id)
    }
  }, [selectedProject?.id])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const data = await projectService.getAllProjects()
      setProjects(data)
    } catch (error) {
      console.error('Error loading projects:', error)
      alert(error.message || 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const loadTasks = async (projectId) => {
    try {
      const tasks = await taskService.getAllTasks(projectId)
      setProjects(prevProjects =>
        prevProjects.map(p =>
          p.id === projectId ? { ...p, tasks } : p
        )
      )
      // Mettre à jour le projet sélectionné avec les tâches
      setSelectedProject(prev => {
        if (prev?.id === projectId) {
          return { ...prev, tasks }
        }
        return prev
      })
    } catch (error) {
      console.error('Error loading tasks:', error)
    }
  }

  const getProgress = (projectId) => {
    const project = projects.find((p) => p.id === projectId)
    if (!project) return 0
    const totalTasks = project.taskCount || 0
    const completedTasks = project.completedTaskCount || 0
    if (totalTasks === 0) return 0
    return Math.round((completedTasks / totalTasks) * 100)
  }

  const createProject = async () => {
    try {
      const newProject = await projectService.createProject(projectForm)
      setProjects([...projects, { ...newProject, tasks: [] }])
      setProjectForm({ title: "", description: "" })
      setShowProjectDialog(false)
    } catch (error) {
      console.error('Error creating project:', error)
      alert(error.message || 'Failed to create project')
    }
  }

  const updateProject = async () => {
    if (!editingProject) return
    try {
      const updated = await projectService.updateProject(editingProject.id, projectForm)
      setProjects(projects.map((p) => (p.id === editingProject.id ? { ...p, ...updated } : p)))
      if (selectedProject?.id === editingProject.id) {
        setSelectedProject({ ...selectedProject, ...updated })
      }
      setProjectForm({ title: "", description: "" })
      setEditingProject(null)
      setShowProjectDialog(false)
    } catch (error) {
      console.error('Error updating project:', error)
      alert(error.message || 'Failed to update project')
    }
  }

  const deleteProject = async (id) => {
    try {
      await projectService.deleteProject(id)
      setProjects(projects.filter((p) => p.id !== id))
      if (selectedProject?.id === id) setSelectedProject(null)
    } catch (error) {
      console.error('Error deleting project:', error)
      alert(error.message || 'Failed to delete project')
    }
  }

  const addTask = async () => {
    if (!selectedProject) return
    try {
      const newTask = await taskService.createTask(selectedProject.id, taskForm)

      // Recharger d'abord tous les projets pour avoir les compteurs à jour
      const updatedProjects = await projectService.getAllProjects()

      // Recharger les tâches du projet actuel
      const updatedTasks = await taskService.getAllTasks(selectedProject.id)

      // Mettre à jour l'état des projets avec les nouvelles tâches
      const projectsWithTasks = updatedProjects.map(p => {
        if (p.id === selectedProject.id) {
          return { ...p, tasks: updatedTasks }
        }
        return p
      })

      setProjects(projectsWithTasks)

      // Mettre à jour le projet sélectionné avec les nouvelles tâches
      setSelectedProject(prev => ({
        ...prev,
        tasks: updatedTasks
      }))

      setTaskForm({ title: "", description: "" })
      setShowTaskDialog(false)
    } catch (error) {
      console.error('Error creating task:', error)
      alert(error.message || 'Failed to create task')
    }
  }

  const updateTask = async () => {
    if (!selectedProject || !editingTask) return
    try {
      await taskService.updateTask(selectedProject.id, editingTask.id, taskForm)

      // Recharger d'abord tous les projets pour avoir les compteurs à jour
      const updatedProjects = await projectService.getAllProjects()

      // Recharger les tâches du projet actuel
      const updatedTasks = await taskService.getAllTasks(selectedProject.id)

      // Mettre à jour l'état des projets avec les nouvelles tâches
      const projectsWithTasks = updatedProjects.map(p => {
        if (p.id === selectedProject.id) {
          return { ...p, tasks: updatedTasks }
        }
        return p
      })

      setProjects(projectsWithTasks)

      // Mettre à jour le projet sélectionné avec les nouvelles tâches
      setSelectedProject(prev => ({
        ...prev,
        tasks: updatedTasks
      }))

      setTaskForm({ title: "", description: "" })
      setEditingTask(null)
      setShowTaskDialog(false)
    } catch (error) {
      console.error('Error updating task:', error)
      alert(error.message || 'Failed to update task')
    }
  }

  const toggleTask = async (task) => {
    if (!selectedProject) return
    try {
      await taskService.toggleTaskCompletion(selectedProject.id, task.id, task)

      // Recharger d'abord tous les projets pour avoir les compteurs à jour
      const updatedProjects = await projectService.getAllProjects()

      // Recharger les tâches du projet actuel
      const updatedTasks = await taskService.getAllTasks(selectedProject.id)

      // Mettre à jour l'état des projets avec les nouvelles tâches
      const projectsWithTasks = updatedProjects.map(p => {
        if (p.id === selectedProject.id) {
          return { ...p, tasks: updatedTasks }
        }
        return p
      })

      setProjects(projectsWithTasks)

      // Mettre à jour le projet sélectionné avec les nouvelles tâches
      setSelectedProject(prev => ({
        ...prev,
        tasks: updatedTasks
      }))
    } catch (error) {
      console.error('Error toggling task:', error)
      alert(error.message || 'Failed to toggle task')
    }
  }

  const deleteTask = async (taskId) => {
    if (!selectedProject) return
    try {
      await taskService.deleteTask(selectedProject.id, taskId)

      // Recharger d'abord tous les projets pour avoir les compteurs à jour
      const updatedProjects = await projectService.getAllProjects()

      // Recharger les tâches du projet actuel
      const updatedTasks = await taskService.getAllTasks(selectedProject.id)

      // Mettre à jour l'état des projets avec les nouvelles tâches
      const projectsWithTasks = updatedProjects.map(p => {
        if (p.id === selectedProject.id) {
          return { ...p, tasks: updatedTasks }
        }
        return p
      })

      setProjects(projectsWithTasks)

      // Mettre à jour le projet sélectionné avec les nouvelles tâches
      setSelectedProject(prev => ({
        ...prev,
        tasks: updatedTasks
      }))
    } catch (error) {
      console.error('Error deleting task:', error)
      alert(error.message || 'Failed to delete task')
    }
  }

  const confirmDelete = () => {
    if (deleteType === 'task') {
      deleteTask(deleteId)
    } else if (deleteType === 'project') {
      deleteProject(deleteId)
    }
    setShowDeleteModal(false)
    setDeleteType(null)
    setDeleteId(null)
    setDeleteName('')
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setDeleteType(null)
    setDeleteId(null)
    setDeleteName('')
  }

  const openEditProject = (project) => {
    setEditingProject(project)
    setProjectForm({ title: project.title, description: project.description })
    setShowProjectDialog(true)
  }

  const openEditTask = (task) => {
    setEditingTask(task)
    setTaskForm({ title: task.title, description: task.description || "" })
    setShowTaskDialog(true)
  }

  const handleLogout = () => {
    logout()
    navigate("/signin")
  }

  const currentProject = selectedProject || projects.find((p) => p.id === selectedProject?.id)

  if (loading) {
    return (
      <div className="app-container">
        <Header showLogout={true} onLogout={handleLogout} />
        <div className="empty-state">
          <p className="empty-text">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <Header showLogout={true} onLogout={handleLogout} />
      {/* Header */}
      <div className="app-header mt-6">
        <div className="header-content">
          <div className="header-left">
            {selectedProject && (
              <button type="button" onClick={() => setSelectedProject(null)} className="back-button" title="Back to projects">
                <ChevronRight className="icon-rotate" />
              </button>
            )}
            <div className="header-title-section">
              <h1 className="header-title">{selectedProject ? currentProject?.title : "My Projects"}</h1>
              <p className="header-subtitle">
                {selectedProject ? (
                  <>
                    <CheckCircle2 className="icon-small" />
                    <span>
                      {currentProject?.tasks?.filter((t) => t.completed).length || 0}/{currentProject?.tasks?.length || 0}{" "}
                      tasks
                    </span>
                  </>
                ) : (
                  <>
                    <Folder className="icon-small" />
                    {projects.length} project{projects.length > 1 ? "s" : ""}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button
              type="button"
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
              <span className="button-text">{selectedProject ? "New task" : "New project"}</span>
            </button>
          </div>
        </div>
      </div>

      <main className="main-content">
        {selectedProject && currentProject && (
          <div className="progress-card">
            <div className="progress-header">
              <div className="progress-info">
                  <h2 className="progress-title">Overall Progress</h2>
                <p className="progress-subtitle">
                  {currentProject.tasks?.filter((t) => t.completed).length || 0} out of {currentProject.tasks?.length || 0} tasks
                </p>
              </div>
              <div className="progress-percentage">
                <div className="percentage-value">{getProgress(selectedProject.id)}%</div>
                <p className="percentage-label">Completed</p>
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
              <h3 className="empty-title">No projects yet</h3>
              <p className="empty-text">Start by creating your first project</p>
              <button
                type="button"
                onClick={() => {
                  setProjectForm({ title: "", description: "" })
                  setShowProjectDialog(true)
                }}
                className="primary-button"
              >
                <Plus className="icon" />
                Create a project
              </button>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => {
                const progress = getProgress(project.id)
                const completedTasks = project.completedTaskCount || 0
                const totalTasks = project.taskCount || 0

                return (
                  <div key={project.id} className="project-card" onClick={() => {
                    setSelectedProject(project)
                    loadTasks(project.id)
                  }}>
                    <div className="project-card-header">
                      <div className="project-info">
                        <h3 className="project-title">{project.title}</h3>
                        <p className="project-tasks">
                          <CheckCircle2 className="icon-small" />
                          <span>
                            {totalTasks} task{totalTasks > 1 ? "s" : ""}
                          </span>
                        </p>
                      </div>
                      <ChevronRight className="icon chevron-icon" />
                    </div>

                    {project.description && <p className="project-description">{project.description}</p>}

                    <div className="project-progress">
                      <div className="progress-label">
                        <span>Progress</span>
                        <span className="progress-count">
                          {completedTasks}/{totalTasks}
                        </span>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="progress-badge-container">
                        <span className="progress-badge">{progress}% completed</span>
                      </div>
                    </div>

                    <div className="project-actions">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditProject(project)
                        }}
                        className="action-button edit-button"
                      >
                        <Edit2 className="icon-small" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteType('project')
                          setDeleteId(project.id)
                          setDeleteName(project.title)
                          setShowDeleteModal(true)
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
            {(!currentProject?.tasks || currentProject.tasks.length === 0) ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <CheckCircle2 className="icon-large" />
                </div>
                <h3 className="empty-title">No tasks yet</h3>
                <p className="empty-text">Start by creating your first task for this project</p>
                <button
                  type="button"
                  onClick={() => {
                    setTaskForm({ title: "", description: "" })
                    setShowTaskDialog(true)
                  }}
                  className="primary-button"
                >
                  <Plus className="icon" />
                  Create a task
                </button>
              </div>
            ) : (
              <div className="tasks-list">
                {currentProject.tasks.map((task) => (
                  <div key={task.id} className={`task-card ${task.completed ? "completed" : ""}`}>
                    <div className="task-content">
                      <button type="button" onClick={() => toggleTask(task)} className="task-checkbox">
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
                        <button type="button" onClick={() => openEditTask(task)} className="task-action-button" title="Edit">
                          <Edit2 className="icon-small" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteType('task')
                            setDeleteId(task.id)
                            setDeleteName(task.title)
                            setShowDeleteModal(true)
                          }}
                          className="task-action-button delete"
                          title="Delete"
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


      {showProjectDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <div className="dialog-icon project-icon">
                <Folder className="icon" />
              </div>
              <h2 className="dialog-title">{editingProject ? "Edit project" : "New project"}</h2>
            </div>

            <div className="dialog-content">
              <div className="form-group">
                <label className="form-label">Project title</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="Ex: E-commerce Website"
                  className="form-input"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Describe your project in a few words..."
                  rows={4}
                  className="form-textarea"
                />
              </div>
            </div>

            <div className="dialog-actions">
              <button
                type="button"
                onClick={() => {
                  setShowProjectDialog(false)
                  setEditingProject(null)
                  setProjectForm({ title: "", description: "" })
                }}
                className="secondary-button"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={editingProject ? updateProject : createProject}
                disabled={!projectForm.title.trim()}
                className="primary-button"
              >
                {editingProject ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}


      {showTaskDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <div className="dialog-icon task-icon">
                <CheckCircle2 className="icon" />
              </div>
              <h2 className="dialog-title">{editingTask ? "Edit task" : "New task"}</h2>
            </div>

            <div className="dialog-content">
              <div className="form-group">
                <label className="form-label">Task title</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Ex: Design mockup"
                  className="form-input"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Description <span className="optional-label">(optional)</span>
                </label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Additional details about this task..."
                  rows={4}
                  className="form-textarea"
                />
              </div>
            </div>

            <div className="dialog-actions">
              <button
                type="button"
                onClick={() => {
                  setShowTaskDialog(false)
                  setEditingTask(null)
                  setTaskForm({ title: "", description: "" })
                }}
                className="secondary-button"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={editingTask ? updateTask : addTask}
                disabled={!taskForm.title.trim()}
                className="primary-button"
              >
                {editingTask ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}


      {showDeleteModal && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <div className="dialog-icon delete-icon">
                <Trash2 className="icon" />
              </div>
              <h2 className="dialog-title">Confirm deletion</h2>
            </div>

            <div className="dialog-content">
              <p className="confirmation-message">
                Are you sure you want to delete this {deleteType === 'task' ? 'task' : 'project'} "{deleteName}"?
              </p>
            </div>

            <div className="dialog-actions">
              <button type="button" onClick={cancelDelete} className="secondary-button">
                Cancel
              </button>
              <button type="button" onClick={confirmDelete} className="delete-confirm-button">
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectPage

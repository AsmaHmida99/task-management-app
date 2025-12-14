import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, Folder, CheckCircle2, Circle, ChevronRight, Moon, Sun } from 'lucide-react';

const App = () => {
  const [projects, setProjects] = useState([
    {
      id: '1',
      title: 'Site Web E-commerce',
      description: 'Développement d\'une plateforme de vente en ligne',
      tasks: [
        { id: '1', title: 'Design de la maquette', description: 'Créer les wireframes', completed: true },
        { id: '2', title: 'Développement frontend', description: 'React + Tailwind', completed: true },
        { id: '3', title: 'Intégration API', description: 'Backend REST API', completed: false },
        { id: '4', title: 'Tests utilisateurs', description: '', completed: false }
      ]
    },
    {
      id: '2',
      title: 'Application Mobile',
      description: 'App de gestion de tâches personnelles',
      tasks: [
        { id: '1', title: 'Architecture technique', description: '', completed: true },
        { id: '2', title: 'Interface utilisateur', description: '', completed: false }
      ]
    }
  ]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const [projectForm, setProjectForm] = useState({ title: '', description: '' });
  const [taskForm, setTaskForm] = useState({ title: '', description: '' });

  const getProgress = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || project.tasks.length === 0) return 0;
    const completed = project.tasks.filter(t => t.completed).length;
    return Math.round((completed / project.tasks.length) * 100);
  };

  const createProject = () => {
    const newProject = {
      id: Date.now().toString(),
      title: projectForm.title,
      description: projectForm.description,
      tasks: []
    };
    setProjects([...projects, newProject]);
    setProjectForm({ title: '', description: '' });
    setShowProjectDialog(false);
  };

  const updateProject = () => {
    setProjects(projects.map(p => 
      p.id === editingProject.id 
        ? { ...p, title: projectForm.title, description: projectForm.description }
        : p
    ));
    setProjectForm({ title: '', description: '' });
    setEditingProject(null);
    setShowProjectDialog(false);
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
    if (selectedProject?.id === id) setSelectedProject(null);
  };

  const addTask = () => {
    const newTask = {
      id: Date.now().toString(),
      title: taskForm.title,
      description: taskForm.description,
      completed: false
    };
    setProjects(projects.map(p => 
      p.id === selectedProject.id 
        ? { ...p, tasks: [...p.tasks, newTask] }
        : p
    ));
    setTaskForm({ title: '', description: '' });
    setShowTaskDialog(false);
  };

  const updateTask = () => {
    setProjects(projects.map(p => 
      p.id === selectedProject.id
        ? {
            ...p,
            tasks: p.tasks.map(t => 
              t.id === editingTask.id
                ? { ...t, title: taskForm.title, description: taskForm.description }
                : t
            )
          }
        : p
    ));
    setTaskForm({ title: '', description: '' });
    setEditingTask(null);
    setShowTaskDialog(false);
  };

  const toggleTask = (taskId) => {
    setProjects(projects.map(p => 
      p.id === selectedProject.id
        ? {
            ...p,
            tasks: p.tasks.map(t => 
              t.id === taskId ? { ...t, completed: !t.completed } : t
            )
          }
        : p
    ));
  };

  const deleteTask = (taskId) => {
    setProjects(projects.map(p => 
      p.id === selectedProject.id
        ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId) }
        : p
    ));
  };

  const openEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({ title: project.title, description: project.description });
    setShowProjectDialog(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({ title: task.title, description: task.description });
    setShowTaskDialog(true);
  };

  const currentProject = projects.find(p => p.id === selectedProject?.id);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Folder className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedProject ? currentProject?.title : 'Mes Projets'}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedProject 
                      ? `${currentProject?.tasks.length || 0} tâche${currentProject?.tasks.length > 1 ? 's' : ''}`
                      : `${projects.length} projet${projects.length > 1 ? 's' : ''}`
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {darkMode ? <Sun className="w-5 h-5 text-gray-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
                </button>
                {selectedProject && (
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    ← Retour
                  </button>
                )}
                <button
                  onClick={() => {
                    if (selectedProject) {
                      setTaskForm({ title: '', description: '' });
                      setEditingTask(null);
                      setShowTaskDialog(true);
                    } else {
                      setProjectForm({ title: '', description: '' });
                      setEditingProject(null);
                      setShowProjectDialog(true);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {selectedProject ? 'Nouvelle tâche' : 'Nouveau projet'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          {!selectedProject ? (
            // Projects List
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map(project => {
                const progress = getProgress(project.id);
                const completedTasks = project.tasks.filter(t => t.completed).length;
                
                return (
                  <div
                    key={project.id}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Folder className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {project.tasks.length} tâche{project.tasks.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    </div>
                    
                    {project.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Progression</span>
                        <span className="font-medium">{completedTasks}/{project.tasks.length}</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditProject(project);
                        }}
                        className="flex-1 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Modifier
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Supprimer "${project.title}" ?`)) {
                            deleteProject(project.id);
                          }
                        }}
                        className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Tasks View
            <div className="space-y-6">
              {/* Progress Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-gray-900 dark:text-white">Progression</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {currentProject?.tasks.filter(t => t.completed).length} sur {currentProject?.tasks.length} tâches
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${getProgress(selectedProject.id)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-[3rem] text-right">
                    {getProgress(selectedProject.id)}%
                  </span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {currentProject?.tasks.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Aucune tâche</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Commencez par ajouter votre première tâche</p>
                    <button
                      onClick={() => {
                        setTaskForm({ title: '', description: '' });
                        setShowTaskDialog(true);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter une tâche
                    </button>
                  </div>
                ) : (
                  currentProject?.tasks.map(task => (
                    <div
                      key={task.id}
                      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all group ${
                        task.completed ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="mt-0.5 shrink-0"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${
                            task.completed 
                              ? 'line-through text-gray-500 dark:text-gray-400' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditTask(task)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Supprimer cette tâche ?')) {
                                deleteTask(task.id);
                              }
                            }}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>

        {/* Project Dialog */}
        {showProjectDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="Nom du projet..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Décrivez votre projet..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowProjectDialog(false);
                    setEditingProject(null);
                    setProjectForm({ title: '', description: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={editingProject ? updateProject : createProject}
                  disabled={!projectForm.title.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {editingProject ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Dialog */}
        {showTaskDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    placeholder="Nom de la tâche..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (optionnel)
                  </label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    placeholder="Détails de la tâche..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowTaskDialog(false);
                    setEditingTask(null);
                    setTaskForm({ title: '', description: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={editingTask ? updateTask : addTask}
                  disabled={!taskForm.title.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {editingTask ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
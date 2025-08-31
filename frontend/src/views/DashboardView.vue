<template>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <h1>Personal Life Management System</h1>
      <div class="user-info">
        <div class="user-avatar">M</div>
        <span>Manxia</span>
        <div class="quick-actions">
          <button class="btn btn-secondary" @click="logout">Logout</button>
        </div>
      </div>
    </header>

    <!-- Main Grid -->
    <div class="main-grid">
      <!-- First Row -->
      <div class="first-row">
        <!-- Projects Panel -->
        <div class="panel">
          <div class="panel-header">
            <h2>Projects</h2>
            <button 
              class="btn btn-primary btn-sm" 
              @click="showProjectModal = true"
            >
              + Add
            </button>
          </div>
          <div class="panel-controls">
            <div class="search-group">
              <input 
                v-model="projectSearchTerm"
                type="text" 
                class="search-input" 
                placeholder="Search projects..."
              />
            </div>
            <div class="sort-group">
              <select v-model="projectSortBy" class="sort-select">
                <option value="title">Sort by Title</option>
                <option value="priority">Sort by Priority</option>
                <option value="progress">Sort by Progress</option>
                <option value="status">Sort by Status</option>
                <option value="dueDate">Sort by Due Date</option>
                <option value="category">Sort by Category</option>
              </select>
            </div>
          </div>
          <div class="panel-content">
            <div v-for="project in filteredAndSortedProjects" :key="project.id" class="project-item" :class="{ 'selected-project': project.category === selectedProjectForView }" @click="selectProject(project.category)">
              <div class="project-header">
                <div class="project-title">{{ project.title }}</div>
                <div class="project-actions" @click.stop>
                  <div class="priority-badge" :class="`priority-${project.priority}`" style="margin-right: 8px;">
                    {{ project.priority }}
                  </div>
                  <button 
                    class="action-btn edit-btn" 
                    @click="editProject(project)"
                    title="Edit project"
                  >
                    ✏️
                  </button>
                  <button 
                    class="action-btn delete-btn" 
                    @click="deleteProjectConfirm(project.id)"
                    title="Delete project"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${project.progress}%` }"></div>
              </div>
              <p style="font-size: 13px; color: #718096; margin-top: 8px;">{{ project.description }}</p>
              <div v-if="project.dueDate" style="font-size: 11px; color: #ef4444; margin-top: 5px; display: flex; align-items: center; gap: 4px;">
                <span>📅</span>
                <span>Due: {{ formatDueDate(project.dueDate) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Project Ideas Panel -->
        <div class="panel">
          <div class="panel-header">
            <h2>💡 Ideas</h2>
            <button 
              class="btn btn-primary btn-sm" 
              @click="showCreateIdeaModal = true"
            >
              + Add
            </button>
          </div>
          <div class="panel-controls">
            <div class="search-group">
              <input 
                v-model="projectIdeasSearchTerm"
                type="text" 
                class="search-input" 
                placeholder="Search ideas..."
              />
            </div>
            <div class="sort-group">
              <select v-model="projectIdeasSort" class="sort-select">
                <option value="title">Sort by Title</option>
                <option value="priority">Sort by Priority</option>
                <option value="date">Sort by Date</option>
              </select>
            </div>
          </div>
          
          <!-- Inline Add Idea Form -->
          <div v-if="showProjectIdeaForm" class="add-idea-section">
            <div class="add-idea-form">
              <div class="form-group">
                <input 
                  v-model="newIdea.title"
                  type="text" 
                  class="form-input" 
                  placeholder="What's your idea?"
                  @keypress.enter="addProjectIdea"
                />
              </div>
              <div class="form-group">
                <input 
                  v-model="newIdea.description"
                  type="text" 
                  class="form-input" 
                  placeholder="Brief description (optional)"
                />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <select v-model="newIdea.priority" class="form-select">
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <button 
                  class="btn btn-primary" 
                  @click="addProjectIdea"
                  :disabled="!newIdea.title.trim()"
                  style="flex: 0 0 auto; padding: 0 20px;"
                >
                  ✨ Add
                </button>
              </div>
            </div>
          </div>
          
          <div class="panel-content">
            <div v-if="selectedProjectIdeas.length === 0 && !projectIdeasSearchTerm.trim()" class="no-content">
              <p style="text-align: center; color: #718096; padding: 20px;">
                No ideas for this project yet.
              </p>
            </div>
            <div v-else-if="selectedProjectIdeas.length === 0 && projectIdeasSearchTerm.trim()" class="no-content">
              <p style="text-align: center; color: #718096; padding: 20px;">
                No ideas found matching "{{ projectIdeasSearchTerm }}".
              </p>
            </div>
            <div v-else>
              <div v-for="idea in selectedProjectIdeas" :key="idea.id" class="project-item idea-item">
                <div class="project-header">
                  <div class="project-title">{{ idea.title }}</div>
                  <div class="idea-actions">
                    <div class="priority-badge" :class="`priority-${idea.priority}`" style="margin-right: 8px;">
                      {{ idea.priority }}
                    </div>
                    <button 
                      class="action-btn edit-btn" 
                      @click="editIdea(idea)"
                      title="Edit idea"
                    >
                      ✏️
                    </button>
                    <button 
                      class="action-btn delete-btn" 
                      @click="deleteIdeaConfirm(idea.id)"
                      title="Delete idea"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p style="font-size: 12px; color: #718096;">{{ idea.description }}</p>
                <div style="font-size: 10px; color: #94a3b8; margin-top: 5px;">
                  {{ formatDate(idea.timestamp) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Project Todos Panel -->
        <div class="panel">
          <div class="panel-header">
            <h2>✅ Todos</h2>
            <button 
              class="btn btn-primary btn-sm" 
              @click="showCreateTodoModal = true"
            >
              + Add
            </button>
          </div>
          <div class="panel-controls">
            <div class="search-group">
              <input 
                v-model="projectTodosSearchTerm"
                type="text" 
                class="search-input" 
                placeholder="Search todos..."
              />
            </div>
            <div class="sort-group">
              <select v-model="projectTodosSort" class="sort-select">
                <option value="title">Sort by Title</option>
                <option value="priority">Sort by Priority</option>
                <option value="completed">Sort by Status</option>
                <option value="dueDate">Sort by Due Date</option>
              </select>
            </div>
          </div>
          
          <!-- Inline Add Todo Form -->
          <div v-if="showProjectTodoForm" class="add-todo-section">
            <div class="add-todo-form">
              <div class="form-group">
                <input 
                  v-model="newTodo.title"
                  type="text" 
                  class="form-input" 
                  placeholder="What needs to be done?"
                  @keypress.enter="addProjectTodo"
                />
              </div>
              <div class="form-group">
                <input 
                  v-model="newTodo.description"
                  type="text" 
                  class="form-input" 
                  placeholder="Brief description (optional)"
                />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <select v-model="newTodo.priority" class="form-select">
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div class="form-group">
                  <input 
                    v-model="newTodo.dueDate"
                    type="date" 
                    class="form-input"
                    placeholder="Due date (optional)"
                  />
                </div>
                <button 
                  class="btn btn-primary" 
                  @click="addProjectTodo"
                  :disabled="!newTodo.title.trim()"
                  style="flex: 0 0 auto; padding: 0 20px;"
                >
                  ✅ Add
                </button>
              </div>
            </div>
          </div>
          
          <div class="panel-content">
            <div v-if="selectedProjectTodos.length === 0 && !projectTodosSearchTerm.trim()" class="no-content">
              <p style="text-align: center; color: #718096; padding: 20px;">
                No todos for this project yet.
              </p>
            </div>
            <div v-else-if="selectedProjectTodos.length === 0 && projectTodosSearchTerm.trim()" class="no-content">
              <p style="text-align: center; color: #718096; padding: 20px;">
                No todos found matching "{{ projectTodosSearchTerm }}".
              </p>
            </div>
            <div v-else>
              <div v-for="todo in selectedProjectTodos" :key="todo.id" class="project-item todo-item">
                <div class="project-header">
                  <div class="todo-checkbox">
                    <input 
                      type="checkbox" 
                      :checked="todo.completed"
                      @change="toggleTodoComplete(todo.id)"
                      class="todo-check"
                    />
                  </div>
                  <div class="todo-main-content">
                    <div class="project-title" :class="{ 'completed': todo.completed }">{{ todo.title }}</div>
                    <div class="todo-actions">
                      <div class="priority-badge" :class="`priority-${todo.priority}`" style="margin-right: 8px;">
                        {{ todo.priority }}
                      </div>
                      <div v-if="todo.dueDate" class="todo-due-date" style="margin-right: 8px;">
                        📅 {{ formatDueDate(todo.dueDate) }}
                      </div>
                      <button 
                        class="action-btn edit-btn" 
                        @click="editTodoFromMain(todo)"
                        title="Edit todo"
                      >
                        ✏️
                      </button>
                      <button 
                        class="action-btn delete-btn" 
                        @click="deleteTodoConfirm(todo.id)"
                        title="Delete todo"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
                <p v-if="todo.description" class="todo-description" :class="{ 'completed': todo.completed }">{{ todo.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Second Row -->
      <div class="second-row">
        <!-- Recent Ideas Panel -->
        <div class="panel">
          <div class="panel-header">
            <h2>Recent Ideas (All Projects)</h2>
            <button 
              class="btn btn-primary btn-sm" 
              @click="showCaptureIdeaModal = true"
            >
              + Add
            </button>
          </div>
          <div class="panel-controls">
            <div class="search-group">
              <input 
                v-model="recentIdeasSearchTerm"
                type="text" 
                class="search-input" 
                placeholder="Search ideas..."
              />
            </div>
            <div class="sort-group">
              <select v-model="recentIdeasSort" class="sort-select">
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="priority">Sort by Priority</option>
              </select>
            </div>
          </div>
          <div class="panel-content">
            <div v-if="filteredAndSortedRecentIdeas.length === 0 && !recentIdeasSearchTerm.trim()" class="no-content">
              <p style="text-align: center; color: #718096; padding: 20px;">
                No ideas yet.
              </p>
            </div>
            <div v-else-if="filteredAndSortedRecentIdeas.length === 0 && recentIdeasSearchTerm.trim()" class="no-content">
              <p style="text-align: center; color: #718096; padding: 20px;">
                No ideas found matching "{{ recentIdeasSearchTerm }}".
              </p>
            </div>
            <div v-else>
              <div v-for="idea in filteredAndSortedRecentIdeas" :key="idea.id" class="project-item idea-item">
              <div class="project-header">
                <div class="project-title">{{ idea.title }}</div>
                <div class="idea-actions">
                  <span 
                    v-if="idea.project"
                    :style="getProjectBadgeStyle(idea.project)"
                    style="padding: 2px 8px; border-radius: 8px; font-size: 11px; margin-right: 8px;"
                  >
                    {{ getProjectName(idea.project) }}
                  </span>
                  <div class="priority-badge" :class="`priority-${idea.priority}`" style="margin-right: 8px;">
                    {{ idea.priority }}
                  </div>
                  <button 
                    class="action-btn edit-btn" 
                    @click="editIdea(idea)"
                    title="Edit idea"
                  >
                    ✏️
                  </button>
                  <button 
                    class="action-btn delete-btn" 
                    @click="deleteIdeaConfirm(idea.id)"
                    title="Delete idea"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <p style="font-size: 12px; color: #718096;">{{ idea.description }}</p>
              <div style="font-size: 10px; color: #94a3b8; margin-top: 5px;">
                {{ formatDate(idea.timestamp) }}
              </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Todos Panel -->
        <div class="panel">
          <div class="panel-header">
            <h2>Recent Todos (All Projects)</h2>
            <button 
              class="btn btn-primary btn-sm" 
              @click="showCaptureTodoModal = true"
            >
              + Add
            </button>
          </div>
          <div class="panel-controls">
            <div class="search-group">
              <input 
                v-model="recentTodosSearchTerm"
                type="text" 
                class="search-input" 
                placeholder="Search todos..."
              />
            </div>
            <div class="sort-group">
              <select v-model="recentTodosSort" class="sort-select">
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="priority">Sort by Priority</option>
                <option value="completed">Sort by Status</option>
                <option value="dueDate">Sort by Due Date</option>
              </select>
            </div>
          </div>
          <div class="panel-content">
            <div v-if="filteredAndSortedRecentTodos.length === 0 && !recentTodosSearchTerm.trim()" class="no-content">
              <p style="text-align: center; color: #718096; padding: 20px;">
                No todos yet.
              </p>
            </div>
            <div v-else-if="filteredAndSortedRecentTodos.length === 0 && recentTodosSearchTerm.trim()" class="no-content">
              <p style="text-align: center; color: #718096; padding: 20px;">
                No todos found matching "{{ recentTodosSearchTerm }}".
              </p>
            </div>
            <div v-else>
              <div v-for="todo in filteredAndSortedRecentTodos" :key="todo.id" class="project-item todo-item">
              <div class="project-header">
                <div class="todo-checkbox">
                  <input 
                    type="checkbox" 
                    :checked="todo.completed"
                    @change="toggleTodoComplete(todo.id)"
                    class="todo-check"
                  />
                </div>
                <div class="todo-main-content">
                  <div class="project-title" :class="{ 'completed': todo.completed }">{{ todo.title }}</div>
                  <div class="todo-actions">
                    <span 
                      v-if="todo.project"
                      :style="getProjectBadgeStyle(todo.project)"
                      style="padding: 2px 8px; border-radius: 8px; font-size: 11px; margin-right: 8px;"
                    >
                      {{ getProjectName(todo.project) }}
                    </span>
                    <div class="priority-badge" :class="`priority-${todo.priority}`" style="margin-right: 8px;">
                      {{ todo.priority }}
                    </div>
                    <div v-if="todo.dueDate" class="todo-due-date" style="margin-right: 8px;">
                      📅 {{ formatDueDate(todo.dueDate) }}
                    </div>
                    <button 
                      class="action-btn edit-btn" 
                      @click="editTodoFromMain(todo)"
                      title="Edit todo"
                    >
                      ✏️
                    </button>
                    <button 
                      class="action-btn delete-btn" 
                      @click="deleteTodoConfirm(todo.id)"
                      title="Delete todo"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
              <p v-if="todo.description" class="todo-description" :class="{ 'completed': todo.completed }">{{ todo.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Project Modal -->
    <div v-if="showProjectModal" class="modal" @click.self="showProjectModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Projects</h3>
          <button class="modal-close" @click="showProjectModal = false">&times;</button>
        </div>
        
        <form @submit.prevent="createProject">
          <div class="form-group">
            <label>Project Name</label>
            <input 
              v-model="newProject.title"
              type="text" 
              class="form-input" 
              placeholder="Enter project name"
              required
            />
          </div>
          
          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model="newProject.description"
              class="form-input" 
              rows="3" 
              placeholder="Project description"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Priority</label>
              <select v-model="newProject.priority" class="form-select">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div class="form-group">
              <label>Category</label>
              <select v-model="newProject.category" class="form-select" @change="handleCategoryChange">
                <option value="financial">💰 Financial</option>
                <option value="career">🚀 Career</option>
                <option value="property">🏠 Property</option>
                <option value="health">💪 Health</option>
                <option value="learning">📚 Learning</option>
                <option value="travel">🌍 Travel</option>
                <option value="__custom__">+ Add Custom Category</option>
              </select>
            </div>
          </div>
          
          <div v-if="showCustomCategory" class="form-group">
            <label>Custom Category Name</label>
            <input 
              v-model="customCategoryName"
              type="text" 
              class="form-input" 
              placeholder="Enter category name (e.g., 'hobby', 'family')"
              @input="updateCustomCategory"
            />
          </div>
          
          <div class="form-group">
            <label>Due Date (Optional)</label>
            <input 
              v-model="newProject.dueDate"
              type="date" 
              class="form-input"
            />
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary" 
            style="width: 100%; margin-top: 20px;"
            :disabled="!newProject.title.trim()"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>

    <!-- Edit Idea Modal -->
    <div v-if="showEditIdeaModal" class="modal" @click.self="showEditIdeaModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Edit Idea</h3>
          <button class="modal-close" @click="showEditIdeaModal = false">&times;</button>
        </div>
        
        <form @submit.prevent="saveEditedIdea">
          <div class="form-group">
            <label>Idea Title</label>
            <input 
              v-model="editingIdea.title"
              type="text" 
              class="form-input" 
              placeholder="What's your idea?"
              required
            />
          </div>
          
          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model="editingIdea.description"
              class="form-input" 
              rows="3" 
              placeholder="Brief description (optional)"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Link to Project</label>
              <select v-model="editingIdea.project" class="form-select" @change="handleEditProjectChange">
                <option value="">No project</option>
                <option v-for="project in projectsStore.projects" :key="project.id" :value="project.category">
                  {{ project.title }}
                </option>
                <option value="__create_new__">+ Create New Project</option>
              </select>
            </div>
            <div class="form-group">
              <label>Priority</label>
              <select v-model="editingIdea.priority" class="form-select">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          
          <div class="form-row" style="margin-top: 20px;">
            <button 
              type="button"
              class="btn btn-secondary" 
              @click="showEditIdeaModal = false"
              style="flex: 1;"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              style="flex: 1;"
              :disabled="!editingIdea.title?.trim()"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Project Modal -->
    <div v-if="showEditProjectModal" class="modal" @click.self="showEditProjectModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Projects</h3>
          <button class="modal-close" @click="showEditProjectModal = false">&times;</button>
        </div>
        
        <form @submit.prevent="saveEditedProject">
          <div class="form-group">
            <label>Project Name</label>
            <input 
              v-model="editingProject.title"
              type="text" 
              class="form-input" 
              placeholder="Enter project name"
              required
            />
          </div>
          
          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model="editingProject.description"
              class="form-input" 
              rows="3" 
              placeholder="Project description"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Priority</label>
              <select v-model="editingProject.priority" class="form-select">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div class="form-group">
              <label>Progress (%)</label>
              <input 
                v-model.number="editingProject.progress"
                type="number" 
                min="0" 
                max="100" 
                class="form-input"
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Status</label>
              <select v-model="editingProject.status" class="form-select">
                <option value="idea">Idea</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div class="form-group">
              <label>Due Date (Optional)</label>
              <input 
                v-model="editingProject.dueDate"
                type="date" 
                class="form-input"
              />
            </div>
          </div>
          
          <div class="form-row" style="margin-top: 20px;">
            <button 
              type="button"
              class="btn btn-secondary" 
              @click="showEditProjectModal = false"
              style="flex: 1;"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              style="flex: 1;"
              :disabled="!editingProject.title?.trim()"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Capture Idea Modal -->
    <div v-if="showCaptureIdeaModal" class="modal" @click.self="showCaptureIdeaModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>💡 Capture Idea</h3>
          <button class="modal-close" @click="showCaptureIdeaModal = false">&times;</button>
        </div>
        
        <form @submit.prevent="addIdea">
          <div class="form-group">
            <label>Idea Title</label>
            <input 
              v-model="newIdea.title"
              type="text" 
              class="form-input" 
              placeholder="What's your idea?"
              required
            />
          </div>
          
          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model="newIdea.description"
              class="form-input" 
              rows="3" 
              placeholder="Brief description (optional)"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Link to Project</label>
              <select v-model="newIdea.project" class="form-select" @change="handleProjectChange">
                <option value="">No project</option>
                <option v-for="project in projectsStore.projects" :key="project.id" :value="project.category">
                  {{ project.title }}
                </option>
                <option value="__create_new__">+ Create New Project</option>
              </select>
            </div>
            <div class="form-group">
              <label>Priority</label>
              <select v-model="newIdea.priority" class="form-select">
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          
          <div class="form-row" style="margin-top: 20px;">
            <button 
              type="button"
              class="btn btn-secondary" 
              @click="showCaptureIdeaModal = false"
              style="flex: 1;"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              style="flex: 1;"
              :disabled="!newIdea.title.trim()"
            >
              ✨ Add Idea
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Capture Todo Modal -->
    <div v-if="showCaptureTodoModal" class="modal" @click.self="showCaptureTodoModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>✅ Capture Todo</h3>
          <button class="modal-close" @click="showCaptureTodoModal = false">&times;</button>
        </div>
        
        <form @submit.prevent="addTodo">
          <div class="form-group">
            <label>Todo Title</label>
            <input 
              v-model="newTodo.title"
              type="text" 
              class="form-input" 
              placeholder="What needs to be done?"
              required
            />
          </div>
          
          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model="newTodo.description"
              class="form-input" 
              rows="3" 
              placeholder="Brief description (optional)"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Link to Project</label>
              <select v-model="newTodo.project" class="form-select" @change="handleTodoProjectChange">
                <option value="">No project</option>
                <option v-for="project in projectsStore.projects" :key="project.id" :value="project.category">
                  {{ project.title }}
                </option>
                <option value="__create_new__">+ Create New Project</option>
              </select>
            </div>
            <div class="form-group">
              <label>Priority</label>
              <select v-model="newTodo.priority" class="form-select">
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label>Due Date (Optional)</label>
            <input 
              v-model="newTodo.dueDate"
              type="date" 
              class="form-input"
            />
          </div>
          
          <div class="form-row" style="margin-top: 20px;">
            <button 
              type="button"
              class="btn btn-secondary" 
              @click="showCaptureTodoModal = false"
              style="flex: 1;"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              style="flex: 1;"
              :disabled="!newTodo.title.trim()"
            >
              ✅ Add Todo
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Idea Modal -->
    <div v-if="showCreateIdeaModal" class="modal" @click.self="showCreateIdeaModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Add New Idea</h3>
          <button class="modal-close" @click="showCreateIdeaModal = false">&times;</button>
        </div>
        
        <form @submit.prevent="createProjectIdea">
          <div class="form-group">
            <label>Idea Title</label>
            <input 
              v-model="newIdea.title"
              type="text" 
              class="form-input" 
              placeholder="What's your idea?"
              required
            />
          </div>
          
          <div class="form-group">
            <label>Description (Optional)</label>
            <textarea 
              v-model="newIdea.description"
              class="form-input" 
              rows="3" 
              placeholder="Brief description"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Priority</label>
            <select v-model="newIdea.priority" class="form-select">
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div class="form-row" style="margin-top: 20px;">
            <button 
              type="button"
              class="btn btn-secondary" 
              @click="showCreateIdeaModal = false"
              style="flex: 1;"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              style="flex: 1;"
              :disabled="!newIdea.title.trim()"
            >
              ✨ Add Idea
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Todo Modal -->
    <div v-if="showCreateTodoModal" class="modal" @click.self="showCreateTodoModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Add New Todo</h3>
          <button class="modal-close" @click="showCreateTodoModal = false">&times;</button>
        </div>
        
        <form @submit.prevent="createProjectTodo">
          <div class="form-group">
            <label>Todo Title</label>
            <input 
              v-model="newTodo.title"
              type="text" 
              class="form-input" 
              placeholder="What needs to be done?"
              required
            />
          </div>
          
          <div class="form-group">
            <label>Description (Optional)</label>
            <textarea 
              v-model="newTodo.description"
              class="form-input" 
              rows="3" 
              placeholder="Brief description"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Priority</label>
              <select v-model="newTodo.priority" class="form-select">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div class="form-group">
              <label>Due Date (Optional)</label>
              <input 
                v-model="newTodo.dueDate"
                type="date" 
                class="form-input"
              />
            </div>
          </div>
          
          <div class="form-row" style="margin-top: 20px;">
            <button 
              type="button"
              class="btn btn-secondary" 
              @click="showCreateTodoModal = false"
              style="flex: 1;"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              style="flex: 1;"
              :disabled="!newTodo.title.trim()"
            >
              ✅ Add Todo
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const projectsStore = useProjectsStore()
const authStore = useAuthStore()
const router = useRouter()

const showProjectModal = ref(false)
const showEditIdeaModal = ref(false)
const showEditProjectModal = ref(false)
const showCaptureIdeaModal = ref(false)
const showCaptureTodoModal = ref(false)
const showAddIdeaForm = ref(false)
const showAddTodoForm = ref(false)
const projectCreatedFrom = ref<'idea' | 'edit' | 'todo' | 'none'>('none')
const showCustomCategory = ref(false)
const customCategoryName = ref('')
const projectSearchTerm = ref('')
const projectSortBy = ref('title')
const selectedProject = ref<any>(null)
const selectedProjectForView = ref('financial') // Default to financial project
const projectIdeasSearchTerm = ref('')
const projectIdeasSort = ref('title')
const projectTodosSearchTerm = ref('')
const projectTodosSort = ref('title')
const showProjectIdeaForm = ref(false)
const showProjectTodoForm = ref(false)
const showCreateIdeaModal = ref(false)
const showCreateTodoModal = ref(false)
const recentIdeasSearchTerm = ref('')
const recentIdeasSort = ref('date')
const recentTodosSearchTerm = ref('')
const recentTodosSort = ref('date')

const newIdea = reactive({
  title: '',
  description: '',
  project: '',
  priority: 'medium' as 'high' | 'medium' | 'low'
})

const newTodo = reactive({
  title: '',
  description: '',
  project: '',
  priority: 'medium' as 'high' | 'medium' | 'low',
  dueDate: ''
})

const newProject = reactive({
  title: '',
  description: '',
  priority: 'high' as 'high' | 'medium' | 'low',
  category: 'financial',
  progress: 0,
  status: 'idea' as 'idea' | 'in_progress' | 'completed',
  dueDate: ''
})

const editingIdea = reactive({
  id: '',
  title: '',
  description: '',
  project: '',
  priority: 'medium' as 'high' | 'medium' | 'low'
})

const editingProject = reactive({
  id: '',
  title: '',
  description: '',
  priority: 'high' as 'high' | 'medium' | 'low',
  progress: 0,
  category: '',
  status: 'idea' as 'idea' | 'in_progress' | 'completed',
  dueDate: ''
})

const projectNewIdea = reactive({
  title: '',
  description: '',
  priority: 'medium' as 'high' | 'medium' | 'low'
})

const projectNewTodo = reactive({
  title: '',
  description: '',
  priority: 'medium' as 'high' | 'medium' | 'low',
  dueDate: ''
})

const filteredAndSortedProjects = computed(() => {
  let filtered = projectsStore.projects

  // Filter by search term
  if (projectSearchTerm.value.trim()) {
    const searchLower = projectSearchTerm.value.toLowerCase()
    filtered = filtered.filter(project => 
      project.title.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower) ||
      project.category.toLowerCase().includes(searchLower)
    )
  }

  // Sort projects
  filtered = [...filtered].sort((a, b) => {
    switch (projectSortBy.value) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'priority':
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'progress':
        return b.progress - a.progress
      case 'status':
        const statusOrder = { 'in_progress': 3, 'idea': 2, 'completed': 1 }
        return statusOrder[b.status] - statusOrder[a.status]
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      case 'category':
        return a.category.localeCompare(b.category)
      default:
        return 0
    }
  })

  return filtered
})

const projectIdeas = computed(() => {
  if (!selectedProject.value) return []
  return projectsStore.ideas.filter(idea => idea.project === selectedProject.value.category)
})

const projectTodos = computed(() => {
  if (!selectedProject.value) return []
  return projectsStore.todos.filter(todo => todo.project === selectedProject.value.category)
})

const selectedProjectIdeas = computed(() => {
  let ideas = projectsStore.ideas.filter(idea => idea.project === selectedProjectForView.value)

  // Filter by search term
  if (projectIdeasSearchTerm.value.trim()) {
    const searchLower = projectIdeasSearchTerm.value.toLowerCase()
    ideas = ideas.filter(idea => 
      idea.title.toLowerCase().includes(searchLower) ||
      (idea.description && idea.description.toLowerCase().includes(searchLower))
    )
  }

  // Sort ideas
  ideas = [...ideas].sort((a, b) => {
    switch (projectIdeasSort.value) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'priority':
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'date':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      default:
        return 0
    }
  })

  return ideas
})

const selectedProjectTodos = computed(() => {
  let todos = projectsStore.todos.filter(todo => todo.project === selectedProjectForView.value)

  // Filter by search term
  if (projectTodosSearchTerm.value.trim()) {
    const searchLower = projectTodosSearchTerm.value.toLowerCase()
    todos = todos.filter(todo => 
      todo.title.toLowerCase().includes(searchLower) ||
      (todo.description && todo.description.toLowerCase().includes(searchLower))
    )
  }

  // Sort todos
  todos = [...todos].sort((a, b) => {
    switch (projectTodosSort.value) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'priority':
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'completed':
        return Number(a.completed) - Number(b.completed)
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      default:
        return 0
    }
  })

  return todos
})

const currentProject = computed(() => {
  return projectsStore.projects.find(p => p.category === selectedProjectForView.value)
})

const filteredAndSortedRecentIdeas = computed(() => {
  let ideas = [...projectsStore.ideas]
  
  // Filter by search term
  if (recentIdeasSearchTerm.value.trim()) {
    const searchTerm = recentIdeasSearchTerm.value.toLowerCase()
    ideas = ideas.filter(idea => 
      idea.title.toLowerCase().includes(searchTerm) ||
      (idea.description && idea.description.toLowerCase().includes(searchTerm))
    )
  }
  
  // Sort
  ideas.sort((a, b) => {
    switch (recentIdeasSort.value) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'date':
      default:
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    }
  })
  
  return ideas.slice(0, 10)
})

const filteredAndSortedRecentTodos = computed(() => {
  let todos = [...projectsStore.todos]
  
  // Filter by search term
  if (recentTodosSearchTerm.value.trim()) {
    const searchTerm = recentTodosSearchTerm.value.toLowerCase()
    todos = todos.filter(todo => 
      todo.title.toLowerCase().includes(searchTerm) ||
      (todo.description && todo.description.toLowerCase().includes(searchTerm))
    )
  }
  
  // Sort
  todos.sort((a, b) => {
    switch (recentTodosSort.value) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'completed':
        return Number(a.completed) - Number(b.completed)
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      case 'date':
      default:
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    }
  })
  
  return todos.slice(0, 10)
})

const addIdea = () => {
  if (newIdea.title.trim()) {
    projectsStore.addIdea({
      title: newIdea.title,
      description: newIdea.description,
      project: newIdea.project,
      priority: newIdea.priority
    })
    
    // Reset form
    newIdea.title = ''
    newIdea.description = ''
    newIdea.project = ''
    newIdea.priority = 'medium'
    
    // Close modal if opened from modal
    showCaptureIdeaModal.value = false
  }
}

const createProject = () => {
  if (newProject.title.trim()) {
    const categoryEmojis: Record<string, string> = {
      financial: '💰',
      career: '🚀', 
      property: '🏠',
      health: '💪',
      learning: '📚',
      travel: '🌍'
    }
    
    // Use default emoji for custom categories or the predefined one
    const emoji = categoryEmojis[newProject.category] || '📝'
    const displayTitle = showCustomCategory.value && customCategoryName.value.trim() 
      ? `${emoji} ${newProject.title}`
      : `${emoji} ${newProject.title}`
    
    projectsStore.addProject({
      title: displayTitle,
      description: newProject.description,
      priority: newProject.priority,
      progress: newProject.progress,
      category: newProject.category,
      status: newProject.status,
      dueDate: newProject.dueDate ? new Date(newProject.dueDate) : undefined
    })
    
    // Auto-link the new project to the idea/todo being created/edited
    if (projectCreatedFrom.value === 'idea') {
      newIdea.project = newProject.category
    } else if (projectCreatedFrom.value === 'edit') {
      editingIdea.project = newProject.category
    } else if (projectCreatedFrom.value === 'todo') {
      newTodo.project = newProject.category
    }
    
    // Reset form and close modal
    newProject.title = ''
    newProject.description = ''
    newProject.priority = 'high'
    newProject.category = 'financial'
    newProject.progress = 0
    newProject.status = 'idea'
    newProject.dueDate = ''
    showProjectModal.value = false
    projectCreatedFrom.value = 'none'
    showCustomCategory.value = false
    customCategoryName.value = ''
  }
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDueDate = (date?: Date) => {
  if (!date) return null
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

const getProjectName = (projectCategory?: string) => {
  const project = projectsStore.projects.find(p => p.category === projectCategory)
  return project ? project.title.replace(/^[^\s]+ /, '') : 'Other'
}

const getProjectBadgeStyle = (projectCategory?: string) => {
  const styles: Record<string, string> = {
    financial: 'background: #d1fae5; color: #047857;',
    career: 'background: #dbeafe; color: #1e40af;',
    property: 'background: #fef3c7; color: #92400e;',
    health: 'background: #fecaca; color: #dc2626;',
    learning: 'background: #e5e7eb; color: #374151;',
    travel: 'background: #ddd6fe; color: #7c3aed;'
  }
  // Use default style for custom categories (light blue)
  return projectCategory ? styles[projectCategory] || 'background: #f0f9ff; color: #0369a1;' : styles.financial
}

const editIdea = (idea: any) => {
  editingIdea.id = idea.id
  editingIdea.title = idea.title
  editingIdea.description = idea.description || ''
  editingIdea.project = idea.project || ''
  editingIdea.priority = idea.priority
  showEditIdeaModal.value = true
}

const saveEditedIdea = () => {
  if (editingIdea.title.trim()) {
    projectsStore.updateIdea(editingIdea.id, {
      title: editingIdea.title,
      description: editingIdea.description,
      project: editingIdea.project,
      priority: editingIdea.priority
    })
    showEditIdeaModal.value = false
  }
}

const deleteIdeaConfirm = (ideaId: string) => {
  if (confirm('Are you sure you want to delete this idea?')) {
    projectsStore.deleteIdea(ideaId)
  }
}

const handleProjectChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  if (target.value === '__create_new__') {
    projectCreatedFrom.value = 'idea'
    showProjectModal.value = true
    newIdea.project = ''
  }
}

const handleEditProjectChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  if (target.value === '__create_new__') {
    projectCreatedFrom.value = 'edit'
    showProjectModal.value = true
    editingIdea.project = ''
  }
}

const handleCategoryChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  if (target.value === '__custom__') {
    showCustomCategory.value = true
    customCategoryName.value = ''
  } else {
    showCustomCategory.value = false
    customCategoryName.value = ''
  }
}

const updateCustomCategory = () => {
  if (customCategoryName.value.trim()) {
    // Convert to lowercase and remove spaces for category key
    newProject.category = customCategoryName.value.toLowerCase().replace(/\s+/g, '')
  }
}

const editProject = (project: any) => {
  editingProject.id = project.id
  editingProject.title = project.title.replace(/^[^\s]+ /, '') // Remove emoji prefix
  editingProject.description = project.description
  editingProject.priority = project.priority
  editingProject.progress = project.progress
  editingProject.category = project.category
  editingProject.status = project.status
  editingProject.dueDate = project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : ''
  showEditProjectModal.value = true
}

const saveEditedProject = () => {
  if (editingProject.title.trim()) {
    // Get the original emoji from category
    const categoryEmojis: Record<string, string> = {
      financial: '💰',
      career: '🚀', 
      property: '🏠',
      health: '💪',
      learning: '📚',
      travel: '🌍'
    }
    const emoji = categoryEmojis[editingProject.category] || '📝'
    
    projectsStore.updateProject(editingProject.id, {
      title: `${emoji} ${editingProject.title}`,
      description: editingProject.description,
      priority: editingProject.priority,
      progress: editingProject.progress,
      status: editingProject.status,
      dueDate: editingProject.dueDate ? new Date(editingProject.dueDate) : undefined
    })
    showEditProjectModal.value = false
  }
}

const deleteProjectConfirm = (projectId: string) => {
  if (confirm('Are you sure you want to delete this project? This will also remove all associated ideas.')) {
    // Remove ideas associated with this project
    const project = projectsStore.projects.find(p => p.id === projectId)
    if (project) {
      projectsStore.ideas.filter(idea => idea.project === project.category).forEach(idea => {
        projectsStore.deleteIdea(idea.id)
      })
    }
    // Delete the project
    projectsStore.deleteProject(projectId)
  }
}


const addIdeaToProject = () => {
  if (projectNewIdea.title.trim() && selectedProject.value) {
    projectsStore.addIdea({
      title: projectNewIdea.title,
      description: projectNewIdea.description,
      project: selectedProject.value.category,
      priority: projectNewIdea.priority
    })
    
    // Reset form
    projectNewIdea.title = ''
    projectNewIdea.description = ''
    projectNewIdea.priority = 'medium'
    showAddIdeaForm.value = false
  }
}

const editIdeaFromModal = (idea: any) => {
  editingIdea.id = idea.id
  editingIdea.title = idea.title
  editingIdea.description = idea.description || ''
  editingIdea.project = idea.project || ''
  editingIdea.priority = idea.priority
  showProjectIdeasModal.value = false
  showEditIdeaModal.value = true
}


const addTodoToProject = () => {
  if (projectNewTodo.title.trim() && selectedProject.value) {
    projectsStore.addTodo({
      title: projectNewTodo.title,
      description: projectNewTodo.description,
      project: selectedProject.value.category,
      priority: projectNewTodo.priority,
      completed: false,
      dueDate: projectNewTodo.dueDate ? new Date(projectNewTodo.dueDate) : undefined
    })
    
    // Reset form
    projectNewTodo.title = ''
    projectNewTodo.description = ''
    projectNewTodo.priority = 'medium'
    projectNewTodo.dueDate = ''
    showAddTodoForm.value = false
  }
}

const toggleTodoComplete = (todoId: string) => {
  projectsStore.toggleTodo(todoId)
}

const editTodoFromModal = (todo: any) => {
  // For now, we'll implement a simple alert - can be expanded to a full edit modal later
  const newTitle = prompt('Edit todo title:', todo.title)
  if (newTitle && newTitle.trim() !== todo.title) {
    projectsStore.updateTodo(todo.id, { title: newTitle.trim() })
  }
}

const deleteTodoConfirm = (todoId: string) => {
  if (confirm('Are you sure you want to delete this todo?')) {
    projectsStore.deleteTodo(todoId)
  }
}

const addTodo = () => {
  if (newTodo.title.trim()) {
    projectsStore.addTodo({
      title: newTodo.title,
      description: newTodo.description,
      project: newTodo.project,
      priority: newTodo.priority,
      completed: false,
      dueDate: newTodo.dueDate ? new Date(newTodo.dueDate) : undefined
    })
    
    // Reset form
    newTodo.title = ''
    newTodo.description = ''
    newTodo.project = ''
    newTodo.priority = 'medium'
    newTodo.dueDate = ''
    
    // Close modal if opened from modal
    showCaptureTodoModal.value = false
  }
}

const handleTodoProjectChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  if (target.value === '__create_new__') {
    projectCreatedFrom.value = 'todo'
    showProjectModal.value = true
    newTodo.project = ''
  }
}

const editTodoFromMain = (todo: any) => {
  // For now, we'll implement a simple alert - can be expanded to a full edit modal later
  const newTitle = prompt('Edit todo title:', todo.title)
  if (newTitle && newTitle.trim() !== todo.title) {
    projectsStore.updateTodo(todo.id, { title: newTitle.trim() })
  }
}

const selectProject = (projectCategory: string) => {
  selectedProjectForView.value = projectCategory
}

const addProjectIdea = () => {
  if (newIdea.title.trim()) {
    projectsStore.addIdea({
      title: newIdea.title,
      description: newIdea.description,
      project: selectedProjectForView.value,
      priority: newIdea.priority
    })
    
    // Reset form
    newIdea.title = ''
    newIdea.description = ''
    newIdea.priority = 'medium'
    showProjectIdeaForm.value = false
  }
}

const addProjectTodo = () => {
  if (newTodo.title.trim()) {
    projectsStore.addTodo({
      title: newTodo.title,
      description: newTodo.description,
      project: selectedProjectForView.value,
      priority: newTodo.priority,
      completed: false,
      dueDate: newTodo.dueDate ? new Date(newTodo.dueDate) : undefined
    })
    
    // Reset form
    newTodo.title = ''
    newTodo.description = ''
    newTodo.priority = 'medium'
    newTodo.dueDate = ''
    showProjectTodoForm.value = false
  }
}

const createProjectIdea = () => {
  if (newIdea.title.trim()) {
    projectsStore.addIdea({
      title: newIdea.title,
      description: newIdea.description,
      project: selectedProjectForView.value,
      priority: newIdea.priority
    })
    
    // Reset form and close modal
    newIdea.title = ''
    newIdea.description = ''
    newIdea.priority = 'medium'
    showCreateIdeaModal.value = false
  }
}

const createProjectTodo = () => {
  if (newTodo.title.trim()) {
    projectsStore.addTodo({
      title: newTodo.title,
      description: newTodo.description,
      project: selectedProjectForView.value,
      priority: newTodo.priority,
      completed: false,
      dueDate: newTodo.dueDate ? new Date(newTodo.dueDate) : undefined
    })
    
    // Reset form and close modal
    newTodo.title = ''
    newTodo.description = ''
    newTodo.priority = 'medium'
    newTodo.dueDate = ''
    showCreateTodoModal.value = false
  }
}
</script>
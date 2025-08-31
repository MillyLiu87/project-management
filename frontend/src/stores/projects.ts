import { defineStore } from 'pinia'

export interface Project {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  progress: number
  category: string
  externalLink?: string
  status: 'idea' | 'in_progress' | 'completed'
  dueDate?: Date
}

export interface Idea {
  id: string
  title: string
  description?: string
  project?: string
  priority: 'high' | 'medium' | 'low'
  category?: string
  timestamp: Date
}

export interface Todo {
  id: string
  title: string
  description?: string
  project: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  dueDate?: Date
  timestamp: Date
}

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [
      {
        id: '1',
        title: '💰 Financial Independence',
        description: '目标：年净利润1000万，10套房产被动收入',
        priority: 'high',
        progress: 65,
        category: 'financial',
        status: 'in_progress'
      },
      {
        id: '2',
        title: '🚀 AI/Tech Career Growth',
        description: '成为顶级AI专家，加入量化/半导体公司',
        priority: 'high',
        progress: 75,
        category: 'career',
        status: 'in_progress'
      },
      {
        id: '3',
        title: '🏠 Dutch Property Investment',
        description: '首套房€300K-359K，目标2026年2月',
        priority: 'high',
        progress: 45,
        category: 'property',
        status: 'in_progress'
      },
      {
        id: '4',
        title: '💪 Health & Fitness Excellence',
        description: '健康饮食，规律运动，参加比基尼比赛',
        priority: 'medium',
        progress: 80,
        category: 'health',
        status: 'in_progress'
      }
    ] as Project[],

    ideas: [
      {
        id: '1',
        title: 'AI产品开发自动化',
        description: '一个月发布一个AI产品，建立MVP测试流程',
        project: 'financial',
        priority: 'high',
        category: 'automation',
        timestamp: new Date()
      },
      {
        id: '2',
        title: '量化投资策略研究',
        description: '学习量化交易，为进入量化公司做准备',
        project: 'financial',
        priority: 'high',
        category: 'investment',
        timestamp: new Date()
      }
    ] as Idea[],

    todos: [
      {
        id: '1',
        title: '研究量化交易平台',
        description: '调研主流量化交易平台的功能和费用',
        project: 'financial',
        completed: false,
        priority: 'high',
        timestamp: new Date()
      },
      {
        id: '2',
        title: '完成简历更新',
        description: '添加最新的AI项目经验',
        project: 'career',
        completed: true,
        priority: 'medium',
        timestamp: new Date()
      },
      {
        id: '3',
        title: '预约看房',
        description: '联系房产经纪人安排看房时间',
        project: 'property',
        completed: false,
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        timestamp: new Date()
      }
    ] as Todo[]
  }),

  actions: {
    addProject(project: Omit<Project, 'id'>) {
      const newProject: Project = {
        ...project,
        id: Date.now().toString()
      }
      this.projects.push(newProject)
    },

    addIdea(idea: Omit<Idea, 'id' | 'timestamp'>) {
      const newIdea: Idea = {
        ...idea,
        id: Date.now().toString(),
        timestamp: new Date()
      }
      this.ideas.push(newIdea)
    },

    updateIdea(id: string, updates: Partial<Idea>) {
      const index = this.ideas.findIndex(i => i.id === id)
      if (index !== -1) {
        this.ideas[index] = { ...this.ideas[index], ...updates }
      }
    },

    deleteIdea(id: string) {
      const index = this.ideas.findIndex(i => i.id === id)
      if (index !== -1) {
        this.ideas.splice(index, 1)
      }
    },

    updateProject(id: string, updates: Partial<Project>) {
      const index = this.projects.findIndex(p => p.id === id)
      if (index !== -1) {
        this.projects[index] = { ...this.projects[index], ...updates }
      }
    },

    deleteProject(id: string) {
      const index = this.projects.findIndex(p => p.id === id)
      if (index !== -1) {
        this.projects.splice(index, 1)
      }
    },

    addTodo(todo: Omit<Todo, 'id' | 'timestamp'>) {
      const newTodo: Todo = {
        ...todo,
        id: Date.now().toString(),
        timestamp: new Date()
      }
      this.todos.push(newTodo)
    },

    updateTodo(id: string, updates: Partial<Todo>) {
      const index = this.todos.findIndex(t => t.id === id)
      if (index !== -1) {
        this.todos[index] = { ...this.todos[index], ...updates }
      }
    },

    deleteTodo(id: string) {
      const index = this.todos.findIndex(t => t.id === id)
      if (index !== -1) {
        this.todos.splice(index, 1)
      }
    },

    toggleTodo(id: string) {
      const index = this.todos.findIndex(t => t.id === id)
      if (index !== -1) {
        this.todos[index].completed = !this.todos[index].completed
      }
    }
  }
})
const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all todos for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, title, description, project_category, completed, priority, 
              due_date, created_at, updated_at
       FROM todos 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.user.userId]
    );

    res.json({
      todos: result.rows
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({
      error: 'Failed to fetch todos',
      message: 'Internal server error'
    });
  }
});

// Get todos by project category
router.get('/project/:category', authenticateToken, async (req, res) => {
  try {
    const { category } = req.params;
    
    const result = await query(
      `SELECT id, title, description, project_category, completed, priority, 
              due_date, created_at, updated_at
       FROM todos 
       WHERE user_id = $1 AND project_category = $2
       ORDER BY completed ASC, created_at DESC`,
      [req.user.userId, category]
    );

    res.json({
      todos: result.rows
    });
  } catch (error) {
    console.error('Error fetching todos by project:', error);
    res.status(500).json({
      error: 'Failed to fetch todos',
      message: 'Internal server error'
    });
  }
});

// Get a single todo by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      `SELECT id, title, description, project_category, completed, priority, 
              due_date, created_at, updated_at
       FROM todos 
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Todo not found',
        message: 'Todo does not exist or you do not have permission to access it'
      });
    }

    res.json({
      todo: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({
      error: 'Failed to fetch todo',
      message: 'Internal server error'
    });
  }
});

// Create a new todo
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      project_category,
      completed = false,
      priority = 'medium',
      due_date
    } = req.body;

    // Validate required fields
    if (!title || !project_category) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Title and project_category are required'
      });
    }

    // Validate priority
    if (!['high', 'medium', 'low'].includes(priority)) {
      return res.status(400).json({
        error: 'Invalid priority',
        message: 'Priority must be high, medium, or low'
      });
    }

    const result = await query(
      `INSERT INTO todos (user_id, title, description, project_category, completed, priority, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, description, project_category, completed, priority, 
                 due_date, created_at, updated_at`,
      [
        req.user.userId,
        title,
        description,
        project_category,
        completed,
        priority,
        due_date
      ]
    );

    res.status(201).json({
      message: 'Todo created successfully',
      todo: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({
      error: 'Failed to create todo',
      message: 'Internal server error'
    });
  }
});

// Update a todo
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      project_category,
      completed,
      priority,
      due_date
    } = req.body;

    // Check if todo exists and belongs to user
    const existingTodo = await query(
      'SELECT id FROM todos WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (existingTodo.rows.length === 0) {
      return res.status(404).json({
        error: 'Todo not found',
        message: 'Todo does not exist or you do not have permission to update it'
      });
    }

    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }
    if (project_category !== undefined) {
      updateFields.push(`project_category = $${paramCount}`);
      values.push(project_category);
      paramCount++;
    }
    if (completed !== undefined) {
      updateFields.push(`completed = $${paramCount}`);
      values.push(completed);
      paramCount++;
    }
    if (priority !== undefined) {
      updateFields.push(`priority = $${paramCount}`);
      values.push(priority);
      paramCount++;
    }
    if (due_date !== undefined) {
      updateFields.push(`due_date = $${paramCount}`);
      values.push(due_date);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'No fields to update',
        message: 'At least one field must be provided for update'
      });
    }

    // Add WHERE clause parameters
    values.push(id, req.user.userId);

    const updateQuery = `
      UPDATE todos 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING id, title, description, project_category, completed, priority, 
                due_date, created_at, updated_at
    `;

    const result = await query(updateQuery, values);

    res.json({
      message: 'Todo updated successfully',
      todo: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({
      error: 'Failed to update todo',
      message: 'Internal server error'
    });
  }
});

// Toggle todo completion status
router.patch('/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `UPDATE todos 
       SET completed = NOT completed
       WHERE id = $1 AND user_id = $2
       RETURNING id, title, description, project_category, completed, priority, 
                 due_date, created_at, updated_at`,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Todo not found',
        message: 'Todo does not exist or you do not have permission to update it'
      });
    }

    res.json({
      message: 'Todo status toggled successfully',
      todo: result.rows[0]
    });
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).json({
      error: 'Failed to toggle todo',
      message: 'Internal server error'
    });
  }
});

// Delete a todo
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Todo not found',
        message: 'Todo does not exist or you do not have permission to delete it'
      });
    }

    res.json({
      message: 'Todo deleted successfully',
      deletedId: result.rows[0].id
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({
      error: 'Failed to delete todo',
      message: 'Internal server error'
    });
  }
});

module.exports = router;
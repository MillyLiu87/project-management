const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all projects for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, title, description, priority, progress, category, 
              external_link, status, due_date, created_at, updated_at
       FROM projects 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.user.userId]
    );

    res.json({
      projects: result.rows
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      error: 'Failed to fetch projects',
      message: 'Internal server error'
    });
  }
});

// Get a single project by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      `SELECT id, title, description, priority, progress, category, 
              external_link, status, due_date, created_at, updated_at
       FROM projects 
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Project not found',
        message: 'Project does not exist or you do not have permission to access it'
      });
    }

    res.json({
      project: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      error: 'Failed to fetch project',
      message: 'Internal server error'
    });
  }
});

// Create a new project
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      priority = 'medium',
      progress = 0,
      category,
      external_link,
      status = 'idea',
      due_date
    } = req.body;

    // Validate required fields
    if (!title || !category) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Title and category are required'
      });
    }

    // Validate enum values
    if (!['high', 'medium', 'low'].includes(priority)) {
      return res.status(400).json({
        error: 'Invalid priority',
        message: 'Priority must be high, medium, or low'
      });
    }

    if (!['idea', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be idea, in_progress, or completed'
      });
    }

    const result = await query(
      `INSERT INTO projects (user_id, title, description, priority, progress, 
                            category, external_link, status, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, title, description, priority, progress, category, 
                 external_link, status, due_date, created_at, updated_at`,
      [
        req.user.userId,
        title,
        description,
        priority,
        progress,
        category,
        external_link,
        status,
        due_date
      ]
    );

    res.status(201).json({
      message: 'Project created successfully',
      project: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      error: 'Failed to create project',
      message: 'Internal server error'
    });
  }
});

// Update a project
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      priority,
      progress,
      category,
      external_link,
      status,
      due_date
    } = req.body;

    // Check if project exists and belongs to user
    const existingProject = await query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (existingProject.rows.length === 0) {
      return res.status(404).json({
        error: 'Project not found',
        message: 'Project does not exist or you do not have permission to update it'
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
    if (priority !== undefined) {
      updateFields.push(`priority = $${paramCount}`);
      values.push(priority);
      paramCount++;
    }
    if (progress !== undefined) {
      updateFields.push(`progress = $${paramCount}`);
      values.push(progress);
      paramCount++;
    }
    if (category !== undefined) {
      updateFields.push(`category = $${paramCount}`);
      values.push(category);
      paramCount++;
    }
    if (external_link !== undefined) {
      updateFields.push(`external_link = $${paramCount}`);
      values.push(external_link);
      paramCount++;
    }
    if (status !== undefined) {
      updateFields.push(`status = $${paramCount}`);
      values.push(status);
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
      UPDATE projects 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING id, title, description, priority, progress, category, 
                external_link, status, due_date, created_at, updated_at
    `;

    const result = await query(updateQuery, values);

    res.json({
      message: 'Project updated successfully',
      project: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      error: 'Failed to update project',
      message: 'Internal server error'
    });
  }
});

// Delete a project
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Project not found',
        message: 'Project does not exist or you do not have permission to delete it'
      });
    }

    res.json({
      message: 'Project deleted successfully',
      deletedId: result.rows[0].id
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      error: 'Failed to delete project',
      message: 'Internal server error'
    });
  }
});

module.exports = router;
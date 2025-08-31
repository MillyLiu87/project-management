const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all ideas for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, title, description, project_category, priority, category, 
              created_at, updated_at
       FROM ideas 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.user.userId]
    );

    res.json({
      ideas: result.rows
    });
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({
      error: 'Failed to fetch ideas',
      message: 'Internal server error'
    });
  }
});

// Get ideas by project category
router.get('/project/:category', authenticateToken, async (req, res) => {
  try {
    const { category } = req.params;
    
    const result = await query(
      `SELECT id, title, description, project_category, priority, category, 
              created_at, updated_at
       FROM ideas 
       WHERE user_id = $1 AND project_category = $2
       ORDER BY created_at DESC`,
      [req.user.userId, category]
    );

    res.json({
      ideas: result.rows
    });
  } catch (error) {
    console.error('Error fetching ideas by project:', error);
    res.status(500).json({
      error: 'Failed to fetch ideas',
      message: 'Internal server error'
    });
  }
});

// Get a single idea by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      `SELECT id, title, description, project_category, priority, category, 
              created_at, updated_at
       FROM ideas 
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Idea not found',
        message: 'Idea does not exist or you do not have permission to access it'
      });
    }

    res.json({
      idea: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching idea:', error);
    res.status(500).json({
      error: 'Failed to fetch idea',
      message: 'Internal server error'
    });
  }
});

// Create a new idea
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      project_category,
      priority = 'medium',
      category
    } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Title is required'
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
      `INSERT INTO ideas (user_id, title, description, project_category, priority, category)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, description, project_category, priority, category, 
                 created_at, updated_at`,
      [
        req.user.userId,
        title,
        description,
        project_category,
        priority,
        category
      ]
    );

    res.status(201).json({
      message: 'Idea created successfully',
      idea: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating idea:', error);
    res.status(500).json({
      error: 'Failed to create idea',
      message: 'Internal server error'
    });
  }
});

// Update an idea
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      project_category,
      priority,
      category
    } = req.body;

    // Check if idea exists and belongs to user
    const existingIdea = await query(
      'SELECT id FROM ideas WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (existingIdea.rows.length === 0) {
      return res.status(404).json({
        error: 'Idea not found',
        message: 'Idea does not exist or you do not have permission to update it'
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
    if (priority !== undefined) {
      updateFields.push(`priority = $${paramCount}`);
      values.push(priority);
      paramCount++;
    }
    if (category !== undefined) {
      updateFields.push(`category = $${paramCount}`);
      values.push(category);
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
      UPDATE ideas 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING id, title, description, project_category, priority, category, 
                created_at, updated_at
    `;

    const result = await query(updateQuery, values);

    res.json({
      message: 'Idea updated successfully',
      idea: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating idea:', error);
    res.status(500).json({
      error: 'Failed to update idea',
      message: 'Internal server error'
    });
  }
});

// Delete an idea
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM ideas WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Idea not found',
        message: 'Idea does not exist or you do not have permission to delete it'
      });
    }

    res.json({
      message: 'Idea deleted successfully',
      deletedId: result.rows[0].id
    });
  } catch (error) {
    console.error('Error deleting idea:', error);
    res.status(500).json({
      error: 'Failed to delete idea',
      message: 'Internal server error'
    });
  }
});

module.exports = router;
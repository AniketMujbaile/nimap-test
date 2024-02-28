const pool = require('../config/db');

const categoryController = {
  getAllCategories: async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM categories');
      res.json(rows);
    } catch (error) {
      console.error('Error getting categories:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getCategoryById: async (req, res) => {
    const categoryId = req.params.id;
    try {
      const { rows } = await pool.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error('Error getting category by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  createCategory: async (req, res) => {
    const { name } = req.body;
    try {
      const { rows } = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  updateCategory: async (req, res) => {
    const categoryId = req.params.id;
    const { name } = req.body;
    try {
      const { rows } = await pool.query('UPDATE categories SET name = $1 WHERE id = $2 RETURNING *', [name, categoryId]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  deleteCategory: async (req, res) => {
    const categoryId = req.params.id;
    try {
      const { rows } = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [categoryId]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = categoryController;

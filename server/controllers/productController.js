const pool = require('../config/db');

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const startIndex = (page - 1) * pageSize;
      
      const queryResult = await pool.query(
        'SELECT p.id, p.name AS product_name, p.category_id, c.name AS category_name FROM products p INNER JOIN categories c ON p.category_id = c.id ORDER BY p.id LIMIT $1 OFFSET $2',
        [pageSize, startIndex]
      );
      
      const products = queryResult.rows;
      
      const totalCountQuery = await pool.query('SELECT COUNT(*) FROM products');
      const totalCount = parseInt(totalCountQuery.rows[0].count);
      
      res.json({ products, totalCount });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getProductById: async (req, res) => {
    const productId = req.params.id;
    try {
      const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error('Error getting product by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  createProduct: async (req, res) => {
    const { name, category_id } = req.body;
    try {
      const { rows } = await pool.query('INSERT INTO products (name, category_id) VALUES ($1, $2) RETURNING *', [name, category_id]);
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  updateProduct: async (req, res) => {
    const productId = req.params.id;
    const { name, category_id } = req.body;
    try {
      const { rows } = await pool.query('UPDATE products SET name = $1, category_id = $2 WHERE id = $3 RETURNING *', [name, category_id, productId]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  deleteProduct: async (req, res) => {
    const productId = parseInt(req.params.id);  
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    try {
      const { rows } = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [productId]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },    
};

module.exports = productController;

 
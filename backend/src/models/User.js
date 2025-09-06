const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  // Create a new user
  static async create(userData) {
    try {
      const { name, email, password, role = 'member' } = userData;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [result] = await pool.execute(
        'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM Users WHERE email = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(userId) {
    try {
      console.log('Finding user with ID:', userId);
      
      // Try with uppercase table name first
      try {
        const [rows] = await pool.execute(
          'SELECT user_id, name, email, password, role, created_at FROM Users WHERE user_id = ?',
          [userId]
        );
        console.log('User query result:', rows);
        return rows[0];
      } catch (upperCaseError) {
        console.error('Error querying with uppercase table name:', upperCaseError);
        
        // If that fails, try with lowercase table name
        const [rows] = await pool.execute(
          'SELECT user_id, name, email, password, role, created_at FROM users WHERE user_id = ?',
          [userId]
        );
        console.log('User query result (lowercase):', rows);
        return rows[0];
      }
    } catch (error) {
      console.error('Error in User.findById:', error);
      throw error;
    }
  }

  // Update user
  static async update(userId, userData) {
    try {
      const { name, email } = userData;
      const [result] = await pool.execute(
        'UPDATE Users SET name = ?, email = ? WHERE user_id = ?',
        [name, email, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Update password
  static async updatePassword(userId, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const [result] = await pool.execute(
        'UPDATE Users SET password = ? WHERE user_id = ?',
        [hashedPassword, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Check if password is valid
  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Get all users
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT user_id, name, email, role, created_at FROM Users'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
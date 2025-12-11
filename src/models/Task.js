import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  start_date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  is_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
  // Foreign keys (project_id, assigned_to_id (User)) handled in associations
  // Note: Django 'User' model is not being strictly replicated as a custom model here yet, 
  // but if needed we can stub it or link to an auth table later. 
  // For now I'll adding assigned_to as integer or ignore if User model is not part of this specific scope.
  // Django's `User` is built-in. I will assume for now we might need a User model if authentication is required.
  // The plan didn't explicitly list User model, but Task uses it. I will add a placeholder User model or just an ID field.
}, {
  tableName: 'api_task',
  underscored: true,
  timestamps: false
});

export default Task;

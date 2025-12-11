import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Cost = sequelize.define('Cost', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
  // Foreign key (project_id) handled in associations
}, {
  tableName: 'api_cost',
  underscored: true,
  timestamps: false
});

export default Cost;

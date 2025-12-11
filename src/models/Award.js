import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Award = sequelize.define('Award', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  venue: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  awarded_by: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  }
  // Foreign key (project_id) handled in associations
}, {
  tableName: 'api_award',
  underscored: true,
  timestamps: false
});

export default Award;

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SentEmail = sequelize.define('SentEmail', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  to: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: true
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('contact', 'compose'),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'api_sentemail',
  underscored: true,
  timestamps: false
});

export default SentEmail;

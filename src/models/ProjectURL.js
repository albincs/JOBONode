import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ProjectURL = sequelize.define('ProjectURL', {
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isUrl: true }
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
  // Foreign key (project_id) handled in associations
}, {
  tableName: 'api_projecturl',
  underscored: true,
  timestamps: false
});

export default ProjectURL;

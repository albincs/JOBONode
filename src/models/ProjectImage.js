import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ProjectImage = sequelize.define('ProjectImage', {
  image: {
    type: DataTypes.STRING, // Path to image
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
  // Foreign key (project_id) handled in associations
}, {
  tableName: 'api_projectimage',
  underscored: true,
  timestamps: false
});

export default ProjectImage;

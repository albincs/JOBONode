import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import slugify from 'slugify';

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT, // HTMLField in Django -> TEXT in various DBs with HTML content
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
  cost_estimation: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  is_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  uploaded_images_cache: {
    type: DataTypes.JSON,
    allowNull: true
  }
  // Foreign keys (category_id, client_id) handled in associations
}, {
  tableName: 'api_project',
  underscored: true,
  timestamps: false
});

Project.beforeSave(async (project) => {
  if (!project.slug && project.title) {
    project.slug = slugify(project.title, { lower: true, strict: true });
  }
});

export default Project;

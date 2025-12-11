import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import slugify from 'slugify';

const ProjectCategory = sequelize.define('ProjectCategory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  // parent_id will be handled by associations
}, {
  tableName: 'api_projectcategory',
  underscored: true,
  timestamps: false,
});

// Hook to auto-generate slug
ProjectCategory.beforeSave(async (category) => {
  if (!category.slug && category.name) {
    category.slug = slugify(category.name, { lower: true, strict: true });
  }
});

export default ProjectCategory;

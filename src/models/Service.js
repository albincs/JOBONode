import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import slugify from 'slugify';

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  meta_description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  meta_keywords: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'api_service',
  underscored: true,
  timestamps: false
});

Service.beforeSave(async (service) => {
  if (!service.slug && service.title) {
    service.slug = slugify(service.title, { lower: true, strict: true });
  }
});

export default Service;

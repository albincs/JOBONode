import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import slugify from 'slugify';

const CmsTable = sequelize.define('CmsTable', {
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
  whatwedo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'api_cmstable',
  underscored: true,
  timestamps: false
});

CmsTable.beforeSave(async (cmsTable) => {
  if (!cmsTable.slug && cmsTable.title) {
    cmsTable.slug = slugify(cmsTable.title, { lower: true, strict: true });
  }
});

export default CmsTable;

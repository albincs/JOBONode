import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import slugify from 'slugify';

const AboutUs = sequelize.define('AboutUs', {
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
  youtube_link: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { isUrl: true }
  },
  started_year: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'api_aboutus',
  underscored: true,
  timestamps: false
});

AboutUs.beforeSave(async (about) => {
  if (!about.slug && about.title) {
    about.slug = slugify(about.title, { lower: true, strict: true });
  }
});

export default AboutUs;

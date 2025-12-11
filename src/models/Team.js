import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Team = sequelize.define('Team', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: true
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  facebook: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { isUrl: true }
  },
  twitter: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { isUrl: true }
  },
  instagram: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { isUrl: true }
  },
  linkedin: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { isUrl: true }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  district: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  image: {
    type: DataTypes.STRING, // Path to image
    allowNull: true
  }
}, {
  tableName: 'api_team', // Match Django table name if possible, or just default. Django usually uses app_model.
  // Django default: api_team
  underscored: true,
  timestamps: false // Django models didn't show auto_now_add for these fields explicitly other than custom ones, but usually Django adds them? The code didn't show created_at/updated_at for Team.
});

export default Team;

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(128),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(254),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  first_name: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_staff: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_superuser: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  date_joined: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Custom role field for Node.js app logic (Admin, Staff, Moderator)
  // We will map:
  // Admin -> is_superuser=1 or role='admin'
  // Staff -> is_staff=1 or role='staff'
  // Moderator -> role='moderator'
  role: {
    type: DataTypes.ENUM('admin', 'staff', 'moderator', 'user'), // 'user' for default logic
    defaultValue: 'user'
  }
}, {
  tableName: 'auth_user', // Mapping to existing Django table
  underscored: true,
  timestamps: false // Django manages dates manually or via auto_now, we mapped date_joined
});

export default User;

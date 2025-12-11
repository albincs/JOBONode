import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CmsTableImage = sequelize.define('CmsTableImage', {
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
  // Foreign key (cmstable_id) handled in associations
}, {
  tableName: 'api_cmstableimage',
  underscored: true,
  timestamps: false
});

export default CmsTableImage;

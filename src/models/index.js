import ProjectCategory from './ProjectCategory.js';
import Client from './Client.js';
import Testimonial from './Testimonial.js';
import Team from './Team.js';
import Project from './Project.js';
import ProjectImage from './ProjectImage.js';
import ProjectURL from './ProjectURL.js';
import Task from './Task.js';
import Cost from './Cost.js';
import CmsTable from './CmsTable.js';
import CmsTableImage from './CmsTableImage.js';
import Service from './Service.js';
import AboutUs from './AboutUs.js';
import Award from './Award.js';
import Contact from './Contact.js';
import User from './User.js';
import SentEmail from './SentEmail.js';

// Project Category Associations (Self-referential)
ProjectCategory.belongsTo(ProjectCategory, { as: 'parent_category', foreignKey: 'parent_id' });
ProjectCategory.hasMany(ProjectCategory, { as: 'subcategories', foreignKey: 'parent_id' });

// Project Associations
Project.belongsTo(ProjectCategory, { foreignKey: 'category_id', as: 'project_category' });
ProjectCategory.hasMany(Project, { foreignKey: 'category_id', as: 'projects' });

Project.belongsTo(Client, { foreignKey: 'client_id', as: 'project_client' });
Client.hasMany(Project, { foreignKey: 'client_id', as: 'projects' });

Project.hasMany(ProjectImage, { foreignKey: 'project_id', as: 'images' });
ProjectImage.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

Project.hasMany(ProjectURL, { foreignKey: 'project_id', as: 'urls' });
ProjectURL.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

Project.hasMany(Task, { foreignKey: 'project_id', as: 'tasks' });
Task.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

Project.hasMany(Cost, { foreignKey: 'project_id', as: 'costs' });
Cost.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

Project.hasMany(Award, { foreignKey: 'project_id', as: 'awards' });
Award.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

// CmsTable Associations
CmsTable.hasMany(CmsTableImage, { foreignKey: 'cmstable_id', as: 'images' });
CmsTableImage.belongsTo(CmsTable, { foreignKey: 'cmstable_id', as: 'cmstable' });

export {
  ProjectCategory,
  Client,
  Testimonial,
  Team,
  Project,
  ProjectImage,
  ProjectURL,
  Task,
  Cost,
  CmsTable,
  CmsTableImage,
  Service,
  AboutUs,
  Award,
  Contact,
  User,
  SentEmail
};

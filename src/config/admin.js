import AdminJS, { ComponentLoader } from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSSequelize from '@adminjs/sequelize';
import uploadFeature from '@adminjs/upload';
import { LocalProvider } from '@adminjs/upload';
import { User, Project, Team, Client, Testimonial, ProjectCategory, CmsTable, Service, AboutUs, Award, Contact, Task, Cost, ProjectImage, CmsTableImage } from '../models/index.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

AdminJS.registerAdapter(AdminJSSequelize);

const componentLoader = new ComponentLoader();

const UPLOAD_COMPONENTS_DIR = path.resolve(__dirname, '../../node_modules/@adminjs/upload/build/features/upload-file/components');

componentLoader.add('UploadEditComponent', path.join(UPLOAD_COMPONENTS_DIR, 'UploadEditComponent.js'));
componentLoader.add('UploadListComponent', path.join(UPLOAD_COMPONENTS_DIR, 'UploadListComponent.js'));
componentLoader.add('UploadShowComponent', path.join(UPLOAD_COMPONENTS_DIR, 'UploadShowComponent.js'));

// Common actions configuration for Drawer Mode
const drawerActions = {
  edit: { showInDrawer: true },
  show: { showInDrawer: true },
  delete: { showInDrawer: true },
  new: { showInDrawer: true }
};

// Helper for local upload feature - Requires componentLoader in v7+
const localUploadFeature = (properties) => uploadFeature({
  provider: { local: { bucket: 'public/uploads', opts: { baseUrl: '/uploads' } } },
  properties: properties,
  validation: { mimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'] },
  componentLoader
});


// Helper to verify Django password (reused from authController logic)
const verifyDjangoPassword = (password, storedHash) => {
  const parts = storedHash.split('$');
  if (parts.length !== 4) return false;
  const algorithm = parts[0];
  const iterations = parseInt(parts[1], 10);
  const salt = parts[2];
  const hash = parts[3];
  if (algorithm !== 'pbkdf2_sha256') return false;
  const key = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
  return key.toString('base64') === hash;
};

// Hook to process multiple images uploaded to Project
const processProjectImages = async (response, request, context) => {
  const { record } = response;
  
  if (record && record.params && record.params.uploaded_images_cache) {
    const images = record.params.uploaded_images_cache;
    // Handle both single string (if 1 file) or array
    const imagePaths = Array.isArray(images) ? images : [images];

    for (const imagePath of imagePaths) {
      if (imagePath) {
        await ProjectImage.create({
          project_id: record.id,
          image: imagePath,
          uploadedFile: imagePath // redundant but safe if key varies
        });
      }
    }
  }
  return response;
  return response;
};

// Hook to process multiple images uploaded to CmsTable
const processCmsTableImages = async (response, request, context) => {
  const { record } = response;
  
  if (record && record.params && record.params.uploaded_images_cache) {
    const images = record.params.uploaded_images_cache;
    const imagePaths = Array.isArray(images) ? images : [images];

    for (const imagePath of imagePaths) {
      if (imagePath) {
        await CmsTableImage.create({
          cmstable_id: record.id,
          image: imagePath,
          uploadedFile: imagePath
        });
      }
    }
  }
  return response;
};

const adminJs = new AdminJS({
  componentLoader,
  databases: [], // We use resources instead
  resources: [
    { 
      resource: User, 
      options: { 
        listProperties: ['email', 'username', 'role', 'is_active', 'is_staff'],
        properties: { 
          id: { isVisible: { list: false, show: true, edit: false, filter: true } },
          email: { isTitle: true, position: 1 },
          username: { position: 2 },
          role: { position: 3 },
          is_active: { 
            position: 4,
            components: {
              list: 'Badge', 
            }
          },
          is_staff: { position: 5 },
          password: { isVisible: { list: false, show: false, edit: true, filter: false }, type: 'password' },
          first_name: { isVisible: { list: false, show: true, edit: true, filter: false } },
          last_name: { isVisible: { list: false, show: true, edit: true, filter: false } },
        },
        actions: drawerActions,
        navigation: { name: 'User Management', icon: 'User' }
      } 
    },
    { 
      resource: Project, 
      options: { 
        listProperties: ['title', 'slug', 'start_date', 'end_date', 'is_completed'],
        properties: { 
          id: { isVisible: { list: false, show: true, edit: false, filter: true } },
          title: { isTitle: true, position: 1 },
          slug: { position: 2, isVisible: { list: true, show: true, edit: false, filter: true, new: false } },
          description: { 
            type: 'richtext',
            isVisible: { list: false, show: true, edit: true, filter: false }
          },
          start_date: { position: 3, type: 'date' },
          end_date: { position: 4, type: 'date' },
          is_completed: { position: 5 },
          cost_estimation: { position: 6 },
          client_id: { isVisible: { list: false, show: true, edit: true, filter: true } },
          category_id: { isVisible: { list: false, show: true, edit: true, filter: true } },
          // Reference to ProjectImages
          // Reference to ProjectImages
          images: {
            isVisible: { list: false, show: true, edit: true, filter: false },
            position: 10
          },
          // Partial for Multi-Upload
          uploaded_images_cache: { isVisible: false },
          new_images: { isVisible: { list: false, show: false, edit: true, filter: false }, position: 11 }
        },
        actions: {
          ...drawerActions,
          new: { ...drawerActions.new, after: processProjectImages },
          edit: { ...drawerActions.edit, after: processProjectImages }
        },
        navigation: { name: 'Projects', icon: 'Folder' }
      },
      features: [
        localUploadFeature({ 
          key: 'uploaded_images_cache', 
          file: 'new_images',
          multiple: true
        })
      ] 
    },
    { 
      resource: Team, 
      options: { 
        listProperties: ['uploadedImage', 'name', 'designation', 'email', 'phone_number'],
        properties: { 
          id: { isVisible: { list: false, show: true, edit: false, filter: true } },
          image: { isVisible: false }, // Handled by upload feature
          uploadedImage: { isVisible: { list: true, show: true, edit: true, filter: false }, position: 1 },
          name: { isTitle: true, position: 2 },
          designation: { position: 3 },
          email: { position: 4, type: 'email' },
          phone_number: { position: 5 },
          qualification: { isVisible: { list: false, show: true, edit: true, filter: false } }
        },
        actions: drawerActions,
        navigation: { name: 'Company', icon: 'Users' }
      },
      features: [localUploadFeature({ key: 'image', file: 'uploadedImage' })]
    },
    { 
      resource: Client, 
      options: { 
        listProperties: ['logo', 'name', 'email', 'phone'],
        properties: { 
          id: { isVisible: { list: false, show: true, edit: false, filter: true } },
          logo: { isVisible: false },
          uploadedLogo: { isVisible: { list: true, show: true, edit: true, filter: false }, position: 1 },
          name: { isTitle: true, position: 2 },
          email: { position: 3, type: 'email' },
          phone: { position: 4 }
        },
        actions: drawerActions,
        navigation: { name: 'Company', icon: 'Briefcase' }
      },
      features: [localUploadFeature({ key: 'logo', file: 'uploadedLogo' })]
    },
    { 
      resource: Testimonial, 
      options: { 
        listProperties: ['photo', 'name', 'role', 'created_at'],
        properties: { 
          id: { isVisible: { list: false, show: true, edit: false, filter: true } },
          photo: { isVisible: false },
          uploadedPhoto: { isVisible: { list: true, show: true, edit: true, filter: false }, position: 1 },
          name: { isTitle: true, position: 2 },
          role: { position: 3 },
          testimonial: { 
            type: 'richtext',
            isVisible: { list: false, show: true, edit: true, filter: false }
          },
          created_at: { position: 4, type: 'datetime' }
        },
        actions: drawerActions,
        navigation: { name: 'Company', icon: 'MessageSquare' }
      },
      features: [localUploadFeature({ key: 'photo', file: 'uploadedPhoto' })]
    },
    { 
      resource: ProjectCategory, 
      options: { 
        listProperties: ['name', 'slug', 'parent_id'],
        properties: { 
          id: { isVisible: { list: false, show: true, edit: false, filter: true } },
          name: { isTitle: true, position: 1 },
          slug: { position: 2, isVisible: { list: true, show: true, edit: false, filter: true, new: false } },
          parent_id: { position: 3 }
        },
        actions: drawerActions,
        navigation: { name: 'Projects', icon: 'Tag' }
      } 
    },
    { 
      resource: CmsTable, 
      options: { 
        listProperties: ['title', 'slug', 'created_at'],
        properties: { 
          id: { isVisible: { list: false, show: true, edit: false, filter: true } },
          title: { isTitle: true, position: 1 },
          slug: { position: 2 },
          description: { 
            type: 'richtext',
            isVisible: { list: false, show: true, edit: true, filter: false }
          },
          created_at: { position: 3, type: 'datetime' },
          image: { isVisible: { list: false, show: true, edit: true, filter: false } },
          // Reference to CmsTableImages
          images: {
            isVisible: { list: false, show: true, edit: true, filter: false },
            position: 10
          },
          // Partial for Multi-Upload
          uploaded_images_cache: { isVisible: false },
          new_images: { isVisible: { list: false, show: false, edit: true, filter: false }, position: 11 }
        },
        actions: {
          ...drawerActions,
          new: { ...drawerActions.new, after: processCmsTableImages },
          edit: { ...drawerActions.edit, after: processCmsTableImages }
        },
        navigation: { name: 'Content', icon: 'FileText' }
      },
      features: [
        localUploadFeature({ 
          key: 'uploaded_images_cache', 
          file: 'new_images',
          multiple: true
        })
      ] 
    },
    { 
      resource: Service, 
      options: { 
        listProperties: ['image', 'title', 'slug', 'created_at'],
        properties: { 
          id: { isVisible: { list: false, show: true, edit: false, filter: true } },
          image: { isVisible: false },
          uploadedImage: { isVisible: { list: true, show: true, edit: true, filter: false }, position: 1 },
          title: { isTitle: true, position: 2 },
          slug: { position: 3 },
          description: { 
            type: 'richtext',
            isVisible: { list: false, show: true, edit: true, filter: false }
          },
          created_at: { position: 4, type: 'datetime' }
        },
        actions: drawerActions,
        navigation: { name: 'Content', icon: 'Box' }
      },
      features: [localUploadFeature({ key: 'image', file: 'uploadedImage' })]
    },
    { 
      resource: AboutUs, 
      options: { 
        listProperties: ['title', 'slug', 'created_at'],
        properties: { 
          id: { isVisible: { list: false, show: true, edit: false, filter: true } },
          title: { isTitle: true, position: 1 },
          slug: { position: 2 },
          description: { 
            type: 'richtext',
            isVisible: { list: false, show: true, edit: true, filter: false }
          },
          created_at: { position: 3, type: 'datetime' }
        },
        actions: drawerActions,
        navigation: { name: 'Content', icon: 'Info' }
      } 
    },
    { 
      resource: Award, 
      options: { 
        listProperties: ['image', 'title', 'date', 'awarded_by', 'venue'],
        properties: { 
          id: { isVisible: { list: false, show: true, edit: false, filter: true } },
          image: { isVisible: false },
          uploadedImage: { isVisible: { list: true, show: true, edit: true, filter: false }, position: 1 },
          title: { isTitle: true, position: 2 },
          date: { position: 3, type: 'date' },
          awarded_by: { position: 4 },
          venue: { position: 5 },
          description: { 
            type: 'richtext',
            isVisible: { list: false, show: true, edit: true, filter: false }
          }
        },
        actions: drawerActions,
        navigation: { name: 'Company', icon: 'Award' }
      },
      features: [localUploadFeature({ key: 'image', file: 'uploadedImage' })] 
    },
    { 
      resource: Contact, 
      options: { 
        listProperties: ['email', 'name', 'phone_number', 'created_at'],
        properties: { 
          id: { isVisible: { list: false, show: true, edit: false, filter: true } },
          email: { isTitle: true, position: 1, type: 'email' },
          name: { position: 2 },
          phone_number: { position: 3 },
          message: { 
            type: 'richtext',
            isVisible: { list: false, show: true, edit: false, filter: false }
          },
          created_at: { position: 4, type: 'datetime' }
        },
        actions: drawerActions,
        navigation: { name: 'Communications', icon: 'Mail' }
      } 
    },
    { 
      resource: Task, 
      options: { 
        listProperties: ['name', 'project_id', 'created_at'],
        properties: { 
          id: { isVisible: { list: false, show: true, edit: false, filter: true } },
          name: { isTitle: true, position: 1 },
          project_id: { position: 2 },
          description: { 
            type: 'richtext',
            isVisible: { list: false, show: true, edit: true, filter: false }
          },
          created_at: { position: 3, type: 'datetime' }
        },
        actions: drawerActions,
        navigation: { name: 'Projects', icon: 'CheckSquare' }
      } 
    },
    { 
      resource: Cost, 
      options: { 
        listProperties: ['name', 'amount', 'project_id'],
        properties: { 
          id: { isVisible: { list: false, show: true, edit: false, filter: true } },
          name: { isTitle: true, position: 1 },
          amount: { position: 2, type: 'currency' },
          project_id: { position: 3 },
          description: { 
            type: 'richtext',
            isVisible: { list: false, show: true, edit: true, filter: false }
          }
        },
        actions: drawerActions,
        navigation: { name: 'Projects', icon: 'DollarSign' }
      } 
    },
    {
      resource: ProjectImage,
      options: {
        listProperties: ['uploadedFile', 'project_id', 'created_at'],
        properties: {
          id: { isVisible: { list: false, show: true, edit: false, filter: true } },
          image: { isVisible: false },
          uploadedFile: { isVisible: { list: true, show: true, edit: true, filter: false }, position: 1 },
          project_id: { position: 2 },
          created_at: { position: 3, type: 'datetime' }
        },
        actions: drawerActions,
        navigation: { name: 'Projects', icon: 'Image' }
      },
      features: [localUploadFeature({ key: 'image', file: 'uploadedFile' })]
    },
    {
      resource: CmsTableImage,
      options: {
        listProperties: ['uploadedFile', 'cmstable_id', 'order'],
        properties: {
          id: { isVisible: { list: false, show: true, edit: false, filter: true } },
          image: { isVisible: false }, // Handled by upload feature
          uploadedFile: { isVisible: { list: true, show: true, edit: true, filter: false }, position: 1 },
          cmstable_id: { position: 2 },
          order: { position: 3 }
        },
        actions: drawerActions,
        navigation: { name: 'Content', icon: 'Image' }
      },
      features: [localUploadFeature({ key: 'image', file: 'uploadedFile' })]
    }
  ],
  rootPath: '/admin',
  branding: {
    companyName: 'Jobo Structurals',
    withMadeWithLove: false,
  },
  assets: {
    styles: [
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
    ], 
    scripts: [] 
  },
  locale: {
    translations: {
      actions: {
        bulkDelete: 'Delete Selected',
      },
      buttons: {
        filter: 'Filter Projects'
      }
    },
  },
});

import session from 'express-session';
import connectSequelize from 'connect-session-sequelize';
import sequelize from './database.js'; // Import sequelize instance

const SequelizeStore = connectSequelize(session.Store);

const sessionStore = new SequelizeStore({
  db: sequelize,
});

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    try {
      const user = await User.findOne({ 
        where: { email: email } 
      }) || await User.findOne({ where: { username: email } });

      if (user) {
        let isMatch = false;
        if (user.password.startsWith('pbkdf2_sha256$')) {
            isMatch = verifyDjangoPassword(password, user.password);
        } else {
            isMatch = await bcrypt.compare(password, user.password);
        }

        if (isMatch) {
            if (user.is_staff || user.is_superuser || user.role === 'admin' || user.role === 'staff') {
                 return user;
            }
        }
      }
      return false;
    } catch (e) {
        console.error(e);
        return false;
    }
  },
  cookiePassword: 'super-secret-cookie-password-replace-this',
  cookieName: 'adminjs',
}, null, {
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  secret: 'super-secret-session-key'
});

// Sync the session store table
sessionStore.sync();

export { adminJs, adminRouter };

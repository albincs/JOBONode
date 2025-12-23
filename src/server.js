import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import sequelize from "./config/database.js";

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

import routes from "./routes/index.js";
import dashboardRoutes from "./routes/dashboard.js";
// import swaggerUi from 'swagger-ui-express';
// import swaggerSpecs from './config/swagger.js';
import { adminJs, adminRouter } from './config/admin.js';

app.use(cors());
app.use(adminJs.options.rootPath, adminRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('static'));
app.use('/uploads', express.static('public/uploads'));


// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/api', routes);
app.use('/api/dashboard', dashboardRoutes);

// Serve standalone dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// Serve Angular Static Files
const frontendPath = path.join(__dirname, '../public/frontend');
app.use(express.static(frontendPath));

// Handle Angular Routing (Catch-all) - Must be AFTER API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/admin')) {
      return res.status(404).json({ error: 'Not Found' });
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
    
    // Sync models (disable in production if using migrations)
    // await sequelize.sync({ alter: true }); 
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export const handler = serverless(app);

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    startServer();
}

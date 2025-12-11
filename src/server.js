import express from "express";
import cors from "cors";
import sequelize from "./config/database.js";

const app = express();
const PORT = process.env.PORT || 3000;

import routes from "./routes/index.js";
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

// Health check
app.get("/", (req, res) => {
  res.send("Jobo Backend API is running");
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

startServer();

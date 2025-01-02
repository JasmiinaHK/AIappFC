const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
require('dotenv').config();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Windsurfing App API',
      version: '1.0.0',
      description: 'API documentation for the Windsurfing App',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
  },
  apis: [path.join(__dirname, 'index.js')], // Full path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

console.log('Starting server...');
console.log('Environment variables loaded:', {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Set' : 'Not set',
  PORT: process.env.PORT || 3001
});

const app = express();

// Debug middleware to log all requests
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} completed in ${duration}ms`);
  });
  
  next();
});

// Enable all CORS requests
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API information and available endpoints
 *     responses:
 *       200:
 *         description: List of available endpoints
 */
app.get('/', (req, res) => {
  res.json({ 
    message: 'Windsurfing App API',
    endpoints: {
      materials: '/api/materials',
      materialsByCategory: '/api/materials/category/:categoryId',
      tasks: '/api/tasks',
      health: '/api/health',
      docs: '/api-docs'
    }
  });
});

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health
 *     responses:
 *       200:
 *         description: API is healthy
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// In-memory storage
let materials = [];
let tasks = [];

const generateTaskContent = async (task) => {
  // For now, return a placeholder content
  return `Sample content for ${task.materialType} in ${task.subject} for grade ${task.grade}`;
};

/**
 * @swagger
 * /api/materials:
 *   get:
 *     summary: Get all materials
 *     responses:
 *       200:
 *         description: List of all materials
 *   post:
 *     summary: Create a new material
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Material created successfully
 */
app.get('/api/materials', (req, res) => {
  res.json(materials);
});

/**
 * @swagger
 * /api/materials/category/{categoryId}:
 *   get:
 *     summary: Get materials by category
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of materials in the category
 */
app.get('/api/materials/category/:categoryId', (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  const categoryMaterials = materials.filter(material => material.categoryId === categoryId);
  res.json(categoryMaterials);
});

app.post('/api/materials', (req, res) => {
  const material = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  materials.push(material);
  res.status(201).json(material);
});

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get tasks by email
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tasks for the user
 *   post:
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userEmail
 *             properties:
 *               userEmail:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 */
app.get('/api/tasks', (req, res) => {
  console.log('[GET /api/tasks] Getting tasks, query:', req.query);
  try {
    const userEmail = req.query.email;
    if (!userEmail) {
      console.log('[GET /api/tasks] No email provided');
      return res.status(400).json({ error: 'Email parameter is required' });
    }
    const userTasks = tasks.filter(task => task.userEmail === userEmail);
    console.log('[GET /api/tasks] Found tasks:', userTasks);
    res.json(userTasks);
  } catch (error) {
    console.error('[GET /api/tasks] Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', (req, res) => {
  console.log('[POST /api/tasks] Creating task:', req.body);
  try {
    const task = {
      id: uuidv4(),
      ...req.body,
      content: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(task);
    console.log('[POST /api/tasks] Task created:', task);
    res.status(201).json(task);
  } catch (error) {
    console.error('[POST /api/tasks] Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

/**
 * @swagger
 * /api/tasks/{id}/generate:
 *   post:
 *     summary: Generate content for a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content generated successfully
 *       404:
 *         description: Task not found
 */
app.post('/api/tasks/:id/generate', async (req, res) => {
  console.log('[POST /api/tasks/:id/generate] Generating content for task:', req.params.id);
  try {
    const taskId = req.params.id;
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      console.log('[POST /api/tasks/:id/generate] Task not found:', taskId);
      return res.status(404).json({ error: 'Task not found' });
    }

    const content = await generateTaskContent(task);
    task.content = content;
    task.updatedAt = new Date().toISOString();
    
    console.log('[POST /api/tasks/:id/generate] Content generated');
    res.json(task);
  } catch (error) {
    console.error('[POST /api/tasks/:id/generate] Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
app.delete('/api/tasks/:id', (req, res) => {
  console.log('[DELETE /api/tasks/:id] Deleting task:', req.params.id);
  try {
    const taskId = req.params.id;
    const index = tasks.findIndex(task => task.id === taskId);
    
    if (index === -1) {
      console.log('[DELETE /api/tasks/:id] Task not found:', taskId);
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const deletedTask = tasks.splice(index, 1)[0];
    console.log('[DELETE /api/tasks/:id] Task deleted:', deletedTask);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('[DELETE /api/tasks/:id] Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API Documentation: http://localhost:${port}/api-docs`);
  console.log(`Test the server: http://localhost:${port}/api/health`);
});

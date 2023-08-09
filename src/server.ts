// src/server.ts
import express, { Request, Response } from 'express';
import { allRoutes } from './routes';

const app = express();
const port = 5000; // Puedes cambiar el número del puerto si lo deseas

// Middleware
app.use(express.json({ limit: '50mb' }));

// Your router

app.get('/', (req: Request, res: Response) => {
  res.send('¡Hello World!');
});

// Mount the router on a specific path (e.g., "/api")
app.use('/api', allRoutes);

app.listen(port, () => {
  console.log(`Servidor API iniciado en http://localhost:${port}`);
});

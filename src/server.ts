// src/server.ts
import express, { Request, Response } from 'express';

const app = express();
const port = 5000; // Puedes cambiar el número del puerto si lo deseas

// Middleware
app.use(express.json({ limit: '50mb' }));

// Your router
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('¡Hola, mundo!');
});

// Mount the router on a specific path (e.g., "/api")
app.use('/api', router);

app.listen(port, () => {
  console.log(`Servidor API iniciado en http://localhost:${port}`);
});

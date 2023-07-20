import express from "express";

const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));

// Your router
const router = express.Router();

router.get("/", (req, res) => res.send("hola"));

// Mount the router on a specific path (e.g., "/api")
app.use("/api", router);

app.listen(3000, () => console.log(`Server listening on port 3000`));

export default app;

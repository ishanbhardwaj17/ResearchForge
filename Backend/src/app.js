import express from 'express';
import cors from 'cors';
import researchRoutes from './routes/researchRoutes.js';
import testRoute from './routes/testRoute.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use("/api/test", testRoute);
app.use("/api/research", researchRoutes);

app.get("/api/health", async (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is healthy",
    });
});

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "Research MVP backend is running",
    });
});

export default app;

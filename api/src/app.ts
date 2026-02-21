import express from 'express';
import { env } from './config/env';
import cors from 'cors'
import { ErrorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';


const app = express();

//Middleware
app.use(express.json())
app.use(cors(
    {
        origin: env.clientUrl,
        credentials: true,
    }
))
app.use(ErrorHandler);
app.listen(env.port, () =>{
    logger.info(`🚀 Server running on http://localhost:${env.port}`);
})
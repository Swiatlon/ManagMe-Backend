/// <reference types="./@types/express" />
import 'reflect-metadata';
import 'tsconfig-paths/register';
import { AppDataSource } from './configs/database';
import cors from 'cors';
import corsOptions from './configs/cors';
import errorHandler from './middlewares/errorHandler/ErrorHandler';
import express from 'express';
import authRoutes from 'routes/auth.Routes';
import cookieParser from 'cookie-parser';
import { searchMiddleware } from 'middlewares/requests/Search.Middleware';
import { paginationMiddleware } from 'middlewares/requests/Pagination.Middleware';
import { selectFieldsMiddleware } from 'middlewares/requests/SelectFields.Middleware';
import { cleanupRequestContextMiddleware } from 'middlewares/requests/CleanupRequestContext.Middleware';

const app = express();
const PORT = process.env.PORT ?? 3000;

// EXTERNAL MIDDLEWARES
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// PRE-ROUTES MIDLEWARES
app.use(cleanupRequestContextMiddleware);
app.use(paginationMiddleware);
app.use(searchMiddleware);
app.use(selectFieldsMiddleware);

// ROUTES
app.use('/api/auth', authRoutes);

// POST-ROUTES MIDLEWARES
app.use(errorHandler);

// SERVER
AppDataSource.initialize()
    .then(async () => {
        console.log('Succesfully connected to DB!');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log('Error when connecting to database!');
        console.log(error);
    });

export default app;

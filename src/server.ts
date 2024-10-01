import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import morgan from 'morgan';
import { corsConfig } from './config/cors';
import newsRoutes from './routes/newsRoutes';
import roleRoutes from './routes/roleRoutes';
import authRoutes from './routes/authRoutes';
import assetsRequestRoutes from './routes/assetsRequestRoutes';
import departmentRoutes from './routes/departmentRoutes';
import pca_docsRoutes from './routes/pca_docsRoutes';
import roomsRoutes from './routes/roomsRoutes';
import path from 'path';

dotenv.config()

const app = express()

app.use(morgan('dev'))

app.use(express.json())
app.use('/news/files', express.static(path.join(process.cwd(), "../uploads/news/files")))
app.use('/profile/photo', express.static(path.join(process.cwd(), "../uploads/profile/images")))
app.use('/PCA_Docs/Documents', express.static(path.join(process.cwd(), '../uploads/PCA_Docs/PCA_Docs_local/Documents')));
app.use('/PCA_Docs/Request', express.static(path.join(process.cwd(), '../uploads/PCA_Docs/PCA_Docs_local/Document_change_requests')));
app.use('/PCA_Docs/Documents/share', express.static(path.join(process.cwd(), '../uploads/PCA_Docs/PCA_Docs_Share/Documents')));
app.use('/assets/device', express.static(path.join(process.cwd(), '../uploads/assetsRequest/devicePhotos')));
app.use('/assets/documents', express.static(path.join(process.cwd(), '../uploads/assetsRequest/documents')));
app.use(cors(corsConfig))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/role', roleRoutes)
app.use('/api/department', departmentRoutes)
//app.use('/api/requestDevice', departmentRoutes)
app.use('/api/assetsRequest', assetsRequestRoutes)
app.use('/api/PCA_Docs', pca_docsRoutes)
app.use('/api/rooms', roomsRoutes)
app.get("/", (req, res) => {
    res.send("Hello Word!")
})

export default app


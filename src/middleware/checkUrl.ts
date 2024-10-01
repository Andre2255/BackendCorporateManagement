import fs from 'fs';
import type { Request, Response, NextFunction } from 'express'

export async function checkProfileUrl(req: Request, res: Response, next: NextFunction) {
  const path = '../uploads/profile/images';

  try {
    await fs.promises.access(path);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // La ruta no existe, crearla
      await fs.promises.mkdir(path, { recursive: true });
    } else {
      throw error;
    }
  }
  next()
}

export async function checknewsFilesUrl(req: Request, res: Response, next: NextFunction) {
  const path = '../uploads/news/files';

  try {
    await fs.promises.access(path);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // La ruta no existe, crearla
      await fs.promises.mkdir(path, { recursive: true });
    } else {
      throw error;
    }
  }
  next()
}

export async function checkpcaDocsFilesUrl(req: Request, res: Response, next: NextFunction) {
  const path = '../uploads/PCA_Docs/PCA_Docs_local/preDocs';
  try {
    await fs.promises.access(path);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // La ruta no existe, crearla
      await fs.promises.mkdir(path, { recursive: true });
    } else {
      throw error;
    }
  }

  const path2 = '../uploads/PCA_Docs/PCA_Docs_local/Documents';
  try {
    await fs.promises.access(path2);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // La ruta no existe, crearla
      await fs.promises.mkdir(path2, { recursive: true });
    } else {
      throw error;
    }
  }

  const path3 = '../uploads/PCA_Docs/PCA_Docs_Share/preDocs';
  try {
    await fs.promises.access(path3);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // La ruta no existe, crearla
      await fs.promises.mkdir(path3, { recursive: true });
    } else {
      throw error;
    }
  }

  const path4 = '../uploads/PCA_Docs/PCA_Docs_Share/Documents';
  try {
    await fs.promises.access(path4);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // La ruta no existe, crearla
      await fs.promises.mkdir(path4, { recursive: true });
    } else {
      throw error;
    }
  }

  const path5 = '../uploads/PCA_Docs/PCA_Docs_local/Document_change_requests';
  try {
    await fs.promises.access(path5);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // La ruta no existe, crearla
      await fs.promises.mkdir(path5, { recursive: true });
    } else {
      throw error;
    }
  }
  next()
}

export async function checkassetFilesUrl(req: Request, res: Response, next: NextFunction) {
  const path = '../uploads/assetsRequest/devicePhotos';

  try {
    await fs.promises.access(path);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // La ruta no existe, crearla
      await fs.promises.mkdir(path, { recursive: true });
    } else {
      throw error;
    }
  }
  next()
}
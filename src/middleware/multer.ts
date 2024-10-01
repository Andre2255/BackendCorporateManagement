import multer, { StorageEngine } from 'multer';


type DestinationCallback = (error: Error | null, destination: string) => void;
type FilenameCallback = (error: Error | null, filename: string) => void;


// Configuración para la subida de imágenes de perfil
const profileFilesStorage: StorageEngine = multer.diskStorage({
  destination: (req: Express.Request, file: Express.Multer.File, cb: DestinationCallback): void => {
    cb(null, '../uploads/profile/images');
  },
  filename: (req: Express.Request, file: Express.Multer.File, cb: FilenameCallback): void => {
    const utf8Filename = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, `${Date.now()}-${utf8Filename}`);
  }
});

const newsFilesStorage: StorageEngine = multer.diskStorage({
  destination: (req: Express.Request, file: Express.Multer.File, cb: DestinationCallback): void => {
    cb(null, '../uploads/news/files');
  },
  filename: (req: Express.Request, file: Express.Multer.File, cb: FilenameCallback): void => {
    const utf8Filename = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, `${Date.now()}-${utf8Filename}`);
  }
});

const pcaDocsFilesStorage: StorageEngine = multer.diskStorage({
  destination: (req: Express.Request, file: Express.Multer.File, cb: DestinationCallback): void => {
    cb(null, '../uploads/PCA_Docs/PCA_Docs_local/preDocs');
  },
  filename: (req: Express.Request, file: Express.Multer.File, cb: FilenameCallback): void => {
    // Convert the original filename to UTF-8 to handle special characters
    const utf8Filename = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, `${utf8Filename}`);
  }
});

// Configuración para la subida de archivos del formulario de activos
const assetFilesStorage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads/assetsRequest/devicePhotos');
  },
  filename: (req, file, cb) => {
    const utf8Filename = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, `${Date.now()}-${utf8Filename}`);
  }
});



// Crear instancias de multer con las configuraciones específicas
const uploadNewsFile = multer({ storage: newsFilesStorage });
const uploadProfileImage = multer({ storage: profileFilesStorage });
const uploadAssetsImages = multer({ storage: assetFilesStorage });
const uploadPCAFile = multer({ storage: pcaDocsFilesStorage });
// Configuración de los campos de subida
export const uploadNewsFiles = uploadNewsFile.fields([
  { name: 'image', maxCount: 1 }, // Un archivo con el campo 'image'
  { name: 'files', maxCount: 10 } // Varios archivos con el campo 'images'
]);
export const uploadAssetsRequestFiles = uploadAssetsImages.fields([
  { name: 'devicePhotos', maxCount: 10 } // Varios archivos con el campo 'devicePhotos'
]);
export const uploadPCADocsFiles = uploadPCAFile.fields([
  { name: 'files', maxCount: 10 } // Varios archivos con el campo 'images'
]);

export const uploadProfileImages = uploadProfileImage.fields([
  { name: 'image', maxCount: 1 }, // Un archivo con el campo 'image'
]);
 
import { Request, Response } from 'express';
import fs from 'fs';
import fsp from 'fs/promises';
import fsPromises from 'fs/promises'
import path from 'path';
import { Workbook } from 'exceljs';
import { SGI_Document } from '../Models/SGI_Document';
import { Op } from 'sequelize';
import { SGI_RequestChange } from '../Models/SGI_RequestChange';
import { SGI_Document_Share } from '../Models/SGI_Document_Share';
import PptxGenJS from 'pptxgenjs';
import { SGI_RequestNewItem } from '../Models/SGI_RequestNewItem';
import { getUsersRolsManagerSGI } from '../middleware/role';
import { error } from 'console';
import { SGIEmail } from '../emails/SGIeMail';
import { User } from '../Models/User';
const {
  Document, Packer, Paragraph, TextRun
} = require('docx');


export class PCA_DocsController {
  static getAllItems = async (req: Request, res: Response) => {
    const currentPath = req.query.currentPath as string;
    const folderPath = path.join(`../uploads/PCA_Docs/PCA_Docs_local/Documents`, currentPath);
    try {
      const items = await fsPromises.readdir(folderPath, { withFileTypes: true });
      const documents = await SGI_Document.findAll({
        where: {
          url: currentPath
        }
      })

      const result = items.map(item => {
        const document = documents.find(doc => { return doc.dataValues.document_name === item.name })
        if (document) {
          return {
            name: item.name,
            file: item.isFile(),
            folder: item.isDirectory(),
            folderPath: currentPath,
            create_by: document.dataValues.updateBy,
            modify: document.dataValues.date
          };
        }

      });

      // Ordenar para que las carpetas estén primero
      result.sort((a, b) => {
        if (a.folder && !b.folder) return -1;
        if (!a.folder && b.folder) return 1;
        return 0;
      });
      res.status(200).json(result);
    } catch (error) {
      console.error('Error reading directory:', error);
      res.status(500).json({ message: 'Error reading directory' });
    }
  }

  static createFolder = async (req: Request, res: Response) => {
    const folderName = req.body.name;
    const folderUrl = req.body.url;
    // Define the path where the new folder will be created
    const folderPath = path.join(`../uploads/PCA_Docs/PCA_Docs_local/Documents${folderUrl}`, folderName);
    try {
      // Check if the folder already exists
      if (!fs.existsSync(folderPath)) {
        // Create the new folder
        const document = SGI_Document.build(req.body)
        document.dataValues.document_name = folderName
        document.dataValues.isFolder = true
        document.dataValues.date = new Date()
        document.dataValues.updateBy = req.user.dataValues.id
        await document.save()
        fs.mkdirSync(folderPath, { recursive: true });
        res.status(200).send({ message: `Folder ${folderName} creada de manera satisfacoria` });
      } else {
        res.status(400).send({ error: `El folder ${folderName} ya existe, elige otro nombre` });
      }
    } catch (error) {
      console.error(`Error creating folder: ${error}`);
      res.status(500).send({ message: 'Error creating folder', error });
    }
  }
  static createFolderShare = async (req: Request, res: Response) => {
    const folderName = req.body.name;
    const folderUrl = req.body.url;
    // Define the path where the new folder will be created
    const folderPath = path.join(`../uploads/PCA_Docs/PCA_Docs_Share/Documents${folderUrl}`, folderName);
    try {
      // Check if the folder already exists
      if (!fs.existsSync(folderPath)) {
        // Create the new folder
        const document = SGI_Document_Share.build(req.body)
        document.dataValues.document_name = folderName
        document.dataValues.isFolder = true
        document.dataValues.date = new Date()
        document.dataValues.updateBy = req.user.dataValues.id
        await document.save()
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`Folder ${folderName} created at ${folderPath}`);
        res.status(200).send({ message: `Folder ${folderName} creada de manera satisfacoria` });
      } else {
        res.status(400).send({ error: `El folder ${folderName} ya existe, elige otro nombre` });
      }
    } catch (error) {
      console.error(`Error creating folder: ${error}`);
      res.status(500).send({ message: 'Error creating folder', error });
    }
  }
  static createWordDocument = async (req: Request, res: Response) => {
    const documentName = req.body.name;
    const documentUrl = req.body.url;

    // Define the path where the new document will be saved
    const documentPath = path.join(`../uploads/PCA_Docs/PCA_Docs_local/Documents${documentUrl}`, `${documentName}.docx`);
    try {
      // Check if the document already exists
      if (!fs.existsSync(documentPath)) {
        // Create the document
        const document = SGI_Document.build(req.body)
        document.dataValues.document_name = `${documentName}${'.docx'}`
        document.dataValues.date = new Date()
        document.dataValues.updateBy = req.user.dataValues.id
        await document.save()
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun(''),
                ],
              }),
            ],
          }],
        });
        // Save the document to the specified path
        const buffer = await Packer.toBuffer(doc);
        fs.writeFileSync(documentPath, buffer);
        console.log(`Document ${documentName} created at ${documentPath}`);
        res.status(200).send({ message: `Document ${documentName} creado de manera satisfactoria` });
      } else {
        res.status(400).send({ error: `El documento ${documentName} ya existe, elige otro nombre` });
      }
    } catch (error) {
      console.error(`Error creating document: ${error}`);
      res.status(500).send({ message: 'Error creating document', error });
    }
  }
  static createWordDocumentShare = async (req: Request, res: Response) => {
    const documentName = req.body.name;
    const documentUrl = req.body.url;

    // Define the path where the new document will be saved
    const documentPath = path.join(`../uploads/PCA_Docs/PCA_Docs_Share/Documents${documentUrl}`, `${documentName}.docx`);
    try {
      // Check if the document already exists
      if (!fs.existsSync(documentPath)) {
        // Create the document
        const document = SGI_Document_Share.build(req.body)
        document.dataValues.document_name = `${documentName}${'.docx'}`
        document.dataValues.date = new Date()
        document.dataValues.updateBy = req.user.dataValues.id
        await document.save()
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun(''),
                ],
              }),
            ],
          }],
        });
        // Save the document to the specified path
        const buffer = await Packer.toBuffer(doc);
        fs.writeFileSync(documentPath, buffer);
        console.log(`Document ${documentName} created at ${documentPath}`);
        res.status(200).send({ message: `Document ${documentName} creado de manera satisfactoria` });
      } else {
        res.status(400).send({ error: `El documento ${documentName} ya existe, elige otro nombre` });
      }
    } catch (error) {
      console.error(`Error creating document: ${error}`);
      res.status(500).send({ message: 'Error creating document', error });
    }
  }
  static createExcelDocument = async (req: Request, res: Response) => {
    const documentName = req.body.name;
    const documentUrl = req.body.url;
    const documentContent = req.body.content || [];

    const documentPath = path.join(`../uploads/PCA_Docs/PCA_Docs_local/Documents${documentUrl}`, `${documentName}.xlsx`);

    try {
      if (!fs.existsSync(documentPath)) {
        const document = SGI_Document.build(req.body)
        document.dataValues.document_name = `${documentName}${'.xlsx'}`
        document.dataValues.date = new Date()
        document.dataValues.updateBy = req.user.dataValues.id
        await document.save()
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        // Add content to the worksheet
        documentContent.forEach((row: any) => {
          worksheet.addRow(row);
        });

        await workbook.xlsx.writeFile(documentPath);
        console.log(`Excel document ${documentName} created at ${documentPath}`);
        res.status(200).send({ message: `Excel document ${documentName} creado de manera satisfactoria` });
      } else {
        res.status(400).send({ error: `El documento ${documentName} ya existe, elige otro nombre` });
      }
    } catch (error) {
      console.error(`Error creating Excel document: ${error}`);
      res.status(500).send({ message: 'Error creating Excel document', error });
    }
  }

  static createExcelDocumentShare = async (req: Request, res: Response) => {
    const documentName = req.body.name;
    const documentUrl = req.body.url;
    const documentContent = req.body.content || [];

    const documentPath = path.join(`../uploads/PCA_Docs/PCA_Docs_Share/Documents${documentUrl}`, `${documentName}.xlsx`);
    console.log(documentPath);

    try {
      if (!fs.existsSync(documentPath)) {
        const document = SGI_Document_Share.build(req.body)
        document.dataValues.document_name = `${documentName}${'.xlsx'}`
        document.dataValues.date = new Date()
        document.dataValues.updateBy = req.user.dataValues.id
        await document.save()
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        // Add content to the worksheet
        documentContent.forEach((row: any) => {
          worksheet.addRow(row);
        });

        await workbook.xlsx.writeFile(documentPath);
        console.log(`Excel document ${documentName} created at ${documentPath}`);
        res.status(200).send({ message: `Excel document ${documentName} creado de manera satisfactoria` });
      } else {
        res.status(400).send({ error: `El documento ${documentName} ya existe, elige otro nombre` });
      }
    } catch (error) {
      console.error(`Error creating Excel document: ${error}`);
      res.status(500).send({ message: 'Error creating Excel document', error });
    }
  }

  static createPowerPointDocument = async (req: Request, res: Response) => {
    const documentName = req.body.name;
    const documentUrl = req.body.url;
    const documentContent = req.body.content || [];
    const documentPath = path.join(`../uploads/PCA_Docs/PCA_Docs_local/Documents${documentUrl}`, `${documentName}.pptx`);
    console.log(documentPath);

    try {
      if (!fs.existsSync(documentPath)) {
        const document = SGI_Document.build(req.body)
        document.dataValues.document_name = `${documentName}${'.pptx'}`
        document.dataValues.date = new Date()
        document.dataValues.updateBy = req.user.dataValues.id
        await document.save()

        const pres = new PptxGenJS();

        // Añadir contenido a la presentación
        documentContent.forEach((slide: any) => {
          const newSlide = pres.addSlide();
          // Aquí debes agregar la lógica para añadir contenido a cada diapositiva
          // Por ejemplo:
          if (slide.title) newSlide.addText(slide.title, { x: 1, y: 1, w: '80%', h: 1 });
          if (slide.content) newSlide.addText(slide.content, { x: 1, y: 2, w: '80%', h: 4 });
        });

        await pres.writeFile({ fileName: documentPath });
        console.log(`PowerPoint document ${documentName} created at ${documentPath}`);
        res.status(200).send({ message: `PowerPoint document ${documentName} creado de manera satisfactoria` });
      } else {
        res.status(400).send({ error: `El documento ${documentName} ya existe, elige otro nombre` });
      }
    } catch (error) {
      console.error(`Error creating PowerPoint document: ${error}`);
      res.status(500).send({ message: 'Error creating PowerPoint document', error });
    }
  }

  static createPowerPointDocumentShare = async (req: Request, res: Response) => {
    const documentName = req.body.name;
    const documentUrl = req.body.url;
    const documentContent = req.body.content || [];
    const documentPath = path.join(`../uploads/PCA_Docs/PCA_Docs_Share/Documents${documentUrl}`, `${documentName}.pptx`);
    console.log(documentPath);

    try {
      if (!fs.existsSync(documentPath)) {
        const document = SGI_Document_Share.build(req.body)
        document.dataValues.document_name = `${documentName}${'.pptx'}`
        document.dataValues.date = new Date()
        document.dataValues.updateBy = req.user.dataValues.id
        await document.save()

        const pres = new PptxGenJS();

        // Añadir contenido a la presentación
        documentContent.forEach((slide: any) => {
          const newSlide = pres.addSlide();
          // Aquí debes agregar la lógica para añadir contenido a cada diapositiva
          // Por ejemplo:
          if (slide.title) newSlide.addText(slide.title, { x: 1, y: 1, w: '80%', h: 1 });
          if (slide.content) newSlide.addText(slide.content, { x: 1, y: 2, w: '80%', h: 4 });
        });

        await pres.writeFile({ fileName: documentPath });
        console.log(`PowerPoint document ${documentName} created at ${documentPath}`);
        res.status(200).send({ message: `PowerPoint document ${documentName} creado de manera satisfactoria` });
      } else {
        res.status(400).send({ error: `El documento ${documentName} ya existe, elige otro nombre` });
      }
    } catch (error) {
      console.error(`Error creating PowerPoint document: ${error}`);
      res.status(500).send({ message: 'Error creating PowerPoint document', error });
    }
  }
  static createTextDocument = async (req: Request, res: Response) => {
    const documentName = req.body.name;
    const documentUrl = req.body.url;
    const documentContent = req.body.content || '';
    const documentPath = path.join(`../uploads/PCA_Docs/PCA_Docs_local/Documents${documentUrl}`, `${documentName}.txt`);

    try {
      // Verificar si el archivo ya existe
      try {
        await fsp.access(documentPath);
        return res.status(400).send({ error: `El documento ${documentName} ya existe, elige otro nombre` });
      } catch {
        // El archivo no existe, podemos continuar
      }

      // Guardar información en la base de datos
      const document = SGI_Document.build(req.body);
      document.dataValues.document_name = `${documentName}.txt`;
      document.dataValues.date = new Date();
      document.dataValues.updateBy = req.user.dataValues.id;
      await document.save();

      // Crear el archivo de texto
      await fsp.writeFile(documentPath, documentContent);

      console.log(`Text document ${documentName} created at ${documentPath}`);
      res.status(200).send({ message: `Documento de texto ${documentName} creado de manera satisfactoria` });
    } catch (error) {
      console.error(`Error creating text document: ${error}`);
      res.status(500).send({ message: 'Error creating text document', error });
    }
  }


  static uploadItems = async (req: any, res: Response) => {
    const currentPath = req.body.currentPath;
    const basePath = '../uploads/PCA_Docs/PCA_Docs_local/Documents';
    const uploadPath = path.join(basePath, currentPath);

    try {
      // Check if req.files is an array or an object, and normalize to an array
      const files = Array.isArray(req.files) ? req.files : (req.files.files || []);
      const existingFiles: string[] = [];
      // Move files from temp storage to upload path
      for (const file of files) {
        const findDocument = await SGI_Document.findOne({
          where: { document_name: file.originalname, url: currentPath },
        });
        const utf8Filename = Buffer.from(file.originalname, 'latin1').toString('utf8');
        if (findDocument) {
          existingFiles.push(utf8Filename)
          return res.status(200).send({
            message: 'Archivo Existente',
            existingFiles: existingFiles.length > 0 ? existingFiles : null
          });
        }
        // Create the upload path if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        const filePath = path.join(uploadPath, utf8Filename);
        const data = {
          document_name: file.filename,
          url: currentPath,
          updateBy: req.user.dataValues.id,
          date: new Date()
        };
        const document = SGI_Document.build(data);
        await document.save();
        fs.renameSync(file.path, filePath);
      }

      res.status(200).send({
        message: 'Archivos subidos correctamente',
        existingFiles: existingFiles.length > 0 ? existingFiles : null
      });
    } catch (error) {
      console.error(`Error uploading files: ${error}`);
      res.status(500).send({ message: 'Error uploading files', error });
    }
  };
  static uploadItemsShare = async (req: any, res: Response) => {
    const currentPath = req.body.currentPath;
    const basePath = '../uploads/PCA_Docs/PCA_Docs_Share/Documents';
    const uploadPath = path.join(basePath, currentPath);
    try {
      // Check if req.files is an array or an object, and normalize to an array
      const files = Array.isArray(req.files) ? req.files : (req.files.files || []);
      const existingFiles: string[] = [];
      // Move files from temp storage to upload path
      for (const file of files) {
        const findDocument = await SGI_Document_Share.findOne({
          where: { document_name: file.originalname, url: currentPath },
        });
        const utf8Filename = Buffer.from(file.originalname, 'latin1').toString('utf8');
        if (findDocument) {
          existingFiles.push(utf8Filename)
          return res.status(200).send({
            message: 'Archivo Existente',
            existingFiles: existingFiles.length > 0 ? existingFiles : null
          });
        }
        // Create the upload path if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        const filePath = path.join(uploadPath, utf8Filename);
        const data = {
          document_name: file.filename,
          url: currentPath,
          updateBy: req.user.dataValues.id,
          date: new Date()
        };
        fs.renameSync(file.path, filePath);
        const document = SGI_Document_Share.build(data);
        await document.save();
      }
      res.status(200).send({
        message: 'Archivos subidos correctamente',
        existingFiles: existingFiles.length > 0 ? existingFiles : null
      });
    } catch (error) {
      console.error(`Error uploading files: ${error}`);
      res.status(500).send({ message: 'Error uploading files', error });
    }
  };

  static replaceItems = async (req: any, res: Response) => {
    const currentPath = req.body.currentPath;
    const basePath = '../uploads/PCA_Docs/PCA_Docs_local/Documents';
    const uploadPath = path.join(basePath, currentPath);

    try {
      // Check if req.files is an array or an object, and normalize to an array
      const files = Array.isArray(req.files) ? req.files : (req.files.files || []);

      // Reemplazar archivos existentes
      for (const file of files) {
        const document = await SGI_Document.findOne({
          where: { document_name: file.originalname, url: currentPath },
        });
        const utf8Filename = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const filePath = path.join(uploadPath, utf8Filename);
        // Reemplazar archivo existente si existe
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Eliminar archivo existente
        }
        fs.renameSync(file.path, filePath); // Mover archivo nuevo a la ruta de destino
        document.update({ updateBy: req.user.dataValues.id, date: Date.now() })
      };

      res.status(200).send({ message: 'Archivos reemplazados correctamente' });
    } catch (error) {
      console.error(`Error replacing files: ${error}`);
      res.status(500).send({ message: 'Error replacing files', error });
    }
  };
  static replaceItemsShare = async (req: any, res: Response) => {
    const currentPath = req.body.currentPath;
    const basePath = '../uploads/PCA_Docs/PCA_Docs_Share/Documents';
    const uploadPath = path.join(basePath, currentPath);

    try {
      // Check if req.files is an array or an object, and normalize to an array
      const files = Array.isArray(req.files) ? req.files : (req.files.files || []);

      // Reemplazar archivos existentes
      for (const file of files) {
        const document = await SGI_Document_Share.findOne({
          where: { document_name: file.originalname, url: currentPath },
        });
        const managers = await getUsersRolsManagerSGI(req, res)
        if ((managers.some(role => role.dataValues.id === req.user.dataValues.role_id)) || (req.user.dataValues.id === document.dataValues.updateBy)) {
          const utf8Filename = Buffer.from(file.originalname, 'latin1').toString('utf8');
          const filePath = path.join(uploadPath, utf8Filename);
          // Reemplazar archivo existente si existe
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Eliminar archivo existente
          }
          fs.renameSync(file.path, filePath); // Mover archivo nuevo a la ruta de destino
          document.update({ updateBy: req.user.dataValues.id, date: Date.now() })
        } else {
          return res.status(500).json({ error: 'No autorizado' });
        }

      };

      res.status(200).send({ message: 'Archivos reemplazados correctamente' });
    } catch (error) {
      console.error(`Error replacing files: ${error}`);
      res.status(500).send({ message: 'Error replacing files', error });
    }
  };

  static renameItem = async (req: Request, res: Response) => {
    const { name, url, isFolder, prevName } = req.body;

    const filePath = path.join(`../uploads/PCA_Docs/PCA_Docs_local/Documents${url}`, prevName);
    const newFilePath = path.join(`../uploads/PCA_Docs/PCA_Docs_local/Documents${url}`, isFolder ? name : `${name}${path.extname(prevName)}`);

    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.rename(filePath, newFilePath);
      } else {
        return res.status(404).send({ error: `Item no encontrado: ${prevName}` })
      }
      const document = await SGI_Document.findOne({
        where: { document_name: prevName, url: url },
      });
      if (!document) {
        const error = new Error('Item no encontrado')
        return res.status(404).json({ error: error.message })
      }
      document.update({ document_name: `${name}${path.extname(prevName)}`, updateBy: req.user.dataValues.id, date: Date.now() })

      const documents = await SGI_Document.findAll({
        where: {
          url: {
            [Op.like]: `${url}%`
          }
        }
      });
      if (documents.length > 0) {
        documents.forEach((document: any) => {
          const newUrl = document.url.replace(prevName, isFolder ? name : `${name}${path.extname(prevName)}`);
          document.url = newUrl;
          document.save();
        });
      }
      res.status(200).send({ message: `Item renamed from ${prevName} to ${name}` });
    } catch (error) {
      console.error(`Error renaming item: ${error}`);
      res.status(500).send({ message: 'Error renaming item', error });
    }
  }

  static renameItemShare = async (req: Request, res: Response) => {
    const { name, url, isFolder, prevName } = req.body;

    const filePath = path.join(`../uploads/PCA_Docs/PCA_Docs_Share/Documents${url}`, prevName);
    const newFilePath = path.join(`../uploads/PCA_Docs/PCA_Docs_Share/Documents${url}`, isFolder ? name : `${name}${path.extname(prevName)}`);

    try {
      const document = await SGI_Document_Share.findOne({
        where: { document_name: prevName, url: url },
      });
      if (!document) {
        const error = new Error('Item no encontrado')
        return res.status(404).json({ error: error.message })
      }
      const managers = await getUsersRolsManagerSGI(req, res)
      if ((managers.some(role => role.dataValues.id === req.user.dataValues.role_id)) || (req.user.dataValues.id === document.dataValues.updateBy)) {
        document.update({ document_name: `${name}${path.extname(prevName)}`, updateBy: req.user.dataValues.id, date: Date.now() })
        const documents = await SGI_Document_Share.findAll({
          where: {
            url: {
              [Op.like]: `${url}%`
            }
          }
        });

        if (fs.existsSync(filePath)) {
          await fs.promises.rename(filePath, newFilePath);
        } else {
          return res.status(404).send({ error: `Item no encontrado: ${prevName}` })
        }
        return res.status(200).send({ message: `Item renamed from ${prevName} to ${name}` });
      } else {
        return res.status(500).json({ error: `No autorizado` });
      }

    } catch (error) {
      console.error(`Error renaming item: ${error}`);
      res.status(500).send({ message: 'Error renaming item', error });
    }
  }


  static deleteItems = async (req: Request, res: Response) => {
    const items = JSON.parse(req.body.items);
    const basePath = '../uploads/PCA_Docs/PCA_Docs_local/Documents';

    try {
      for (const itemName in items) {
        const item = items[itemName];
        const itemPath = path.join(basePath, item.url, itemName);

        if (item.isFolder) {
          fs.rmdirSync(itemPath, { recursive: true });
        } else {
          fs.unlinkSync(itemPath);
        }
        const document = await SGI_Document.findOne({
          where: { document_name: itemName, url: item.url },
        });
        if (!document) {
          const error = new Error('Item no encontrado')
          return res.status(404).json({ error: error.message })
        }
        const documents = await SGI_Document.findAll({
          where: {
            url: {
              [Op.like]: `${item.url + '/' + itemName}%`
            }
          }
        });
        if (documents) {
          await Promise.all(documents.map(document => document.destroy()));
        }
        await document.destroy()
      }
      res.status(200).send({ message: 'Item eliminado correctamente' });
    } catch (error) {
      console.error(`Error deleting items: ${error}`);
      res.status(500).send({ message: 'Error deleting items', error });
    }
  }
  static deleteItemsShare = async (req: Request, res: Response) => {
    const items = JSON.parse(req.body.items);
    const basePath = '../uploads/PCA_Docs/PCA_Docs_Share/Documents';
    try {
      for (const itemName in items) {
        const item = items[itemName];
        const itemPath = path.join(basePath, item.url, itemName);

        const document = await SGI_Document_Share.findOne({
          where: { document_name: itemName, url: item.url },
        });
        if (!document) {
          const error = new Error('Item no encontrado')
          return res.status(404).json({ error: error.message })
        }
        const managers = await getUsersRolsManagerSGI(req, res)
        if ((managers.some(role => role.dataValues.id === req.user.dataValues.role_id)) || (req.user.dataValues.id === document.dataValues.updateBy)) {
          const documents = await SGI_Document_Share.findAll({
            where: {
              url: {
                [Op.like]: `${item.url + '/' + itemName}%`
              }
            }
          });
          if (documents) {
            await Promise.all(documents.map(document => document.destroy()));
          }
          await document.destroy()
          if (item.isFolder) {
            fs.rmdirSync(itemPath, { recursive: true });
          } else {
            fs.unlinkSync(itemPath);
          }
        } else {
          return res.status(500).json({ error: 'No autorizado' });
        }

      }
      res.status(200).send({ message: 'Item eliminado correctamente' });
    } catch (error) {
      console.error(`Error deleting items: ${error}`);
      res.status(500).send({ message: 'Error deleting items', error });
    }
  }


  //request Change Items
  static getAllRequests = async (req: Request, res: Response) => {
    try {
      const request = await SGI_RequestChange.findAll({ raw: true })
      res.status(200).json(request)
    } catch (error) {
      res.status(500).send({ message: 'Error al cargar las solicitudes', error });
    }
  }
  static getAllNewRequests = async (req: Request, res: Response) => {
    try {
      const request = await SGI_RequestNewItem.findAll({ raw: true })
      res.status(200).json(request)
    } catch (error) {
      res.status(500).send({ message: 'Error al cargar las solicitudes', error });
    }
  }

  static requestNewChangeItem = async (req: Request, res: Response) => {
    const url = req.body.url
    const document_name = req.body.document_name
    const basePath = '../uploads/PCA_Docs/PCA_Docs_local/Documents';
    const changeRequestPath = '../uploads/PCA_Docs/PCA_Docs_local/Document_change_requests';

    try {
      const document = await SGI_Document.findOne({
        where: { document_name, url },
      });
      if (!document) {
        const error = new Error('Document not found')
        return res.status(404).json({ error: error.message })
      }

      // Create a copy of the document
      const originalDocumentPath = path.join(basePath, url, document_name);
      const copyDocumentPath = path.join(changeRequestPath, document_name);
      fs.copyFileSync(originalDocumentPath, copyDocumentPath);

      const objRequest = {
        'document_name': document_name,
        'reason': req.body.reason,
        'date': new Date(),
        'requestBy': req.user.dataValues.id
      }
      const request = SGI_RequestChange.build(objRequest)
      await request.save()
      const rolesSGI = await getUsersRolsManagerSGI(req, res)
      const rolesSGIIds = rolesSGI.map(rol => rol.dataValues.id) // Extrae los ids de la lista de roles

      const managersSGI = await User.findAll({
        where: {
          role_id: {
            [Op.in]: rolesSGIIds
          }
        }
      })
      const userRequest = await User.findByPk(req.user.dataValues.id)
      managersSGI.forEach(user => {
        SGIEmail.sendRequestChangeSGI({
          email: user.dataValues.email,
          name: user.dataValues.name,
          userName: userRequest.dataValues.name,
          urlFile: copyDocumentPath,
          documentName: document_name,
          reason: req.body.reason,
        })
      })
      res.send({ message: 'Solicitud creada con éxito' })
    } catch (err) {
      console.error(err)
      res.status(500).send({ message: 'Error al crear la solicitud' })
    }
  }
  static requestNewItem = async (req: Request, res: Response) => {
    const objRequest = {
      'reason': req.body.reason,
      'date': new Date(),
      'requestBy': req.user.dataValues.id
    }

    try {
      const request = SGI_RequestNewItem.build(objRequest)
      await request.save()
      const rolesSGI = await getUsersRolsManagerSGI(req, res)
      const rolesSGIIds = rolesSGI.map(rol => rol.dataValues.id) // Extrae los ids de la lista de roles

      const managersSGI = await User.findAll({
        where: {
          role_id: {
            [Op.in]: rolesSGIIds
          }
        }
      })
      const userRequest = await User.findByPk(req.user.dataValues.id)
      managersSGI.forEach(user => {
        SGIEmail.sendRequestNewFileSGI({
          email: user.dataValues.email,
          name: user.dataValues.name,
          userName: userRequest.dataValues.name,
          reason: req.body.reason,
        })
      })
      res.send({ message: 'Solicitud creada con éxito' })
    } catch (err) {
      console.error(err)
      res.status(500).send({ message: 'Error al crear la solicitud' })
    }
  }

  static updateStadeRequest = async (req: Request, res: Response) => {
    const { id, status } = req.body
    try {
      if (!status) {
        const error = new Error('Hubo un error')
        return res.status(404).json({ error: error.message })
      }
      const request = await SGI_RequestChange.findByPk(id)
      if (!request) {
        const error = new Error('Solicitud no encontrada')
        return res.status(404).json({ error: error.message })
      }
      const [rowsUpdated, [updatedStatus]] = await SGI_RequestChange.update(
        { status },
        {
          where: { id },
          returning: true, // Esto es importante para que devuelva el registro actualizado
        }
      );

      if (rowsUpdated === 0) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }

      res.status(200).send({ message: 'Estado actualizado' })
    } catch (error) {
      console.log(error)
    }
  }

  static updateStadeNewRequest = async (req: Request, res: Response) => {
    const { id, status } = req.body
    try {
      if (!status) {
        const error = new Error('Hubo un error')
        return res.status(404).json({ error: error.message })
      }
      const request = await SGI_RequestNewItem.findByPk(id)
      if (!request) {
        const error = new Error('Solicitud no encontrada')
        return res.status(404).json({ error: error.message })
      }
      const [rowsUpdated, [updatedStatus]] = await SGI_RequestNewItem.update(
        { status },
        {
          where: { id },
          returning: true, // Esto es importante para que devuelva el registro actualizado
        }
      );
      if (rowsUpdated === 0) {
        return res.status(404).json({ error: 'Solicitud no encontradae' });
      }

      res.status(200).send({ message: 'Estado actualizado' })
    } catch (error) {
      console.log(error)
    }
  }

  static deleteRequest = async (req: Request, res: Response) => {
    const { id } = req.body
    try {
      const request = await SGI_RequestChange.findOne({ where: { id: id } })
      if (!request) {
        const error = new Error('Solicitud no encontrada')
        return res.status(404).json({ error: error.message })
      }
      await request.destroy()
      res.send({ message: 'Solicitud Eliminada' })
    } catch (error) {
      console.log(error)
    }
  }
  static deleteNewRequest = async (req: Request, res: Response) => {
    const { id } = req.body
    try {
      const request = await SGI_RequestNewItem.findOne({ where: { id: id } })
      if (!request) {
        const error = new Error('Solicitud no encontrada')
        return res.status(404).json({ error: error.message })
      }
      await request.destroy()
      res.send({ message: 'Solicitud Eliminada' })
    } catch (error) {
      console.log(error)
    }
  }


  //Share

  static getAllItemsShare = async (req: Request, res: Response) => {
    const currentPath = req.query.currentPath as string;
    const folderPath = path.join(`../uploads/PCA_Docs/PCA_Docs_Share/Documents`, currentPath);
    try {
      const items = await fsPromises.readdir(folderPath, { withFileTypes: true });
      const documents = await SGI_Document_Share.findAll({
        where: {
          url: currentPath
        }
      })

      const result = items.map(item => {
        const document = documents.find(doc => { return doc.dataValues.document_name === item.name })
        if (document) {
          return {
            name: item.name,
            file: item.isFile(),
            folder: item.isDirectory(),
            folderPath: currentPath,
            create_by: document.dataValues.updateBy,
            modify: document.dataValues.date
          };
        }

      });

      // Ordenar para que las carpetas estén primero
      result.sort((a, b) => {
        if (a.folder && !b.folder) return -1;
        if (!a.folder && b.folder) return 1;
        return 0;
      });
      res.status(200).json(result);
    } catch (error) {
      console.error('Error reading directory:', error);
      res.status(500).json({ message: 'Error reading directory' });
    }
  }


}

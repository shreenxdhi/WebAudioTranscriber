import { User } from '@shared/schema';

declare global {
  namespace Express {
    // Extend the Request interface to include the user property
    interface Request {
      user?: User;
      file?: Express.Multer.File;
      files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
    }
  }
}

// This export is needed to make this file a module
export {};

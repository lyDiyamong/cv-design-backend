import { JwtUser } from './index'; // Import your user type if it's defined elsewhere
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: JwtUser;
    }
  }
}

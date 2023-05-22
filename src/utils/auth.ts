import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const secretKey = process.env.JWT_SECRET;
const tokenExpiration = process.env.JWT_EXPIRATION;
const saltRounds = parseInt(process.env.JWT_SALT_ROUNDS, 10);

export function generateToken(payload: any): string {
  return jwt.sign(payload, secretKey, { expiresIn: tokenExpiration });
}

export function verifyToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

export function decodeToken(token: string): any {
  return jwt.decode(token);
}

// compares passwords
export function checkIfPasswordIsCorrect (reqPass: string, dbPass: string): boolean { 
  return bcrypt.compareSync(reqPass, dbPass)
} 

// create password and hash it
export function createPassword (password: string ): string {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds))
} 
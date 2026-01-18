import { randomBytes } from 'crypto';
import { v4 } from 'uuid';

console.log('uuid:', Buffer.from(v4()).toString('base64'));
console.log('randomBytes', randomBytes(32).toString('base64'));

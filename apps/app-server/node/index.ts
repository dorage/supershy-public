import { serve } from '@hono/node-server';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import app from '../src';

const PORT = 9000;

const server = serve({
  fetch: app.fetch,
});

server.on('listening', () => {
  console.log(`[http://localhost:${PORT}]: LISTENING`);
});
server.on('timeout', () => {
  console.error(`[http://localhost:${PORT}]: TIMED OUT`);
});
server.on('close', () => {
  console.log(`[http://localhost:${PORT}]: TERMINATED`);
});

server.listen(9000);

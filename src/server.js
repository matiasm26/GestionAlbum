import 'dotenv/config';
import app from './app.js';

const port = Number(process.env.PORT || 3000);
const server = app.listen(port, () => console.log(`API escuchando en http://localhost:${port}`));
const shutdown = async () => { server.close(); process.exit(0); };
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

import server from './server';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});

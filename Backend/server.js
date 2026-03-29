import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js'
import connectDatabase from './src/config/database.js'

connectDatabase();

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
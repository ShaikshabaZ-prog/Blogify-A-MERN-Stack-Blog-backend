const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'https://blogifyourblog.netlify.app'],
  credentials: true
}));

app.use(express.json());


app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api', require('./routes/authRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

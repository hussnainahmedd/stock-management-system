require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const History = require('./models/history');
const path = require('path');
const connectDB = require('./config/db');
const Item = require('./models/Item'); 
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'my_secret_key'; 
const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// ==================== AUTHENTICATION MIDDLEWARE ====================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// ==================== LOGIN ROUTE ====================
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = [{ username: 'DB', password: '0702' }];
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });
  res.json({ token, message: 'Login successful' });
});

// ==================== GET ALL ITEMS ROUTE ====================
app.get('/api/items', authenticateToken, async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ message: 'Error fetching items', error: err.message });
  }
});

// ==================== GET SINGLE ITEM ROUTE (FIXED) ====================
app.get('/api/items/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Error fetching item', error: error.message });
  }
});

// ==================== ADD NEW ITEM ROUTE ====================
app.post('/api/items', authenticateToken, async (req, res) => {
  const { name, category, quantity, price } = req.body;

  // Validation
  if (!name || !category || quantity === undefined || price === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (quantity < 0 || price < 0) {
    return res.status(400).json({ message: 'Quantity and price must be non-negative' });
  }

  try {
    const newItem = new Item({ name, category, quantity, price });
    await newItem.save();

    // Save to history
    await History.create({
      action: 'Added',
      itemName: name,
      category,
      quantity,
      price,
      timestamp: new Date()
    });

    res.status(201).json({ 
      message: 'Item added successfully',
      item: newItem
    });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ message: 'Failed to add item', error: error.message });
  }
});

// ==================== UPDATE ITEM ROUTE ====================
app.put('/api/items/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, category, quantity, price } = req.body;

  // Validation
  if (!name || !category || quantity === undefined || price === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (quantity < 0 || price < 0) {
    return res.status(400).json({ message: 'Quantity and price must be non-negative' });
  }

  // Validate MongoDB ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid item ID' });
  }

  try {
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { name, category, quantity, price, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Save to history
    await History.create({
      action: 'Updated',
      itemName: name,
      category,
      quantity,
      price,
      timestamp: new Date()
    });

    res.json({ 
      message: 'Item updated successfully', 
      item: updatedItem 
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
});

// ==================== DELETE ITEM ROUTE ====================
app.delete('/api/items/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid item ID' });
  }

  try {
    const item = await Item.findByIdAndDelete(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Save to history
    await History.create({
      action: 'Deleted',
      itemName: item.name,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
      timestamp: new Date()
    });

    res.json({ 
      message: 'Item deleted successfully',
      deletedItem: item
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
});

// ==================== GET HISTORY ROUTE ====================
app.get('/api/history', authenticateToken, async (req, res) => {
  try {
    const history = await History.find().sort({ timestamp: -1 }).limit(100);
    res.json(history);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ message: 'Error fetching history', error: err.message });
  }
});

// ==================== SERVE FRONTEND ====================
// Root path serves login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// All other routes serve index.html
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;

mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`✅ MongoDB Connected`);
    console.log(`✅ API endpoints ready`);
  });
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

process.on('SIGINT', async () => {
  console.log('\n⚠️  Shutting down...');
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = app;
import { Help } from '../models/helpModel.js';

const useMemory = String(process.env.SKIP_DB).toLowerCase() === 'true';
const memoryHelps = [];

export async function addHelpRequest(req, res, next) {
  try {
    const { category, description, location } = req.body;
    if (!category || !description) {
      return res.status(400).json({ message: 'category and description are required' });
    }
    if (useMemory) {
      const created = { _id: `${Date.now()}-${Math.random()}`, category, description, location, createdAt: new Date().toISOString() };
      memoryHelps.unshift(created);
      res.status(201).json(created);
      return;
    }
    const created = await Help.create({ category, description, location });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function listHelpRequests(_req, res, next) {
  try {
    if (useMemory) {
      res.json(memoryHelps.slice(0, 100));
      return;
    }
    const items = await Help.find().sort({ createdAt: -1 }).limit(100);
    res.json(items);
  } catch (err) {
    next(err);
  }
}



import { Mood } from '../models/moodModel.js';

const useMemory = String(process.env.SKIP_DB).toLowerCase() === 'true';
const memoryMoods = [];

export async function addMood(req, res, next) {
  try {
    const { userId, mood, note } = req.body;
    if (!userId || !mood) {
      return res.status(400).json({ message: 'userId and mood are required' });
    }
    if (useMemory) {
      const created = { _id: `${Date.now()}-${Math.random()}`, userId, mood, note, date: new Date().toISOString() };
      memoryMoods.unshift(created);
      res.status(201).json(created);
      return;
    }
    const created = await Mood.create({ userId, mood, note });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function getMoodsByUser(req, res, next) {
  try {
    const { userId } = req.params;
    if (useMemory) {
      const items = memoryMoods.filter(m => m.userId === userId).slice(0, 50);
      res.json(items);
      return;
    }
    const items = await Mood.find({ userId }).sort({ date: -1 }).limit(50);
    res.json(items);
  } catch (err) {
    next(err);
  }
}



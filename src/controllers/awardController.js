import { Award } from '../models/index.js';

export const getAllAwards = async (req, res) => {
  try {
    const awards = await Award.findAll();
    res.json(awards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createAward = async (req, res) => {
    try {
        const award = await Award.create(req.body);
        res.status(201).json(award);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

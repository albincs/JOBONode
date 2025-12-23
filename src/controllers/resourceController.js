import { Task, Cost, ProjectImage, ProjectURL } from '../models/index.js';

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllCosts = async (req, res) => {
  try {
    const costs = await Cost.findAll();
    res.json(costs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllProjectImages = async (req, res) => {
  try {
    const images = await ProjectImage.findAll();
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllProjectURLs = async (req, res) => {
  try {
    const urls = await ProjectURL.findAll();
    res.json(urls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

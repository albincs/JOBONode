import { AboutUs } from '../models/index.js';

export const getAllAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findAll();
    res.json(aboutUs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAboutUsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const aboutUs = await AboutUs.findOne({
      where: { slug }
    });

    if (!aboutUs) {
      return res.status(404).json({ error: 'About Us section not found' });
    }

    res.json(aboutUs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

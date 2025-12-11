import { Service } from '../models/index.js';

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { active: true }
    });
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const service = await Service.findOne({
      where: { slug }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

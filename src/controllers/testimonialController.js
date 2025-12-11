import { Testimonial } from '../models/index.js';

export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      where: { is_approved: true }
    });
    res.json(testimonials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

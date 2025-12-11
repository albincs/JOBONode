import { ProjectCategory } from '../models/index.js';

export const getAllCategories = async (req, res) => {
  try {
    // Django logic was flattening categories or returning nested. 
    // The active Django view `ProjectCategoryList` uses `get_flat_categories`.
    // We will return all categories.
    const categories = await ProjectCategory.findAll({
      attributes: ['id', 'name', 'slug', 'parent_id']
    });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ProjectCategory.findByPk(id, {
      include: [{ model: ProjectCategory, as: 'parent_category' }]
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

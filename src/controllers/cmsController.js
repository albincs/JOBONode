import { CmsTable, CmsTableImage } from '../models/index.js';

export const getAllCmsTables = async (req, res) => {
  try {
    const cmsTables = await CmsTable.findAll({
      include: [{ model: CmsTableImage, as: 'images', order: [['order', 'ASC']] }]
    });
    res.json(cmsTables);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCmsTableBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const cmsTable = await CmsTable.findOne({
      where: { slug },
      include: [{ model: CmsTableImage, as: 'images', order: [['order', 'ASC']] }]
    });

    if (!cmsTable) {
      return res.status(404).json({ error: 'CMS Table not found' });
    }

    res.json(cmsTable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

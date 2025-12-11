import { Project, ProjectImage, ProjectURL, ProjectCategory, Client } from '../models/index.js';

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        { model: ProjectImage, as: 'images' },
        { model: ProjectURL, as: 'urls' },
        { model: ProjectCategory, as: 'project_category' },
        { model: Client, as: 'project_client' }
      ]
    });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await Project.findOne({
      where: { slug },
      include: [
        { model: ProjectImage, as: 'images' },
        { model: ProjectURL, as: 'urls' },
        { model: ProjectCategory, as: 'project_category' },
        { model: Client, as: 'project_client' }
      ]
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id, {
      include: [
        { model: ProjectImage, as: 'images' },
        { model: ProjectURL, as: 'urls' },
        { model: ProjectCategory, as: 'project_category' },
        { model: Client, as: 'project_client' }
      ]
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

import { Team } from '../models/index.js';

export const getAllTeamMembers = async (req, res) => {
  try {
    const team = await Team.findAll();
    res.json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Team.findByPk(id);

    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

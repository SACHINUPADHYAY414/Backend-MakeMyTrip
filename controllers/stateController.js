const stateModel = require('../models/stateModel');

const getAllStates = async (req, res) => {
  try {
    const states = await stateModel.getAllStates();
    res.json(states);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getStatesByCountryId = async (req, res) => {
  const countryId = parseInt(req.params.countryId);
  try {
    const states = await stateModel.getStatesByCountryId(countryId);
    res.json(states);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getStateById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const state = await stateModel.getStateById(id);
    if (!state) return res.status(404).json({ message: 'State not found' });
    res.json(state);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addState = async (req, res) => {
  const { name, country_id } = req.body;
  if (!name || !country_id)
    return res.status(400).json({ message: 'Name and country_id required' });

  try {
    const newState = await stateModel.addState(name, country_id);
    res.status(201).json(newState);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteState = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await stateModel.deleteState(id);
    res.json({ message: 'State deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateState = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, country_id } = req.body;
  if (!name || !country_id)
    return res.status(400).json({ message: 'Name and country_id required' });

  try {
    const updatedState = await stateModel.updateState(id, name, country_id);
    if (!updatedState) return res.status(404).json({ message: 'State not found' });
    res.json(updatedState);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllStates,
  getStatesByCountryId,
  getStateById,
  addState,
  deleteState,
  updateState,
};

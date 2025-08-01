const cityModel = require('../models/cityModel');

const getAllCities = async (req, res) => {
  try {
    const cities = await cityModel.getAllCities();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCitiesByStateId = async (req, res) => {
  const stateId = parseInt(req.params.stateId);
  try {
    const cities = await cityModel.getCitiesByStateId(stateId);
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCityById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const city = await cityModel.getCityById(id);
    if (!city) return res.status(404).json({ message: 'City not found' });
    res.json(city);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addCity = async (req, res) => {
  const { name, state_id } = req.body;
  if (!name || !state_id)
    return res.status(400).json({ message: 'Name and state_id required' });

  try {
    const newCity = await cityModel.addCity(name, state_id);
    res.status(201).json(newCity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCity = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await cityModel.deleteCity(id);
    res.json({ message: 'City deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCity = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, state_id } = req.body;
  if (!name || !state_id)
    return res.status(400).json({ message: 'Name and state_id required' });

  try {
    const updatedCity = await cityModel.updateCity(id, name, state_id);
    if (!updatedCity) return res.status(404).json({ message: 'City not found' });
    res.json(updatedCity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllCities,
  getCitiesByStateId,
  getCityById,
  addCity,
  deleteCity,
  updateCity,
};

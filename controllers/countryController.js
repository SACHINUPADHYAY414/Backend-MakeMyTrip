const Country = require('../models/countryModel');

exports.getAllCountries = async (req, res) => {
  try {
    const countries = await Country.findAll();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCountryById = async (req, res) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) return res.status(404).json({ error: 'Country not found' });
    res.json(country);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCountry = async (req, res) => {
  try {
    const country = await Country.create({ name: req.body.name });
    res.status(201).json(country);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateCountry = async (req, res) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) return res.status(404).json({ error: 'Country not found' });

    country.name = req.body.name || country.name;
    await country.save();

    res.json(country);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCountry = async (req, res) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) return res.status(404).json({ error: 'Country not found' });

    await country.destroy();
    res.json({ message: 'Country deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

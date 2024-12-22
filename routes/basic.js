const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '../hospitals.json');

//  read 
async function readHospitals() {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

//write
async function writeHospitals(data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// GET 
router.get('/', async (req, res) => {
  try {
    const hospitals = await readHospitals();
    res.status(200).json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Error reading hospital data' });
  }
});



// POST 
router.post('/', async (req, res) => {
  try {
    const { name, patientCount, location } = req.body;
    const hospitals = await readHospitals();
    const newHospital = {
      id: hospitals.length > 0 ? hospitals[hospitals.length - 1].id + 1 : 1,
      name,
      patientCount,
      location
    };
    hospitals.push(newHospital);
    await writeHospitals(hospitals);
    res.status(201).json(newHospital);
  } catch (error) {
    res.status(500).json({ message: 'Error adding hospital' });
  }
});

// PUT 
router.put('/:id', async (req, res) => {
  try {
    const { name, patientCount, location } = req.body;
    const hospitals = await readHospitals();
    const hospitalIndex = hospitals.findIndex(h => h.id === parseInt(req.params.id));
    if (hospitalIndex === -1) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    hospitals[hospitalIndex] = { id: parseInt(req.params.id), name, patientCount, location };
    await writeHospitals(hospitals);
    res.status(200).json(hospitals[hospitalIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating hospital' });
  }
});

// DELETE 
router.delete('/:id', async (req, res) => {
  try {
    const hospitals = await readHospitals();
    const newHospitals = hospitals.filter(h => h.id !== parseInt(req.params.id));
    if (hospitals.length === newHospitals.length) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    await writeHospitals(newHospitals);
    res.status(200).json({ message: 'Hospital deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting hospital' });
  }
});

module.exports = router;

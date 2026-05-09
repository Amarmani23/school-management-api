const express = require('express');
const { addSchool, listSchools } = require('../controllers/schoolController');
const { validateSchool, validateCoordinates } = require('../middleware/validation');

const router = express.Router();

router.post('/addSchool', validateSchool, addSchool);
router.get('/listSchools', validateCoordinates, listSchools);

module.exports = router;
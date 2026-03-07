const express = require('express');
const router = express.Router();

const { getDoctors, bookConsultation, getConsultations, cancelConsultation } = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET  /api/doctors                          — List all doctors (?specialty=Neurologist)
router.get('/', getDoctors);

// POST /api/doctors/book                     — Book a consultation
router.post('/book', bookConsultation);

// GET  /api/doctors/consultations            — View my consultations
router.get('/consultations', getConsultations);

// PATCH /api/doctors/consultations/:id/cancel — Cancel an upcoming consultation
router.patch('/consultations/:id/cancel', cancelConsultation);

module.exports = router;

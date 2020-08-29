const express = require('express');
const router = express.Router();
const CarAdsController = require('../Controllers/cardAd.controller');

router.use('/resources', express.static('resources'))
router.post('/car_ads', CarAdsController.createPost)
router.get('/', CarAdsController.welcome);

module.exports = router;


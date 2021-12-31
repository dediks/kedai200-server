const router = require('express').Router();
const multer = require('multer');

const deliveryAddressController = require('./controller');

router.get('/delivey-addresses', deliveryAddressController.index);
router.post(
  '/delivery-addresses',
  multer().none(),
  deliveryAddressController.store
);
router.put(
  '/delivery-addresses/:id',
  multer().none(),
  deliveryAddressController.update
);

router.delete(
  '/delivery-addresses/:id',
  multer().none(),
  deliveryAddressController.destroy
);

module.exports = router;

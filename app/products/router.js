const os = require('os');
const multer = require('multer');
const router = require('express').Router();

const productController = require('./controller.js');

router.get('/products', productController.index);
router.post(
  '/products',
  multer({ dest: os.tmpdir() }).single('image'),
  productController.store
);
router.put(
  '/products/:id',
  multer({ dest: os.tmpdir() }).single('image'),
  productController.update
);
router.delete('/products/:id', productController.destroy);

module.exports = router;

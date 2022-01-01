const { policyFor } = require('../policy');
const CartItem = require('./model');
const Product = require('../products/model');

async function index(req, res, next) {
  let policy = policyFor(req.user);

  if (!policy.can('read', 'Cart')) {
    return res.json({
      error: 1,
      message: 'You are not aloowed to perform this action',
    });
  }

  try {
    let items = await CartItem.find({ user: req.user._id }).populate('product');

    return res.json(items);
  } catch (error) {
    if (error && error.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }

    next(error);
  }
}

async function update(req, res, next) {
  let policy = policyFor(req.user);

  if (!policy.can('update', 'Cart')) {
    return res.json({
      error: 1,
      messsage: 'You are not allowed to perform this action',
    });
  }

  try {
    const { items } = req.body;
    const productIds = items.map((item) => item._id);

    const products = await Product.find({ _id: { $in: productIds } });

    let cartItems = items.map((item) => {
      let relatedProduct = products.find(
        (product) => product._id.toString() === item.product._id
      );

      return {
        product: relatedProduct._id,
        price: relatedProduct.price,
        image_url: relatedProduct.image_url,
        name: relatedProduct.name,
        user: req.user._id,
        qty: item.qty,
      };
    });

    await CartItem.bulkWrite(
      cartItems.map((item) => {
        return {
          updateOne: {
            filter: { user: req.user._id, product: item.product },
            update: item,
            upsert: true,
          },
        };
      })
    );

    return res.json(cartItems);
  } catch (error) {
    if (error && error.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: error.message,
        field: error.errors,
      });
    }

    next(error);
  }
}

module.exports = {
  index,
  update,
};

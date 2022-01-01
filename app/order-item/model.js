const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const orderItemSchema = Schema({
  name: {
    type: String,
    minLength: [5, 'Panjang nama makanan minimal 50 karakter'],
    required: [true, 'Name must be filled'],
  },
  price: {
    type: Number,
    required: [true, 'Harga item harus diisi'],
  },
  qty: {
    type: Number,
    required: [true, 'Qty harus diisi'],
    min: [1, 'Qty minimal 1'],
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
  },
});

module.exports = model('OrderItem', orderItemSchema);

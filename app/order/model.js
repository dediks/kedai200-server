const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const Invoice = require('../invoice/model');

const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderSchema = Schema(
  {
    status: {
      type: String,
      enum: ['waiting_payment', 'processing', 'in_delivery', 'delivered'],
      default: 'waiting_payment',
    },
    delivery_address: {
      provinsi: {
        type: String,
        required: [true, 'Provinsi harus diisi'],
      },
      kabupaten: {
        type: String,
        required: [true, 'Kabupaten harus diisi'],
      },
      kecamatan: {
        type: String,
        required: [true, 'kecamatan harus diisi'],
      },
      kelurahan: {
        type: String,
        required: [true, 'Kelurahan harus diisi'],
      },
      detail: {
        type: String,
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    order_items: [
      {
        types: Schema.Types.ObjectId,
        ref: 'ObjectItem',
      },
    ],
  },
  { timestamps: true }
);

orderSchema.plugin(AutoIncrement, { inc_field: 'order_number' });

orderSchema.virtual('items_count').get(function () {
  return this.order_items.reduce((total, item) => {
    return total + parseInt(item.qty);
  }, 0);
});

orderSchema.post('save', async function () {
  let sub_total = this.order_items.reduce(
    (sum, item) => (sum += item.price * item.qty),
    0
  );

  let invoice = new Invoice({
    user: this.user,
    order: this._id,
    sub_total: sub_total,
    delivery_fee: parseInt(this.delivery_fee),
    total: parseInt(sub_total + this.delivery_fee),
    delivery_address: this.delivery_address,
  });

  await invoice.save();
});

module.exports = model('Order', orderSchema);

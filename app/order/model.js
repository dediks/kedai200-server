const mongoose = require('mongoose');
const { model, Schema } = mongoose;

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

module.exports = model('Order', orderSchema);

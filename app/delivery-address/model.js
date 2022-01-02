const mongoose = require('mongoose');

const { model, Schema } = mongoose;

const deliveryAddressSchema = Schema(
  {
    nama: {
      type: String,
      required: [true, 'Nama alamat harus diisi'],
      maxLength: [255, 'Panjang maksimal nama alamat adalah 255 karakter'],
    },
    kelurahan: {
      type: String,
      required: [true, 'Kecamatan harus diisi'],
      maxLength: [255, 'Panjang maksimal kecamatan adalah 255'],
    },
    kabupaten: {
      type: String,
      require: [true, 'Kabupaten harus diisi'],
      maxLength: [255, 'Panjang maksimal kabupaten 255 karakter'],
    },
    provinsi: {
      type: String,
      require: [true, 'Provinsi harus diisi'],
      maxLength: [255, 'Panjang maksimal provinsi 255 karakter'],
    },
    detail: {
      type: String,
      require: [true, 'Detail alamat harus diisi'],
      maxLength: [1000, 'Panjang maksimal detail alamat 1000 karakter'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { TimeRanges: true }
);

module.exports = model('DeliveryAddress', deliveryAddressSchema);

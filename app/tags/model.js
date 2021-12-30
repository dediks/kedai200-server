const mongoose = require('mongoose');

const { model, Schema } = mongoose;

const tagSchema = Schema({
  name: {
    type: String,
    minLength: [3, 'Nama tags minimal 3 karakter'],
    maxLength: [54, 'Nama tags maks 54 karakter'],
    required: [true, 'Nama tags harus diisi'],
  },
});

module.exports = model('Tag', tagSchema);

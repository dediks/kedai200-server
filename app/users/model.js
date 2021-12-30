const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const HASH_ROUND = 10;

const userSchema = Schema(
  {
    full_name: {
      type: String,
      required: [true, 'Nama harus diisi'],
      maxLength: [255, 'Panjang nama harus antara 3 - 255 karakter'],
      minLength: [3, 'Panjang nama harus antara 3 - 255 karakter'],
    },
    customer_id: {
      type: Number,
    },
    email: {
      type: String,
      required: [true, 'Email harus diisi'],
      maxLength: [255, 'Panjang email maks 255 karakter'],
    },
    password: {
      type: String,
      required: [true, 'Password harus diisi'],
      minLength: [8, 'Password minimal 8 karakter'],
      maxLength: [255, 'Panjang maks password 255 karakter'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    token: [String],
  },
  { timestamps: true }
);

userSchema.path('email').validate(
  function (value) {
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,3})?$/;

    return EMAIL_RE.test(value);
  },
  (attr) => `${attr.value} harus merupakan email yang valid!`
);

userSchema.path('email').validate(
  async function (value) {
    try {
      const count = await this.model('User').count({ email: value });

      return !count;
    } catch (error) {
      throw error;
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
);

userSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);

  next();
});

userSchema.plugin(AutoIncrement, { inc_field: 'customer_id' });

module.exports = model('User', userSchema);

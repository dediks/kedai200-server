const fs = require('fs');
const path = require('path');
const config = require('../config');
const Product = require('./model');
const Category = require('../categories/model');
const Tag = require('../tags/model');

async function index(req, res, next) {
  try {
    let { limit = 10, skip = 0, q = '', category = '', tags = [] } = req.query;

    let criteria = {};

    if (q.length) {
      criteria = { ...criteria, name: { $regex: `${q}`, $options: 'i' } };
    }

    if (category.length) {
      category = await Category.findOne({
        name: { $regex: `${category}`, $options: 'i' },
      });

      if (category) {
        criteria = { ...criteria, category: category._id };
      }
    }

    if (tags.length) {
      tags = await Tag.find({ name: { $in: tags } });

      criteria = { ...criteria, tags: { $in: tags.map((tag) => tag._id) } };
    }

    let products = await Product.find(criteria)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('category')
      .populate('tags');

    return res.json(products);
  } catch (error) {
    next(error);
  }
}

async function store(req, res, next) {
  try {
    let payload = req.body;

    if (payload.category) {
      const category = await Category.findOne({
        name: { $regex: payload.category, $options: 'i' },
      });

      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length) {
      let tags = await Tag.find({ name: { $in: payload.tags } });

      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      }
    }

    if (req.file) {
      let tmp_path = req.file.path;

      // let originalExt =
      //   req.file.originalname.split('.')[
      //     req.file.originalname.split('.').length - 1
      //   ];

      let originalExt = path.extname(req.file.originalname);

      let filename = req.file.filename + originalExt;

      let target_path = path.resolve(
        config.rootPath,
        `public/upload/${filename}`
      );

      // baca file yang masih berada di lokasi sementara
      const src = fs.createReadStream(tmp_path);

      // pindahkan file ke lokasi permanen
      const dest = fs.createWriteStream(target_path);

      // memindahkan file dari src ke dest
      src.pipe(dest);

      src.on('end', async () => {
        // try-catch lagi. karena try catch global / atas ini tidak mengcover di event
        try {
          let product = new Product({ ...payload, image_url: filename });

          await product.save();
          return res.json(product);
        } catch (error) {
          // hapus file yang sudah terupload didirektori
          fs.unlinkSync(target_path);

          // cek apakah error disebabkan oleh validasi mongodb
          if (error && err.name === 'ValidationError') {
            return res.json({
              error: 1,
              message: error.message,
              fields: error.errors,
            });
          }

          // error lainnya
          next(error);
        }
      });

      src.on('error', async () => {
        next(error);
      });
    } else {
      let product = new Product(payload);

      await product.save();

      return res.json(product);
    }
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
  try {
    let payload = req.body;

    if (payload.category) {
      const category = await Category.findOne({
        name: { $regex: payload.category, $options: 'i' },
      });

      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length) {
      let tags = await Tag.find({ name: { $in: payload.tags } });

      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      }
    }

    if (req.file) {
      let tmp_path = req.file.path;

      let originalExt = path.extname(req.file.originalname);

      let filename = req.file.filename + originalExt;

      let target_path = path.resolve(
        config.rootPath,
        `public/upload/${filename}`
      );

      // baca file yang masih berada di lokasi sementara
      const src = fs.createReadStream(tmp_path);

      // pindahkan file ke lokasi permanen
      const dest = fs.createWriteStream(target_path);

      // memindahkan file dari src ke dest
      src.pipe(dest);

      src.on('end', async () => {
        // try-catch lagi. karena try catch global / atas ini tidak mengcover di event
        try {
          let product = await Product.findOne({ _id: req.params.id });

          let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;

          console.info('current images', currentImage);

          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }

          product = await Product.findOneAndUpdate(
            { _id: req.params.id },
            { ...payload, image_url: filename },
            { new: true, runValidators: true }
          );

          return res.json(product);
        } catch (error) {
          // hapus file yang sudah terupload didirektori
          fs.unlinkSync(target_path);

          // cek apakah error disebabkan oleh validasi mongodb
          if (error && err.name === 'ValidationError') {
            return res.json({
              error: 1,
              message: error.message,
              fields: error.errors,
            });
          }

          // error lainnya
          next(error);
        }
      });

      src.on('error', async () => {
        next(error);
      });
    } else {
      let product = await Product.findByIdAndUpdate(
        { _id: req.params.id },
        payload,
        { new: true, runValidators: true }
      );

      return res.json(product);
    }
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

async function destroy(req, res, next) {
  try {
    let product = await Product.findOneAndDelete({ _id: req.params.id });

    let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;

    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }

    return res.json(product);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  index,
  store,
  update,
  destroy,
};

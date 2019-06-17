const Database = require('./index');

const connection = new Database({
  databaseName: 'stats.db',
  collections: ['days']
});

const addProductId = function addProductId(imageId, productId) {
  const ids = connection.getCollection('ids');
  return ids.insert({
    imageId,
    productId
  });
}

const getProductId = function getProductId(imageId) {
  const ids = connection.getCollection('ids');
  return ids.findOne({ imageId });
}

const addProduct = function addProduct(product) {
  const products = connection.getCollection('products');
  return products.insert(product);
}

const getProduct = function getProduct(id) {
  const products = connection.getCollection('products');
  return products.findOne({ id });
}

const getProductByImageId = function getProductByImageId(imageId) {
  const obj = getProductId(imageId);
  if (obj) {
    return getProduct(obj.productId);
  }
  return null;
}

// export for use elsewhere
module.exports = {
  connection,
  addProduct,
  getProduct,
  addStock,
  updateStock,
  getStock,
  addProductId,
  getProductId,
  getProductByImageId
};
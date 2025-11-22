// database/index.js
const users = require('./users.json');
const categories = require('./categories.json');
const restaurants = require('./restaurants.json');
const menuItems = require('./menuItems.json');
const orders = require('./orders.json');

module.exports = () => ({
  users: users,
  categories: categories,
  restaurants: restaurants,
  menuItems: menuItems,
  orders: orders
});

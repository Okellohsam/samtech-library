const bcrypt = require('bcrypt');

const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (admin && (await bcrypt.compare(password, admin.password))) {

    res.json({
      _id: admin._id,
      username: admin.username,
      token: generateToken(admin._id)
    });

  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
};

module.exports = {
  loginAdmin
};
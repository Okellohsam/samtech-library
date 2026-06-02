const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const connectDB = require('../config/db');

const Admin = require('../models/Admin');

dotenv.config();

connectDB();

const seedAdmin = async () => {

  try {

    const hashedPassword =
      await bcrypt.hash('samtech123', 10);

    await Admin.deleteMany();

    await Admin.create({

      username: 'samtechadmin',

      password: hashedPassword

    });

    console.log('Admin created successfully');

    process.exit();

  } catch (error) {

    console.error(error);

    process.exit(1);

  }

};

seedAdmin();
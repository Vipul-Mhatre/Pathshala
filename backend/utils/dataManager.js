const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

class DataManager {
  static async addUser(model, userData, jsonFilePath) {
    try {
      // Save to MongoDB
      const user = new model(userData);
      await user.save();

      // Read existing JSON file
      const filePath = path.join(__dirname, `../data/${jsonFilePath}`);
      let jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Add new user to JSON data
      jsonData.push({
        _id: user._id.toString(),
        ...userData
      });

      // Write updated JSON file
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

      return user;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }
}

module.exports = DataManager; 
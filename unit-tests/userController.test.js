const User = require('../models/User');
const userController = require('./userController');

jest.mock('../models/User');

describe('userController', () => {
  describe('updateUser', () => {
    test('should update user and return the updated user', async () => {
      // Arrange
      const id = '123456789';
      const password = 'newpassword';
      const role = 'admin';
      const firstName = 'John';
      const middleName = 'Doe';
      const lastName = 'Smith';
      const graduationYear = 2022;
      const major = 'Computer Science';
      const email = 'john.doe@example.com';
      const bio = 'Lorem ipsum dolor sit amet';
      const profilePicture = 'profile.jpg';

      const updatedUser = {
        _id: id,
        password,
        role,
        firstName,
        middleName,
        lastName,
        graduationYear,
        major,
        email,
        bio,
        profilePicture,
      };

      User.findByIdAndUpdate.mockResolvedValue(updatedUser);

      // Act
      const result = await userController.updateUser(id, {
        password,
        role,
        firstName,
        middleName,
        lastName,
        graduationYear,
        major,
        email,
        bio,
        profilePicture,
      });

      // Assert
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        {
          password,
          role,
          firstName,
          middleName,
          lastName,
          graduationYear,
          major,
          email,
          bio,
          profilePicture,
        },
        { new: true }
      );
      expect(result).toEqual(updatedUser);
    });
  });
});
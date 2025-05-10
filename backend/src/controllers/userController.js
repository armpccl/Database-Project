import User from '../models/User.js';

export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userID);

    if (user) {
      const { fname, lname, phone, house_number, building, moo, village, soi, road, sub_district, district, province, postal_code } = req.body;

      const updateData = {
        fname: fname || user.fname,
        lname: lname || user.lname,
        phone: phone || user.phone,
        house_number: house_number, // Allow null/empty to clear
        building: building,
        moo: moo,
        village: village,
        soi: soi,
        road: road,
        sub_district: sub_district,
        district: district,
        province: province,
        postal_code: postal_code,
      };

      const result = await User.updateProfile(req.user.userID, updateData);

      if (result.affectedRows > 0 || result.message) {
         const updatedUser = await User.findById(req.user.userID);
         res.json(updatedUser);
      } else {
         res.status(400);
         throw new Error('Could not update user profile.');
      }

    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

export const updateUserPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        res.status(400);
        throw new Error('Old and new passwords are required.');
    }

    const user = await User.findByEmail(req.user.email); // Fetch user with password hash

    if (user && (await comparePassword(oldPassword, user.password))) {
        if (newPassword.length < 6) { // Example validation
            res.status(400);
            throw new Error('New password must be at least 6 characters long.');
        }
        await User.updatePassword(req.user.userID, newPassword);
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(401);
        throw new Error('Invalid old password.');
    }
  } catch (error) {
    next(error);
  }
};

// Placeholder for sending questions (might belong to a different controller like questionController)
export const submitQuestion = async (req, res, next) => {
    // This should ideally be in a `questionController.js` and `questionModel.js`
    // See `questionController.js` for a more complete example.
    try {
        const { qna_type, description } = req.body;
        const userID = req.user.userID;

        if (!description) {
            res.status(400);
            throw new Error('Question description cannot be empty.');
        }
        // Add to Question table logic here (using a Question model)
        // e.g., await Question.create({ userID, qna_type, description });
        res.status(201).json({ message: 'Question submitted successfully.' });
    } catch (error) {
        next(error);
    }
};
const { User, Thoughts } = require('../models');

const userController = {

  getAllUser(req, res) {
    // Find all users in the user document 
    User.find({})
      .select('-__v')
      .sort({ _id: -1 })
      // Sort ids in descending order 
      .then(dbUserData => res.json(dbUserData))
      // send results as json data 
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  getUserById({ params }, res) {
    User.findOne({ _id: params.id }) // Find a user by its ID passed as parameter
      .populate({
        path: 'thoughts', // Populate user's thoughts array with its associated data
        select: '-__v' // Exclude the __v field from the selected data
      })
      .populate({
        path: 'friends', // Populate user's friends array with its associated data
        select: '-__v' // Exclude the __v field from the selected data
      })
      .then(dbUserData => {
        if (!dbUserData) { // If no user found, send a 404 error message
          res.status(404).json({ message: 'No User found with this id!' });
          return;
        }
        res.json(dbUserData); // If user found, send the user data as response
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(400); // If an error occurs, send a 400 error status
      });
  },

  createUser({ body }, res) {
    // Creates a user using information obtained from request body 
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  },

  updateUser({ params, body }, res) {
    // find a user by id and update it with the provided data
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbUserData => {
        // if no user was found with the given id, send a 404 status with an error message
        if (!dbUserData) {
          res.status(404).json({ message: 'No User found with this id!' });
          return;
        }
        // if the update was successful, send the updated user data
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },  

  deleteUser({ params }, res) {
    // Delete all the thoughts associated with the user first
    Thoughts.deleteMany({ _id: params.id })
      .then(() => {
        // Once all the thoughts are deleted, delete the user
        User.findOneAndDelete({ _id: params.id })
          .then(dbUserData => {
            // If no user is found with the given id, return a 404 status
            if (!dbUserData) {
              res.status(404).json({ message: 'No User found with this id!' });
              return;
            }
            // Return the deleted user as a response
            res.json(dbUserData);
          });
      })
      .catch(err => res.json(err));
  },  
  
  addFriend({ params }, res) {
    // Find the user by the given userId and update their friends array with the friendId
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } },
      { new: true } // return the updated user data
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId }, // Find user by ID parameter passed in request
      { $pull: { friends: params.friendId } }, // Pull friendId from user's friends array
      { new: true } // Return the updated user object
    )
      .then((dbUserData) => {
        if (!dbUserData) { // If no user is found with the given ID, return error
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData); // Return updated user object
      })
      .catch((err) => res.status(400).json(err)); // Return error if any occurs
  }
};

module.exports = userController
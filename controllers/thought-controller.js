const { User, Thoughts} = require('../models');

const ThoughtsController = {

  getAllThoughts(req, res) {
    // Get all thoughts from the database
    Thoughts.find({})
    // Populate the reactions of each thought with its associated data
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      // Sort thoughts by descending _id
      .sort({ _id: -1 })
      // Return response as JSON
      .then(dbThoughtsData => res.json(dbThoughtsData))
      // If error, log it and send 400 status code in response 
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  getThoughtsById({ params }, res) {
    // Find a thought by its _id in database
    Thoughts.findOne({ _id: params.id })
    // Populate reactions field of the thought with its associated data 
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      // Sort by descending _id
      .sort({ _id: -1 })
      // Return response as JSON data 
      .then(dbThoughtsData => {
        // If error, log it and send 404 status code in response 
        if (!dbThoughtsData) {
          res.status(404).json({ message: 'No Thoughts found with that id!' });
          return;
        }
        res.json(dbThoughtsData);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  createThoughts({ body }, res) {
    //  Create new thought in the database with data from request body 
    Thoughts.create(body)
    // Add the _id of the new thought to the 'thoughts' field from associated user
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: _id } },
                { new: true }
            );
        })
        // Return updated user object in response as JSON
        .then(dbThoughtsData => {
          // If no user is found, send a 404 status code in the response with an error message
            if (!dbThoughtsData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbThoughtsData);
        })
        .catch(err => res.json(err));
},

  updateThoughts({ params, body }, res) {
    // Find a thought by its _id and update data from the request body
    Thoughts.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
    // Return the updated thought object in response as JSON
      .then(dbThoughtsData => {
         // If no thought is found, send a 404 status code in the response with an error message
        if (!dbThoughtsData) {
          res.status(404).json({ message: 'No Thoughts found with that id!' });
          return;
        }
        res.json(dbThoughtsData);
      })
      .catch(err => res.json(err));
  },

  deleteThoughts({ params }, res) {
    // Find a thought by its _id and delete thought 
    Thoughts.findOneAndDelete({ _id: params.id })
    // Return deleted thought as JSON data 
      .then(dbThoughtsData => {
        // If no thought is found, send status 404 code in response with error message 
        if (!dbThoughtsData) {
          res.status(404).json({ message: 'No Thoughts found with that id!' });
          return;
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { Thoughts: params.Id } },
          { new: true }
        )
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No User found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  createReaction({params, body}, res) {
    // Find a single thought by its id and update its reactions array with new reaction
    Thoughts.findOneAndUpdate(
      {_id: params.thoughtId}, 
      {$push: {reactions: body}}, 
      {new: true, runValidators: true})
      // Populate reactions array in thought document to display reaction 
    .populate({path: 'reactions', select: '-__v'})
    .select('-__v')
    .then(dbThoughtsData => {
        if (!dbThoughtsData) {
            res.status(404).json({message: 'No Thoughts with this ID.'});
            return;
        }
        // Return updated thought with new reaction 
        res.json(dbThoughtsData);
    })
    .catch(err => res.status(400).json(err))
},

  deleteReaction({ params }, res) {
    // Find a single thought by its id and update the reactions array to delete the reaction by id
    Thoughts.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then(dbThoughtsData => {
        // If thought is not found return error message 
        if (!dbThoughtsData) {
          res.status(404).json({ message: 'Nope!'});
          return;
        }
        // Return updated thought with specified reaction removed 
       res.json(dbThoughtsData);
      })
      .catch(err => res.json(err));
  }


};

module.exports = ThoughtsController
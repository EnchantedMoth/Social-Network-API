const { Thought, User } = require('../models')

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            return res.json (thoughts);
        } catch (err) {
            return res.status(500).json(err)
        }
    },

    async getThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
            if (!thought) {
                return res.status(404).json({ message: "No thought with this ID found" });
            }
            return res.json(thought);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    async createThought(req, res) {
        try{
            const thought = await Thought.create(req.body)
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought._id }},
                {new: true}
            );

            if (!user) {
                return res.status(404).json({
                  message: 'Thought created, but found no user with that ID',
                })
            }
            res.status(200).json({ thought: thought, user: user})
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
        
            if (!thought) {
                return res.status(404).json({ message: "No thought with this ID found." });
            }
        
            res.status(200).json(thought);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndRemove({_id: req.params.thoughtId,});
            if (!thought) {
                return res.status(404).json({ message: "No thought with this ID found" });
          }
            return res.json({ message: "Deleted thought" });
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    async postReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: newReaction } },
                { runValidators: true, new: true }
          );
          if (!thought) {
            return res.status(404).json({ message: "No thought with this ID found" });
          }
            return res.json(thought);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
          );
          if (!thought) {
            return res.status(404).json({ message: "No thought with this ID found" });
          }
            return res.json(thought);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
        
}
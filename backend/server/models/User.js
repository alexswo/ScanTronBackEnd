// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const mongooseTypes = mongoose.Schema.Types;

// let UserIDSchema = new mongoose.Schema(
//     {
//         id: Number,
//         chef: Boolean
//     }
// );

let EventSchema = new mongoose.Schema(
    {
        title: String,
        time: /*mongooseTypes.Date*/Number, // Epoch time
        date: String,
        tags: [ String ],
        chef_id: Number,
        host_id: Number,
        dishes: [ String ],
    }
);

let ReviewSchema = new mongoose.Schema(
    {
        rating: Number,
        // reviewer: UserSchema,
        subject_id: Number
    }
);


let UserSchema = new mongoose.Schema(
    {
        id: Number,
        _id: Number,
        name: { type: String, required: true },
        password: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        zipcode: Number,
        description: String,
        events: [ EventSchema ],
        //incomingReviews: [ ReviewSchema ],
        outgoingReviews: [ ReviewSchema ],
        dishes: [ String ],
        tags: [ String ],
        chef: { type: Boolean, default: false, required: true }
    }
);

UserSchema.statics.getUser = function (_name) {
    this.find({'name': _name}).then((user) => {
        return user
    })
};

UserSchema.statics.getUserByID = function (id) {
  return (User.findById(id, function(err, user) {
    if (err) throw err;
    return user
  }))
};

UserSchema.methods.updateUser = function (id, change) {
    this.findByIdAndUpdate(id, change, function(err, user) {
      if (err) throw err;
      return user;
    })
};

UserSchema.methods.writeReview = function (_review) {
    id = _review._id;
    if (!this.outgoingReviews.includes(id)) {
        this.outgoingReviews.push(id)
    }
    this.save(function(err, user) { if (err) throw err; });
};

UserSchema.methods.receiveReview = function (_review) {
    id = _review._id;
    if (!this.incomingReviews.includes(id)) {
        this.incomingReviews.push(id)
    }
    this.save(function(err, user) { if (err) throw err; });
};

/**
 * Hash password before saving to the database.
 */
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

/**
 * Authenticate input against database
 */
UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
};

var User = mongoose.model('User', UserSchema);
module.exports = User;

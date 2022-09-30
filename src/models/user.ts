import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 5,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    from: {
      type: String,
      max: 50,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);

import mongoose, { Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string | undefined;
  passwordChangedAt: Date;
  active: boolean;
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: Date): boolean;
}

interface IUserMethods {
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}

type UserModel = mongoose.Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (this: IUser, el: any) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }

  const date = (Date.now() - 1000) as unknown as Date;
  this.passwordChangedAt = date;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    let changedTimestamp = this.passwordChangedAt.getTime() / 1000;

    changedTimestamp = parseInt(changedTimestamp.toString(), 10);

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

const User = mongoose.model<IUser, UserModel>('UserAuth', userSchema);

export default User;
export { IUser, IUserMethods };

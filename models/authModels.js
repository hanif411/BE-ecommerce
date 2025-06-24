import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true,'nama harus di isi'],
    unique:[true,'name sudah di gunakan silahkan buat name yang lain']
  },
  email: {
    type: String,
    required: [true,'email harus di isi'],
    unique:[true,'email sudah di gunakan silahkan buat email yang lain'],
    validate: {
      validator: validator.isEmail,
      message: 'email tidak valid',
    }
  },
  password: {
    type: String,
    required: [true,'password harus di isi'],
    minLength: [8,'password harus di isi minimal 8 karakter'],
    select: false
  },
  role: {
    type: String,
    required:[true,'role harus di isi'],
    enum: ['admin','owner'],
    default: 'admin'
  }
});

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

userSchema.methods.comparePassword = async function (reqbodypassword) {
  return await bcrypt.compare(reqbodypassword, this.password)
}


const User = mongoose.model('User', userSchema);
export default User;
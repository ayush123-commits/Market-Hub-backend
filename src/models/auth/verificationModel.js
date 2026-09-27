import mongoose from 'mongoose'


const verificationTokenSchema = new mongoose.Schema({
  userId : {
    type: mongoose.Schema.Types.ObjectId,
    ref : "User",
    required: true
  },
  purpose: {
    type: String,
    enum: ["EMAIL_VERIFICATION", "PASSWORD_RESET"],
    required: true
  },

  codeHash: {
    type: String,
    required: true
  },

  expiresAt: {
    type: Date,
    required: true
  }
})

verificationTokenSchema.index(
  { userId: 1, purpose: 1 },
  { unique: true }
);

const VerificationToken = mongoose.model(
  "VerificationToken",
  verificationTokenSchema
);

export default VerificationToken;
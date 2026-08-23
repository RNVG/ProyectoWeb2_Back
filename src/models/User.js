import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    profilePicture: {
      type: String,
      default: null,
      trim: true
    },

    role: {
      type: String,
      enum: ["admin", "organizer", "user"],
      default: "user"
    },

    isActive: {
      type: Boolean,
      default: true
    },

    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return
  }

  this.password = await bcrypt.hash(
    this.password,
    12
  )
})

userSchema.methods.comparePassword = async function (
  candidatePassword
) {
  return bcrypt.compare(
    candidatePassword,
    this.password
  )
}

const User = mongoose.model(
  "User",
  userSchema
)

export default User
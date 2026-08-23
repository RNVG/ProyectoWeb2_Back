import mongoose from "mongoose"

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    description: {
      type: String,
      default: "",
      trim: true
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

categorySchema.pre("validate", function () {
  if (this.isModified("name") || !this.slug) {
    this.slug = this.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }
})

const Category = mongoose.model("Category", categorySchema)

export default Category
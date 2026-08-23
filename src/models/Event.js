import mongoose from "mongoose"

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    modality: {
      type: String,
      enum: ["in-person", "virtual", "hybrid"],
      default: "in-person"
    },

    location: {
      name: {
        type: String,
        default: "",
        trim: true
      },

      address: {
        type: String,
        default: "",
        trim: true
      },

      virtualUrl: {
        type: String,
        default: null,
        trim: true
      }
    },

    capacity: {
      type: Number,
      required: true,
      min: 1
    },

    imageUrl: {
      type: String,
      default: null,
      trim: true
    },

    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "draft"
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

eventSchema.pre("validate", function () {
  if (
    this.startDate &&
    this.endDate &&
    this.endDate <= this.startDate
  ) {
    this.invalidate(
      "endDate",
      "La fecha de finalización debe ser posterior a la fecha de inicio"
    )
  }
})

const Event = mongoose.model("Event", eventSchema)

export default Event
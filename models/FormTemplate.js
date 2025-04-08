import mongoose from "mongoose";
const formTemplateSchema = new mongoose.Schema({
  sem: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  questions: [
    {
      label: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["text", "multiple_choice"],
        required: true,
      },
      required: {
        type: Boolean,
        default: true,
      },
      options: {
        type: [String],
        default: [],
      },
    },
  ],
}, {
  collection: "formtemplates"
});


const FormTemplate = mongoose.model("FormTemplate", formTemplateSchema);
export default FormTemplate;

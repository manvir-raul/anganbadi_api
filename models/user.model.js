const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      full_name: { type: String, required: true },
      first_name: { type: String, required: true },
      middle_name: String,
      last_name: String,
      email: { type: String, lowercase: true, required: true, trim: true },
      password: String,
      role: String,
    },
    {
      virtuals: {
        name: {
          get() {
            return (
              this.first_name + " " + this.middle_name + " " + this.last_name
            );
          },
          set(v) {
            const name = v.split(" ");
            this.first_name = name[0];
            this.middle_name = name[1];
            this.last_name = name[2];
            this.full_name = v;
          },
        },
      },
    }
  )
);

module.exports = User;

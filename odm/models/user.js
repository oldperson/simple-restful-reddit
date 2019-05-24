
module.exports = {
  schema: {
    // userId: {
    // },
    userName: {
      type: String,
      maxlength: 20,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      maxlength: 320,
      required: true,
    },
    passwordHash: {
      type: String,
      maxlength: 60,
      required: true,
    },
  },
  methods: {},
  statucs: {},
};

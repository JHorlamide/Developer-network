const mongoose = require('mongoose');
const Joi = require('joi');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  company: {
    type: String,
  },

  website: {
    type: String,
  },
  location: {
    type: String,
  },

  status: {
    type: String,
    required: true,
  },

  skills: {
    type: [String],
    required: true,
  },

  bio: {
    type: String,
  },

  githubusername: {
    type: String,
  },

  experience: [
    {
      title: {
        type: String,
        required: true,
      },

      company: {
        type: String,
        required: true,
      },

      location: {
        type: String,
      },

      from: {
        type: Date,
        required: true,
      },

      to: {
        type: Date,
      },

      current: {
        type: Boolean,
        default: false,
      },

      description: {
        type: String,
      },
    },
  ],

  education: [
    {
      school: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
      fieldofstudy: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },

      description: {
        type: String,
      },
    },
  ],

  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Profile = mongoose.model('Profile', ProfileSchema);

/* Validate skills and status for Profile creation */
const validateProfile = (profile) => {
  const schema = Joi.object({
    status: Joi.string().required(),
    skills: Joi.string().required(),
  });

  return schema.validate(profile);
};

/* Validate experience */
const validateExp = (exp) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    company: Joi.string().required(),
    from: Joi.string().required().messages({
      'any.required': 'From date is required',
    }),
  });

  return schema.validate(exp);
};

/* Validate Education */
const validateEdu = (edu) => {
  const schema = Joi.object({
    school: Joi.string().required(),
    degree: Joi.string().required(),
    fieldofstudy: Joi.string().required(),
    from: Joi.string().required().messages({
      'any.required': 'From date is required',
    }),
  });

  return schema.validate(edu);
};

exports.validateProfile = validateProfile;
exports.validateExp = validateExp;
exports.validateEdu = validateEdu;
exports.Profile = Profile;

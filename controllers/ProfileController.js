const request = require('request');
const config = require('config');
const asyncMiddleware = require('../middleware/async');
const User = require('../model/User');
const {
  Profile,
  validateProfile,
  validateExp,
  validateEdu,
} = require('../model/Profile');

/***
 * @router  GET: api/profile/me
 * @desc    Get current user profile
 * @access  Private
 * ***/
const getProfile = asyncMiddleware(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id }).populate(
    'user',
    ['name', 'avatar']
  );

  if (!profile) {
    return res.status(400).json({ msg: 'There is no profile for this user' });
  }

  res.json({ profile });
});

/***
 * @router  POST: api/profile/me
 * @desc    Create or Update user profile
 * @access  Private
 * ***/
const createAndUpdateProfile = asyncMiddleware(async (req, res) => {
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
  } = req.body;

  const { error } = validateProfile({ status, skills });

  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  /* Build Profile Object */
  const profileFields = {};
  profileFields.user = req.user.id;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  if (skills) {
    profileFields.skills = skills.split(',').map((skill) => {
      return skill.trim();
    });
  }

  /* Build Profile Social */
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;

  let profile = await Profile.findOne({ user: req.user.id });

  if (profile) {
    /* Update Profile*/
    profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true }
    );

    return res.json({ profile });
  }

  profile = new Profile(profileFields);
  await profile.save();

  res.json({ profile });
});

/***
 * @router  GET: api/profile
 * @desc    Get all profiles
 * @access  Public
 * ***/
const getProfiles = asyncMiddleware(async (req, res) => {
  const profiles = await Profile.find().populate('user', ['name', 'avatar']);
  res.json({ profiles });
});

/***
 * @router  GET: api/profile/user/user_id
 * @desc    Get profile by Id.
 * @access  Private
 * ***/
const getProfileById = asyncMiddleware(async (req, res) => {
  const profile = await Profile.findOne({
    user: req.params.user_id,
  }).populate('user', ['name', 'avatar']);

  if (!profile) {
    return res.status(404).json({ msg: 'Profile not found' });
  }

  res.json({ profile });
});

/***
 * @router  DELETE: api/profile/
 * @desc    Delete profile, user, and post
 * @access  Private
 * ***/
const deleteProileAndUser = asyncMiddleware(async (req, res) => {
  // @todo - Remove user posts

  /* Delete Profile */
  await Profile.findOneAndRemove({ user: req.user.id });

  /* Delete User */
  await User.findOneAndRemove({ _id: req.user.id });

  res.json({ msg: 'User deleted' });
});

/***
 * @router  PUT: api/profile/experience
 * @desc    Put user profile experience
 * @access  Private
 * ***/
const addProfileExperience = asyncMiddleware(async (req, res) => {
  const { title, company, from, location, to, current, description } = req.body;

  const { error } = validateExp({ title, company, from });

  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  const newExp = {
    title,
    company,
    from,
    location,
    to,
    current,
    description,
  };

  const profile = await Profile.findOne({ user: req.user.id });

  profile.experience.unshift(newExp);

  await profile.save();

  res.json({ profile });
});

/***
 * @router  DELETE: api/profile/experience/:exp_id
 * @desc    Delete exeperience from profile
 * @access  Private
 * ***/
const deleteExperience = asyncMiddleware(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });

  const removeIndex = profile.experience
    .map((exp) => {
      return exp.id;
    })
    .indexOf(req.params.exp_id);

  profile.experience.splice(removeIndex, 1);

  await profile.save();

  res.json({ profile });
});

/***
 * @router  PUT: api/profile/education/
 * @desc    Add education to profile
 * @access  Private
 * ***/
const addProfileEducation = asyncMiddleware(async (req, res) => {
  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  } = req.body;

  const { error } = validateEdu({
    school,
    degree,
    fieldofstudy,
    from,
  });

  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  const profile = await Profile.findOne({ user: req.user.id });

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  };

  profile.education.unshift(newEdu);

  await profile.save();

  res.json({ profile });
});

/***
 * @router  DELETE: api/profile/education/:edu_id
 * @desc    Delete education profile
 * @access  Private
 * ***/
const deleteEducation = asyncMiddleware(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });

  const removeIndex = profile.education
    .map((edu) => {
      return edu.id;
    })
    .indexOf(req.params.edu_id);

  profile.education.splice(removeIndex, 1);

  await profile.save();

  res.json({ profile });
});

/***
 * @router  DELETE: api/profile/github/:username
 * @desc    Get user repos from Github
 * @access  Public
 * ***/
const getGithubRepos = asyncMiddleware(async (req, res) => {
  const options = {
    uri: `https://api.github.com/users/${
      req.params.username
    }/repos?per_page=5&sort=created:asc&client_id=${config.get(
      'githubClientId'
    )}&client_secret=${config.get('githubSecret')}`,
    method: 'GET',
    headers: { 'user-agent': 'node.js' },
  };

  request(options, (error, response, body) => {
    if (error) {
      console.log(error);
    }

    if (response.statusCode !== 200) {
      return res.status(404).json({ msg: 'No Github profile found' });
    }

    res.json(JSON.parse(body));
  });
});

module.exports = {
  getProfile,
  createAndUpdateProfile,
  getProfiles,
  getProfileById,
  deleteProileAndUser,
  addProfileExperience,
  deleteExperience,
  addProfileEducation,
  deleteEducation,
  getGithubRepos,
};

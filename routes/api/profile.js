const express = require('express');

/* Routes Controller */
const auth = require('../../middleware/auth');
const ProfileController = require('../../controllers/ProfileController');

const router = express.Router();

/***
 * @router  GET: api/profile/me
 * ***/
router.get('/me', auth, ProfileController.getProfile);

/***
 * @router  POST: api/profile
 * ***/
router.post('/', auth, ProfileController.createAndUpdateProfile);

/***
 * @router  GET: api/profile
 * ***/
router.get('/', ProfileController.getProfiles);

/***
 * @router  GET: api/profile/user/:user_id
 * ***/
router.get('/user/:user_id', ProfileController.getProfileById);

/***
 * @router  DELETE: api/profile/
 * ***/
router.delete('/', auth, ProfileController.deleteProileAndUser);

/***
 * @router  PUT: api/profile/experience
 * ***/
router.put('/experience', auth, ProfileController.addProfileExperience);

/***
 * @router  DELETE: api/profile/experience/:exp_id
 * ***/
router.delete('/experience/:exp_id', auth, ProfileController.deleteExperience);

/***
 * @router  PUT: api/profile/education/
 * ***/
router.put('/education/', auth, ProfileController.addProfileEducation);

/***
 * @router  DELETE: api/profile/experience/:edu_id
 * ***/
router.delete('/education/:edu_id', auth, ProfileController.deleteEducation);

/***
 * @router  DELETE: api/profile/github/:username
 * ***/
router.get('/github/:username', ProfileController.getGithubRepos);

module.exports = router;

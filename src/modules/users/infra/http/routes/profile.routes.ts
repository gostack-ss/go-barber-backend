import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlwares/ensureAuthenticated';

import ProfileControler from '@modules/users/infra/http/controllers/ProfileControler';

const profileRouter = Router();

profileRouter.use(ensureAuthenticated);

const profileControler = new ProfileControler();

profileRouter.get('/', profileControler.show);
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profileControler.update
);

export default profileRouter;

import { ApiError } from '../utils/ApiError.js';
import { verifyChallenge } from '../services/captcha.service.js';

const MESSAGES = {
  missing: 'Please solve the security check',
  malformed: 'Security check failed — please try the new one',
  expired: 'The security check expired — please try the new one',
  used: 'That security check was already used — please try the new one',
  wrong: 'Incorrect answer to the security check',
};

/**
 * Requires `captchaToken` + `captchaAnswer` in the body and strips both before
 * validation, so schemas and controllers never see them.
 */
export function requireCaptcha(req, _res, next) {
  const { captchaToken, captchaAnswer, ...rest } = req.body || {};
  const result = verifyChallenge(captchaToken, captchaAnswer);
  if (!result.ok) {
    return next(ApiError.badRequest(MESSAGES[result.reason], [{ field: 'captcha', message: MESSAGES[result.reason] }]));
  }
  req.body = rest;
  return next();
}

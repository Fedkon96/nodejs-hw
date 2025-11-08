import crypto from 'crypto';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';
import { Session } from '../models/session.js';

export const createSession = async (userId) => {
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });

  return session;
};

export const setSessionCookies = (res, session) => {
  const secureFlag = process.env.NODE_ENV === 'production';
  const cookieBase = {
    httpOnly: true,
    secure: secureFlag,
    sameSite: secureFlag ? 'none' : 'lax',
  };

  res.cookie('accessToken', session.accessToken, {
    ...cookieBase,
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', session.refreshToken, {
    ...cookieBase,
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', session._id.toString(), {
    ...cookieBase,
    maxAge: ONE_DAY,
  });
};

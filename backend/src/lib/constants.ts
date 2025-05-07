import { verify } from 'crypto';

const ERROR_MESSAGE = {
  badRequest: {
    success: false,
    status: 400,
    message: 'Bad Request',
  },
  friendAddError: {
    success: false,
    status: 400,
    message: 'Already friend',
  },
  friendCancelError: {
    success: false,
    status: 400,
    message: 'No Friend',
  },
  unauthorized: {
    success: false,
    status: 401,
    message: 'unauthorized',
  },
  invalidToken: {
    success: false,
    status: 401,
    message: 'Invalid Token',
  },
  expired: {
    success: false,
    status: 401,
    message: 'Token Expired',
  },
  not2FA: {
    success: false,
    status: 401,
    message: 'Two-factor required',
  },
  forbidden: {
    success: false,
    status: 403,
    message: 'Forbidden',
  },
  alreadySignup: {
    success: false,
    status: 403,
    message: 'Already Sign Up',
  },
  notFound: {
    success: false,
    status: 404,
    message: 'Not Found',
  },
  preconditionFailed: {
    success: false,
    status: 412,
    message: 'Precondition Failed',
  },
  serverError: {
    success: false,
    status: 500,
    message: 'Internal Server Error',
  },
} as const;

const SUCCESS_MESSAGE = {
  loginOK: {
    success: true,
    status: 201,
    message: 'Login OK!',
  },
  logoutOK: {
    success: true,
    status: 205,
    message: 'Logout Success!',
  },
  refreshToken: {
    success: true,
    status: 201,
    message: 'refresh Success!',
  },
  accessTokenOK: {
    success: true,
    status: 200,
    message: 'access Token OK!',
  },
  registerOK: {
    status: 201,
    success: true,
    message: 'register Success!',
  },
  generate2FA: {
    status: 200,
    success: true,
    message: '2FA Setup Success!',
  },
  verify2FA: {
    status: 200,
    success: true,
    message: '2FA Verify Success!',
  },
  need2FA: {
    success: true,
    status: 200,
    message: 'tmp Login Success!',
  },
  sendMail: {
    success: true,
    status: 200,
    message: 'send reset email Success!',
  },
  reset2FA: {
    success: true,
    status: 200,
    message: 'reset 2FA Success!',
  },
  updateProfile: {
    success: true,
    status: 200,
    message: 'update profile Success!',
  },
} as const;

export { ERROR_MESSAGE, SUCCESS_MESSAGE };

/* eslint-disable implicit-arrow-linebreak */
export const EMAIL_SUBJECT = {
  SUBJECT_VERIFICATION: 'Account Verification',
  SUBJECT_RESET_PASSWORD: 'Reset Password',
};

export const EMAIL_BODY = {
  BODY_VERIFICATION: (verificationToken: string) =>
    `Click the following link to verify your account: <a href="${process.env.API_URL}/auth/activation/${verificationToken}">Verify Account</a>`,
  BODY_RESET_PASSWORD: (resetToken: string) =>
    `Click the following link to reset the password: <a href="${process.env.API_URL}/auth/reset-password/${resetToken}">Reset Password</a>`,
};

import nodeMailer from 'nodemailer';
import { google } from 'googleapis';
import currentEnv from '../../config/index';

const CLIENT_ID = currentEnv.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = currentEnv.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = currentEnv.GOOGLE_REDIRECT_URI;
const REFRESH_TOKEN = currentEnv.GOOGLE_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

export async function sendMail(email: string, resetToken: string) {
  try {
    const { token } = await oAuth2Client.getAccessToken();

    if (!token) {
      throw new Error('Failed to get access token');
    }

    const transport = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'deliveritplataforma@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: token,
      },
    });

    const mailOptions = {
      from: 'deliveritplataforma@gmail.com',
      to: email,
      subject: 'Reset Password',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Your token is ${resetToken} \n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    const refreshedToken = await oAuth2Client.refreshAccessToken();
    console.log('refreshedToken--------->', refreshedToken);
    throw error;
  }
}

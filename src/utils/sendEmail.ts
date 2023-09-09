import nodeMailer from 'nodemailer';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { google } = require('googleapis');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export async function sendMail(email: string, resetToken: string) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'deliveritplataforma@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
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
    return error;
  }
}

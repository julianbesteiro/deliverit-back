"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const index_1 = __importDefault(require("../../config/index"));
const CLIENT_ID = index_1.default.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = index_1.default.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = index_1.default.GOOGLE_REDIRECT_URI;
const REFRESH_TOKEN = index_1.default.GOOGLE_REFRESH_TOKEN;
const oAuth2Client = new googleapis_1.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
});
function sendMail(email, resetToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token } = yield oAuth2Client.getAccessToken();
            if (!token) {
                throw new Error('Failed to get access token');
            }
            const transport = nodemailer_1.default.createTransport({
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
            const result = yield transport.sendMail(mailOptions);
            return result;
        }
        catch (error) {
            const refreshedToken = yield oAuth2Client.refreshAccessToken();
            console.log('refreshedToken--------->', refreshedToken);
            throw error;
        }
    });
}
exports.sendMail = sendMail;

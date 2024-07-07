import UAParser from 'ua-parser-js';
import dotenv from "dotenv";

dotenv.config();

const accessControl = (req, res, next) => {
    const userAgentString = req.headers['user-agent'];
    const parser = new UAParser();
    const agent = parser.setUA(userAgentString).getResult();

    const isGoogleChrome = agent.browser.name === 'Chrome';
    const isMobileDevice = agent.device.type === 'mobile';
    const isOTPValidated = req.headers['x-otp-validated'] === process.env.HEADER;

    req.deviceType = 'Other';
    if (isMobileDevice) {
        req.deviceType = 'Mobile';
        if (isGoogleChrome) {
            if (isOTPValidated) {
                return next();
            } else {
                return res.status(401).json({ message: "OTP authentication required for Google Chrome users.", fromAccessControl: true, isMobileDevice: true });
            }
        } else {
            req.browserType = 'Other';
            return next();
        }
    }
    else {
        if (isGoogleChrome) {
            if (isOTPValidated) {
                return next();
            } else {
                return res.status(401).json({ message: "OTP authentication required for Google Chrome users.", fromAccessControl: true, isMobileDevice: false });
            }
        } else {
            req.browserType = 'Other';
            return next();
        }
    }
};

export default accessControl; 
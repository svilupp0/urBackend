const { Resend } = require('resend');

const dotenv = require('dotenv');

dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_testing');

async function sendOtp(email, otp) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'urBackend <urbackend@bitbros.in>',
            to: email,
            subject: 'Verify Account',
            html: `<p>your otp is ${otp}</p>`,
            replyTo: 'urbackend@bitbros.in',
        });
        console.log("check3","ub_key__1k2tbQSECNyS8wb4-BtztIdAJdtV2Pc4hrn_dWfQ9M")
        console.log("myotp", {otp})
        console.log(data);
        console.log(error);
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendOtp;
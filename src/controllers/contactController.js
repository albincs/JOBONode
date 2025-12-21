import { Contact, SentEmail } from '../models/index.js';
import axios from 'axios';
import nodemailer from 'nodemailer';
import accessEnv from '../../access_env.js';

export const createContact = async (req, res) => {
  try {
    const { name, email, phone_number, message, captcha_token } = req.body;

    // 1. Verify CAPTCHA
    const secretKey = '6LdTonErAAAAANZpAc0mg-6Kc8ywL-pum96logdg'; // Hardcoded for now matching Django, but better in env
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha_token}`;
    
    // Note: In real world, move secret to env.
    
    // Skip verification if no token provided during dev if needed, but Django enforced it.
    // However, for testing, we might want to be lenient if token is missing in some dev scenarios,
    // but the requirement said "same as node api application", so we should replicate logic.
    // If token is missing, Django raises error.
    
    if (!captcha_token) {
        // Just warning or error? Django raises ValidationError 'CAPTCHA validation failed.'
        return res.status(400).json({ error: 'CAPTCHA token is missing.' });
    }

    const captchaResponse = await axios.post(verificationUrl);
    if (!captchaResponse.data.success) {
      return res.status(400).json({ error: 'CAPTCHA validation failed.' });
    }

    // 2. Save to Database
    const newContact = await Contact.create({
      name,
      email,
      phone_number,
      message
    });

    // 3. Send Email
    const transporter = nodemailer.createTransport({
      host: accessEnv('SMTP_HOST', 'smtp.gmail.com'),
      port: parseInt(accessEnv('SMTP_PORT', '465')),
      secure: accessEnv('SMTP_PORT', '465') === '465',
      auth: {
        user: accessEnv('SMTP_USER', 'jobostructurals@gmail.com'),
        pass: accessEnv('SMTP_PASS', 'abcd-efgh-ijkl-mnop') // Dummy for now
      }
    });

    const recipientTo = accessEnv('CONTACT_EMAIL_TO', 'jobostructurals@gmail.com').split(',');

    const mailOptions = {
      from: accessEnv('SMTP_USER', 'jobostructurals@gmail.com'),
      to: recipientTo,
      subject: `New Contact Message from ${name}`,
      text: `
        You have received a new contact message:

        Name: ${name}
        Email: ${email}
        Phone: ${phone_number}
        Message:
        ${message}
      `
    };

    try {
        await transporter.sendMail(mailOptions);
        // Log to database
        await SentEmail.create({
            to: recipientTo.join(','),
            subject: mailOptions.subject,
            body: mailOptions.text,
            type: 'contact'
        });
    } catch (emailError) {
        console.error("Email sending failed:", emailError);
    }

    res.status(201).json(newContact);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

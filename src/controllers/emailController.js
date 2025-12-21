import nodemailer from 'nodemailer';
import accessEnv from '../../access_env.js';
import { SentEmail } from '../models/index.js';

const getSmtpConfig = () => ({
  host: accessEnv('SMTP_HOST', 'smtp.gmail.com'),
  port: parseInt(accessEnv('SMTP_PORT', '465')),
  secure: true,
  auth: {
    user: accessEnv('SMTP_USER', 'jobostructurals@gmail.com'),
    pass: accessEnv('SMTP_PASS', 'abcd-efgh-ijkl-mnop')
  }
});

export const getInbox = async (req, res) => {
  try {
    const emails = await SentEmail.findAll({
      order: [['created_at', 'DESC']],
      limit: 20
    });
    
    // Transform to match previous format for frontend compatibility
    const formatted = emails.map(email => ({
      uid: email.id,
      from: email.type === 'contact' ? 'Contact Form' : accessEnv('SMTP_USER', 'jobostructurals@gmail.com'),
      to: email.to,
      subject: email.subject,
      date: email.created_at,
      text: email.body,
      html: email.body // Assuming HTML content if from compose, plain if from contact
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Email Log Error:', error);
    res.status(500).json({ error: 'Failed to fetch email history.' });
  }
};

export const sendEmail = async (req, res) => {
  const { to, subject, body } = req.body;
  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, body' });
  }

  const transporter = nodemailer.createTransport(getSmtpConfig());
  const mailOptions = {
    from: accessEnv('SMTP_USER', 'jobostructurals@gmail.com'),
    to,
    subject,
    html: body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    // Log to database
    await SentEmail.create({
      to,
      subject,
      body,
      type: 'compose'
    });

    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('SMTP Error:', error);
    res.status(500).json({ error: 'Failed to send email. Check your SMTP settings.' });
  }
};

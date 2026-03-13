import nodemailer from 'nodemailer';

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'info@renace.space',
    pass: process.env.SMTP_PASS || 'JustWork2027@',
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

export async function sendEmail({ to, subject, text, html }) {
  try {
    const fromAddress = process.env.EMAIL_FROM || '"Intevopedi" <info@renace.space>';
    
    // Verify connection configuration before sending (optional, you can remove this if it slows down requests)
    // await transporter.verify();

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
      html
    });

    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send email via SMTP:', error);
    
    // Fallback simuation for development logic if SMTP fails completely
    console.warn('⚠️ SMTP Email Failed. Simulating email printout:');
    console.log(`\n\n📧 SIMULATED EMAIL TO: ${to}`);
    console.log(`Asunto: ${subject}`);
    if (text) console.log(text);
    if (html) console.log('[HTML Content Disabled in Console]');
    console.log('\n\n');
    
    throw error; // Rethrow or handle based on your needs
  }
}

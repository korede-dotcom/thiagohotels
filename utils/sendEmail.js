const nodemailer = require('nodemailer');


const SendEmail = async (subject,text,html,to) => {
    const transporter = nodemailer.createTransport({
        host: process.env.smtp_host,
        port: process.env.smtp_port,
        auth: {
          user: process.env.smtp_user, // Your Gmail address
          pass: process.env.smtp_pass, 
        },
      
  });
  
  // Set up email data with Unicode symbols
  const mailOptions = {
      from: 'thiagohotelandsuites@gmail.com',         // Sender address
      to: to,    // List of recipients
      subject: subject,     // Subject line
      text: text,         // Plain text body
      html: html,  // HTML body
  };
  
  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
  });
  
}

module.exports = SendEmail;
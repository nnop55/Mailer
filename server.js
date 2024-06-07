const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

app.post('/send-email', (req, res) => {
    const { email, message } = req.body;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Test HTML template on mail',
        html: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            return res.status(500).json({ error: 'Failed to send email.' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully!' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

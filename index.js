require("dotenv").config();
const nodemailer = require("nodemailer");
const url = require("url");
const axios = require("axios");
const notifier = require('node-notifier');
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

const map = {};
function GetLatestPrice(baseUrl) {
  if (baseUrl.startsWith("https://tiki.vn")) {
    const u = url.parse(baseUrl, true);
    const productId = u.query.spid;
    const baseProductId = u.pathname.substring(u.pathname.lastIndexOf("p") + 1, u.pathname.length - 5);
    axios(
      `https://tiki.vn/api/v2/products/${baseProductId}?platform=web&spid=${productId}`
    ).then(({ data }) => {
      if (map[data.id] != data.price) {
        notifier.notify({
            title: data.name,
            message: `${new Intl.NumberFormat().format(data.price)} ₫`,
          });
        map[data.id] = data.price;
        console.log(`[${new Date()}] ${data.name}: ${new Intl.NumberFormat().format(data.price)} ₫`);
      }
    });
  }
  setTimeout(() => {
    GetLatestPrice(baseUrl);
  }, +process.env.INTERVAL);
}
GetLatestPrice(process.env.PRODUCT_URL);

const content = `
    Chào Triều!
`;

const mailOption = {
  from: `Price Watcher Bot <${process.env.EMAIL_NAME}>`,
  to: "minhtrieuvo600@gmail.com",
  subject: "Giá mặt hàng bạn theo dõi vừa thay đổi",
  html: content,
};

// transporter.sendMail(mailOption, function (err, info) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Message sent: " + info.response);
//   }
// });

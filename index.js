require("dotenv").config();
const nodemailer = require("nodemailer");
const url = require("url");
const axios = require("axios");
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
const TEST_URL =
  "https://tiki.vn/dien-thoai-samsung-galaxy-s22-ultra-5g-12gb-256gb-hang-chinh-hang-p162593136.html?itm_campaign=CTP_YPD_TKA_PLA_UNK_ALL_UNK_UNK_UNK_UNK_X.160801_Y.1741887_Z.3072571_CN.Product-Ads-Auto-Focus&itm_medium=CPC&itm_source=tiki-ads&spid=162593142";


const map = {};
function GetLatestPrice(baseUrl) {
  if (baseUrl.startsWith("https://tiki.vn")) {
    const u = url.parse(TEST_URL, true);
    const productId = u.query.spid;
    const baseProductId = u.pathname.substring(u.pathname.lastIndexOf("p") + 1, u.pathname.length - 5);
    axios(
      `https://tiki.vn/api/v2/products/${baseProductId}?platform=web&spid=${productId}`
    ).then(({ data }) => {
      if (map[data.id] != data.price) {
        map[data.id] = data.price;
        console.log(`[${new Date()}] ${data.name}: ${data.price}₫`);
      }
    });
  }
  setTimeout(() => {
    GetLatestPrice(baseUrl);
  }, 5000);
}
GetLatestPrice(TEST_URL);

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

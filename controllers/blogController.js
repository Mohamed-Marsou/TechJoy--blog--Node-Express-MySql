const homeLg = require("../models/HomeLg");
const nodemailer = require("nodemailer");
const DB = require("../utils/database");

exports.getLogin = (req, res, next) => {
  res.render("login-singup");
};
exports.getContact = (req, res, next) => {
  res.render("contact");
};
exports.getFAQ = (req, res, next) => {
  res.render("FAQ");
};
exports.getBlogPage = (req, res, next) => {
  res.render("blog");
};

exports.getHome = (req, res, next) => {
  homeLg
    .CheckOutArtciles()
    .then(([rows, fieldData]) => {
      res.render("home", {
        artl: rows,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//----------------------------- POST
exports.postSaveMail = (req, res, next) => {
  const email = req.body.new_email;
  const datetime = formatDate(new Date());
  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function formatDate(date) {
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join("-") +
      " " +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(":")
    );
  }
  DB.execute(
    "INSERT INTO blog_subscribers (subscriber_email,subscriber_subscribed_at)VALUES (?,?)",
    [email, datetime]
  )
    .then(() => {
      res.render("thnkpage");
      console.log("Email had been added");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postThankPage = (req, res, next) => {
  const { contactor, contactor_email, contactor_sub, contactor_msg } = {
    ...req.body,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "techJoyMailer22@gmail.com",
      pass: "sbkjkcwyjkuhldze",
    },
  });

  const mailOptions = {
    from: "techJoyMailer22@gmail.com",
    to: contactor_email,
    subject: contactor_sub,
    html: `
        <span>NEW MAIL FROM<p>${contactor}</p></span>
        <span>content</span>
        <br /><br /><br />
        <h2>${contactor_msg}</h2>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.render("errorPage");
      return;
    } else {
      console.log("Email sent: " + info.response);
      res.render("sub_thk");
    }
  });
};

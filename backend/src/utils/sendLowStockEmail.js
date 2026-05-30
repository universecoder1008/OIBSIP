const nodemailer = require(
  'nodemailer'
);

const sendLowStockEmail = async (
  item
) => {
    

  const transporter =
    nodemailer.createTransport({

      service: 'gmail',

      auth: {

        user:
          process.env.EMAIL_USER,

        pass:
          process.env.EMAIL_PASS
      }
    });

  await transporter.sendMail({

    from: process.env.EMAIL_USER,

    to: process.env.ADMIN_EMAIL,

    subject:
      'Low Stock Alert',

    html: `

      <h2>Inventory Warning</h2>

      <p>
        ${item.name} stock is low.
      </p>

      <p>
        Remaining stock:
        ${item.stock}
      </p>
    `
  });
};

module.exports =
  sendLowStockEmail;
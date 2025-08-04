const nodemailer = require("nodemailer");

exports.sendTicketEmail = async (req, res) => {
  const { email, firstName, lastName, busName, journeyDate, seatNumber } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const textMessage = `
Hello ${firstName} ${lastName},

Your bus ticket details:

- Bus Name: ${busName}
- Journey Date: ${new Date(journeyDate).toDateString()}
- Seat Number: ${seatNumber}

Thank you for booking with MakeMyTrip!
    `;

    const htmlMessage = `
      <h3>Hello ${firstName} ${lastName},</h3>
      <p>Your bus ticket details:</p>
      <ul>
        <li><strong>Bus Name:</strong> ${busName}</li>
        <li><strong>Journey Date:</strong> ${new Date(journeyDate).toDateString()}</li>
        <li><strong>Seat Number:</strong> ${seatNumber}</li>
      </ul>
      <p>Thank you for booking with MakeMyTrip!</p>
    `;

    await transporter.sendMail({
      from: `"MakeMyTrip" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your Bus Ticket",
      text: textMessage,
      html: htmlMessage,
    });

    res.status(200).json({ message: "Email sent successfully with both text and HTML!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
};

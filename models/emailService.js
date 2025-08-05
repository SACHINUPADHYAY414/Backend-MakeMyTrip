const nodemailer = require("nodemailer");
const pdf = require("html-pdf-node");

async function sendTicketEmail({
  email,
  firstName,
  lastName,
  busName,
  fromCity,
  toCity,
  departure,
  arrival,
  seatNumber,
  totalPrice,
  journeyDate,
  bookingDate,
  userFullName
}) {
  if (!email || typeof email !== "string" || !email.trim()) {
    console.warn("Email missing, skipping send");
    return;
  }
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const journeyDateFormatted = journeyDate ? formatDate(journeyDate) : "N/A";
  const bookingDateFormatted = bookingDate
    ? formatDate(bookingDate)
    : formatDate(new Date());

 const ticketHtml = `
  <html>
  <head>
    <style>
      /* A4 page size for print */
      @page {
        size: A4;
        margin: 20mm;
      }
      body {
        margin: 0;
        padding: 20mm;
        background: white;
        color: black;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        box-sizing: border-box;
      }
      .ticket-container {
        max-width: 180mm; /* A4 width minus margins */
        margin: auto;
        padding: 20px 30px;
        background: white;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        border-radius: 8px;
      }
      h1 {
        margin: 0 0 10px 0;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
      }
      hr {
        margin: 20px 0;
        border: none;
        border-top: 1px solid #ccc;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      td {
        padding: 8px 5px;
        vertical-align: top;
      }
      td:first-child {
        font-weight: 600;
        width: 35%;
      }
      p.note {
        font-size: 12px;
        color: gray;
        text-align: center;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="ticket-container">
      <h1>YatraVille E‑Ticket</h1>
      <hr />
      <table>
        <tr><td>Passenger:</td><td>${firstName} ${lastName}</td></tr>
        <tr><td>Bus:</td><td>${busName}</td></tr>
        <tr><td>From:</td><td>${fromCity}</td></tr>
        <tr><td>To:</td><td>${toCity}</td></tr>
        <tr><td>Departure:</td><td>${departure}</td></tr>
        <tr><td>Arrival:</td><td>${arrival}</td></tr>
        <tr><td>Seat:</td><td>${seatNumber}</td></tr>
        <tr><td>Fare:</td><td>₹${totalPrice}</td></tr>
        <tr><td>Journey Date:</td><td>${journeyDateFormatted}</td></tr>
        <tr><td>Booking Date:</td><td>${bookingDateFormatted}</td></tr>
        <tr><td>Booked by:</td><td>${userFullName}</td></tr>
      </table>
      <p class="note">
        YatraVille or its affiliates never ask for your personal bank or security details.<br />
        Please be aware if anyone asks for your ATM PIN / OTP / CVV number.
      </p>
    </div>
  </body>
  </html>
`;


  const pdfBuffer = await pdf.generatePdf(
    { content: ticketHtml },
    { format: "A4" }
  );

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
  });

  await transporter.sendMail({
    from: `"YatraVille" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your YatraVille E‑Ticket",
    html: ticketHtml,
    attachments: [
      {
        filename: `YatraVille_E-Ticket_${firstName}_${lastName}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf"
      }
    ]
  });

  console.log("Email sent to:", email);
}

module.exports = { sendTicketEmail };

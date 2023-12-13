import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.REACT_APP_SEND_GRID_API_KEY);


async function sendEmail(req, res) {
  
  try {
    await sendgrid.send({
      to: 'bhj@fe.com', // Your email where you'll receive emails
      from: "noreply@ium.co.za", // your website email address here
      subject: 'New Contact Form Submission',
      html: 'From: ' + req.body.firstName +
            '</br> Email: ' + req.body.emailAdress + 
            '</br> Cell: ' + req.body.phoneNumber + 
            '</br> Message: ' + req.body.message,
    });

    console.log("Success");


  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  return res.status(200).json({ error: "" });
}


export default sendEmail;
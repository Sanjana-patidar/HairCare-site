import nodemailer from "nodemailer";
import {contactModel} from '../Model/ContactModel.js'
// Submit contact form

export const submitForm = async (req, res) => {
  try {
    const { firstname, lastname, email, contactnumber, address } = req.body;

    if (!firstname || !lastname || !email || !contactnumber || !address) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Save to DB
    const newModel = new contactModel({
      firstname,
      lastname,
      email,
      contactnumber,
      address,
    });
    await newModel.save();

    // ✅ CREATE TRANSPORTER HERE
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ SEND EMAIL
    await transporter.sendMail({
      from: `"HairCare Website" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Contact Form Submitted Successfully",
      html: `
        <h3>Thank You for Contacting Us</h3>
        <p>Hello <b>${firstname} ${lastname}</b>,</p>
        <p>Your contact form has been submitted successfully.</p>
        <p><b>Your Details:</b></p>
        <ul>
          <li>Email: ${email}</li>
          <li>Contact Number: ${contactnumber}</li>
          <li>Address: ${address}</li>
        </ul>
        <p>Regards,<br/>HairCare Team</p>
      `,
    });

    return res.status(200).json({
      message: "Contact form submitted successfully!",
      data: newModel,
    });

  } catch (error) {
    console.error("MAIL ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


// Get all contact user
export const getContactuser = async (req, res) => {
  try {
    const contactuser = await contactModel.find();  
    res.status(200).json({
      success: true,
      contactuser: contactuser,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
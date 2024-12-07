import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/connectDB';
import { UserEmailModal } from '@/lib/models/UserEmailModel';

export async function POST(req) {
  const { email, password } = await req.json();  // Extracting data from the request body

  if (!email || !password) {
    return new Response(
      JSON.stringify({ message: 'Email and password are required' }),
      { status: 400 }
    );
  }

  try {
    // DB connection
    await connectDB();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP and expiry
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // OTP expiry in 15 minutes

    // Find or create user
    let user = await UserEmailModal.findOne({ email });
    if (!user) {
      user = await UserEmailModal.create({ email, password: hashedPassword, otp, otpExpiresAt });
    } else {
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();
    }

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It will expire in 15 minutes.`,
    });

    return new Response(
      JSON.stringify({ message: 'OTP sent successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}

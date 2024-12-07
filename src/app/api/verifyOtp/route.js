import { UserEmailModal } from "@/lib/models/UserEmailModel";


export async function POST(req, res) {
    try {
        const { email, otp } = await req.json();

        // Validate input
        if (!email || !otp) {
            return res.status(400).json({ message: 'OTP and email are required' });
        }

        // Find user by email
        const user = await UserEmailModal.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check OTP expiration
        if (user.otpExpiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Check if OTP matches
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // OTP is valid, proceed with the desired action
        // For example, you could mark the user as verified, or proceed with login
        return new Response(
            JSON.stringify({ message: 'OTP verified successfully' }),
            { status: 200 }
        );
        // res.status(200).json({ message: 'OTP verified successfully' });

    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ message: 'Internal server error' }),
            { status: 500 }
        );
    }
}

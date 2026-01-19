import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models/User';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/lib/validations/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: validatedData.email }, { username: validatedData.username }],
    });

    if (existingUser) {
      if (existingUser.email === validatedData.email) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create new user
    const user = await User.create({
      email: validatedData.email,
      username: validatedData.username,
      password: hashedPassword,
      rank: 'Rookie',
      trustScore: 50,
      credits: 1000, // Starting bonus
    });

    // Create initial activities so profile/history isn't empty
    const Activity = (await import('@/lib/db/models/Activity')).default;
    await Activity.insertMany([
      {
        userId: user._id,
        type: 'RankUp',
        description: 'Initialized as Rookie Operative',
        impactOnTrust: 50,
        createdAt: new Date(Date.now() - 1000),
      },
      {
        userId: user._id,
        type: 'BountyCompleted', // Using this as a "Welcome" or similar
        description: 'Received Welcome Bonus Credits',
        impactOnCredits: 1000,
        createdAt: new Date(),
      }
    ]);

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}

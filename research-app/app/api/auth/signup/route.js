import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import dbConnect from '../../../lib/dbconnect';
import User from '../../../models/user.js';

export async function POST(request) {
  try {
    await dbConnect();
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });
    
    return NextResponse.json({ message: 'User registered', user: newUser }, { status: 201 });
  
  } catch (error) {
    console.log('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

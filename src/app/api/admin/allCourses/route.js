
import { connectToDb } from '@/lib/dbConnection/connect';
import Course from '@/lib/models/Course';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/authentication/isAuthenticated';
import Admin from '@/lib/models/Admin'

const handler = async (req) => {
    await connectToDb();
    const admin = Admin.findById(req.user.userId)
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const courses = await Course.find().sort("semester")
        return NextResponse.json({ courses }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error finding courses' }, { status: 500 });
    }
}
export const GET = isAuthenticated(handler);
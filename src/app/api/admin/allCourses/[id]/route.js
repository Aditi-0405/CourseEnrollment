
import { connectToDb } from '@/lib/dbConnection/connect';
import Course from '@/lib/models/Course';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/authentication/isAuthenticated';
import Admin from '@/lib/models/Admin'

const handler = async (req,{params}) => {
    await connectToDb();
    const admin = Admin.findById(req.user.userId)
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const id = params.id
    try {
        const course = await Course.findById(id)
        return NextResponse.json({ course }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error finding course' }, { status: 500 });
    }
}
export const GET = isAuthenticated(handler);
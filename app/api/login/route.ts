import { NextRequest, NextResponse } from "next/server";

const USERS = JSON.parse(process.env.USERS || "[]");

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();

    const user = USERS.find(
        (u: any) => u.username === username && u.password === password
    );
    if (!user) {
        return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 }
        );
    }

    return NextResponse.json({ success: true });
}

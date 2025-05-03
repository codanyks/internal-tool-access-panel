import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/app/lib/session";

const roleToolMap: Record<string, string[]> = {
    admin: ["hr", "sales", "pipelines"],
    hr: ["hr"],
    sales: ["sales"],
    dev: ["pipelines"],
};

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
    const sessionId = createSession({
        username: user.username,
        role: user.role,
        toolIds: roleToolMap[user.role] || [],
    });
    return NextResponse.json({ sessionId });
}

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../lib/session";

export async function GET(req: NextRequest) {
    const sessionId = req.nextUrl.searchParams.get("sid");

    if (!sessionId) {
        return NextResponse.json(
            { error: "Missing session ID" },
            { status: 400 }
        );
    }

    const session = getSession(sessionId);
    if (!session) {
        return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    return NextResponse.json(session);
}

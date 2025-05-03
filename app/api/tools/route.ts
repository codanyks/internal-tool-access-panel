import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../lib/session";
import { Permit } from "permitio";

export async function GET(req: NextRequest) {
    const sessionId = req.nextUrl.searchParams.get("sid");
    const toolId = req.nextUrl.searchParams.get("toolId");

    const permit: Permit = new Permit({
        pdp: "https://cloudpdp.api.permit.io",
        token: process.env.PERMIT_API_KEY,
    });

    if (!sessionId) {
        return NextResponse.json(
            { error: "Missing session ID" },
            { status: 401 }
        );
    }

    const session = getSession(sessionId);

    if (!session) {
        return NextResponse.json({ error: "Invalid session" }, { status: 403 });
    }

    const allowed = await permit.check(`${session.username}`, "access", `${toolId}`);
    if (!allowed) {
        return NextResponse.json({ error: "No access" }, { status: 403 });
    }

    return NextResponse.json({
        tool: toolId,
        features: ["Feature A", "Feature B", "Feature C"],
        accessedBy: session.username,
        toolIds: session.toolIds,
        role: session.role,
    });
}

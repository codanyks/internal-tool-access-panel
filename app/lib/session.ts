type SessionData = {
    username: string;
    role: string;
    toolIds: string[];
};

const sessions = new Map<string, SessionData>();

export function createSession(data: SessionData): string {
    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, data);
    return sessionId;
}

export function getSession(sessionId: string): SessionData | null {
    return sessions.get(sessionId) || null;
}

export function deleteSession(sessionId: string) {
    sessions.delete(sessionId);
}

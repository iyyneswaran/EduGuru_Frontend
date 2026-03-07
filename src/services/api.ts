const API_ROOT = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
const API_BASE = `${API_ROOT}/api`;

function getToken(): string | null {
    return localStorage.getItem('eduguru_token');
}

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(data?.message || `Request failed (${res.status})`);
    }

    return data;
}

// ─── Classrooms ─────────────────────────────────────────────────

export async function getClassrooms() {
    return request('/classrooms');
}

export async function createClassroom(data: { name: string; subject: string; description?: string }) {
    return request('/classrooms', { method: 'POST', body: JSON.stringify(data) });
}

export async function joinClassroom(code: string) {
    return request('/classrooms/join', { method: 'POST', body: JSON.stringify({ code }) });
}

export async function getClassroom(id: string) {
    return request(`/classrooms/${id}`);
}

export async function getClassroomMembers(id: string) {
    return request(`/classrooms/${id}/members`);
}

// ─── Modules ────────────────────────────────────────────────────

export async function getModules(classroomId: string) {
    return request(`/classrooms/${classroomId}/modules`);
}

export async function createModule(classroomId: string, data: { title: string; description?: string; content?: string; order: number }) {
    return request(`/classrooms/${classroomId}/modules`, { method: 'POST', body: JSON.stringify(data) });
}

export async function completeModule(classroomId: string, moduleId: string) {
    return request(`/classrooms/${classroomId}/modules/${moduleId}/complete`, { method: 'POST' });
}

// ─── Study Materials ────────────────────────────────────────────

export async function getMaterials(classroomId: string) {
    return request(`/classrooms/${classroomId}/materials`);
}

export async function createMaterial(classroomId: string, data: { title: string; description?: string; fileUrl: string; type?: string }) {
    return request(`/classrooms/${classroomId}/materials`, { method: 'POST', body: JSON.stringify(data) });
}

// ─── Quizzes ────────────────────────────────────────────────────

export async function getQuizzes(classroomId: string) {
    return request(`/classrooms/${classroomId}/quizzes`);
}

export async function createQuiz(classroomId: string, data: any) {
    return request(`/classrooms/${classroomId}/quizzes`, { method: 'POST', body: JSON.stringify(data) });
}

export async function getQuiz(classroomId: string, quizId: string) {
    return request(`/classrooms/${classroomId}/quizzes/${quizId}`);
}

export async function submitQuiz(classroomId: string, quizId: string, answers: { questionId: string; answer: string }[]) {
    return request(`/classrooms/${classroomId}/quizzes/${quizId}/submit`, { method: 'POST', body: JSON.stringify({ answers }) });
}

// ─── Leaderboard ────────────────────────────────────────────────

export async function getLeaderboard(classroomId: string) {
    return request(`/classrooms/${classroomId}/leaderboard`);
}

// ─── Progress / Achievements ────────────────────────────────────

export async function getProgress() {
    return request('/classrooms/student/progress');
}

export async function getAchievements() {
    return request('/classrooms/student/achievements');
}

// ─── Admin ──────────────────────────────────────────────────────

export async function getAdminDashboard() {
    return request('/classrooms/admin/dashboard');
}

export async function getAdminStudents() {
    return request('/classrooms/admin/students');
}

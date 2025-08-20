const USE_MOCK_API = true;
const API_BASE_URL = '';

let authToken = null;
function setAuthToken(token) { authToken = token; }

function decodeToken(token) {
	try {
		if (!token) return null;
		if (token.startsWith('mock.')) token = token.slice(5);
		return JSON.parse(atob(token));
	} catch {
		return null;
	}
}

// In-memory + localStorage mock database
const DB_KEY = 'sms_db_v1';
function loadDb() {
	const raw = localStorage.getItem(DB_KEY);
	if (raw) {
		try { return JSON.parse(raw); } catch {}
	}
	const db = seedDb();
	saveDb(db);
	return db;
}
function saveDb(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
function seedDb() {
	const adminUser = { id: 'u_admin', email: 'admin@example.com', password: 'admin123', role: 'Admin', name: 'Admin User' };
	const studentUser = { id: 'u_student', email: 'student@example.com', password: 'student123', role: 'Student', name: 'Student One', studentId: 's_1' };
	return {
		users: [adminUser, studentUser],
		students: [
			{ id: 's_1', name: 'Student One', email: 'student@example.com', major: 'Computer Science', year: '2' }
		],
		courses: [
			{ id: 'c_1', name: 'Introduction to Programming' },
			{ id: 'c_2', name: 'Data Structures' },
			{ id: 'c_3', name: 'Databases' }
		],
		enrollments: { 's_1': ['c_1', 'c_2'] }
	};
}

function requireAuth(role = null) {
	const payload = decodeToken(authToken);
	if (!payload) throw new Error('Not authenticated');
	if (role && payload.role !== role) throw new Error('Forbidden');
	return payload;
}

function generateId(prefix) {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

async function login({ email, password }) {
	if (USE_MOCK_API) {
		const db = loadDb();
		const user = db.users.find(u => u.email === email && u.password === password);
		if (!user) throw new Error('Invalid credentials');
		const token = 'mock.' + btoa(JSON.stringify({ uid: user.id, role: user.role }));
		const safeUser = { id: user.id, email: user.email, role: user.role, name: user.name || '', studentId: user.studentId };
		return { token, user: safeUser };
	}
	const res = await fetch(`${API_BASE_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
	if (!res.ok) throw new Error('Login failed');
	return res.json();
}

async function register({ name, email, password, role }) {
	if (USE_MOCK_API) {
		const db = loadDb();
		if (db.users.some(u => u.email === email)) throw new Error('Email already registered');
		const newUser = { id: generateId('u'), email, password, role, name };
		if (role === 'Student') {
			const student = { id: generateId('s'), name, email, major: '', year: '' };
			newUser.studentId = student.id;
			db.students.push(student);
		}
		db.users.push(newUser);
		saveDb(db);
		return { ok: true };
	}
	const res = await fetch(`${API_BASE_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password, role }) });
	if (!res.ok) throw new Error('Registration failed');
	return res.json();
}

async function getCurrentUser() {
	if (USE_MOCK_API) {
		const payload = decodeToken(authToken);
		if (!payload) throw new Error('Not authenticated');
		const db = loadDb();
		const user = db.users.find(u => u.id === payload.uid);
		if (!user) throw new Error('User not found');
		return { id: user.id, email: user.email, role: user.role, name: user.name || '', studentId: user.studentId };
	}
	const res = await fetch(`${API_BASE_URL}/api/users/me`, { headers: { Authorization: `Bearer ${authToken}` } });
	if (!res.ok) throw new Error('Failed to fetch current user');
	return res.json();
}

async function listStudents() {
	if (USE_MOCK_API) {
		requireAuth('Admin');
		const db = loadDb();
		return db.students.slice();
	}
	const res = await fetch(`${API_BASE_URL}/api/students`, { headers: { Authorization: `Bearer ${authToken}` } });
	if (!res.ok) throw new Error('Failed to fetch students');
	return res.json();
}

async function getStudentById(id) {
	if (USE_MOCK_API) {
		const db = loadDb();
		const student = db.students.find(s => s.id === id);
		if (!student) throw new Error('Student not found');
		return student;
	}
	const res = await fetch(`${API_BASE_URL}/api/students/${id}`, { headers: { Authorization: `Bearer ${authToken}` } });
	if (!res.ok) throw new Error('Failed to fetch student');
	return res.json();
}

async function createStudent(payload) {
	if (USE_MOCK_API) {
		requireAuth('Admin');
		const db = loadDb();
		const student = { id: generateId('s'), name: payload.name || '', email: payload.email || '', major: payload.major || '', year: payload.year || '' };
		db.students.push(student);
		saveDb(db);
		return student;
	}
	const res = await fetch(`${API_BASE_URL}/api/students`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` }, body: JSON.stringify(payload) });
	if (!res.ok) throw new Error('Failed to create student');
	return res.json();
}

async function updateStudent(id, payload) {
	if (USE_MOCK_API) {
		requireAuth('Admin');
		const db = loadDb();
		const idx = db.students.findIndex(s => s.id === id);
		if (idx === -1) throw new Error('Student not found');
		db.students[idx] = { ...db.students[idx], ...payload };
		saveDb(db);
		return db.students[idx];
	}
	const res = await fetch(`${API_BASE_URL}/api/students/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` }, body: JSON.stringify(payload) });
	if (!res.ok) throw new Error('Failed to update student');
	return res.json();
}

async function deleteStudent(id) {
	if (USE_MOCK_API) {
		requireAuth('Admin');
		const db = loadDb();
		const idx = db.students.findIndex(s => s.id === id);
		if (idx === -1) throw new Error('Student not found');
		db.students.splice(idx, 1);
		Object.keys(db.enrollments).forEach(sid => { if (sid === id) delete db.enrollments[sid]; });
		saveDb(db);
		return { ok: true };
	}
	const res = await fetch(`${API_BASE_URL}/api/students/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${authToken}` } });
	if (!res.ok) throw new Error('Failed to delete student');
	return res.json();
}

async function listCourses() {
	if (USE_MOCK_API) {
		const db = loadDb();
		return db.courses.slice();
	}
	const res = await fetch(`${API_BASE_URL}/api/courses`, { headers: { Authorization: `Bearer ${authToken}` } });
	if (!res.ok) throw new Error('Failed to fetch courses');
	return res.json();
}

async function listStudentCourses(studentId) {
	if (USE_MOCK_API) {
		const db = loadDb();
		const ids = db.enrollments[studentId] || [];
		return db.courses.filter(c => ids.includes(c.id));
	}
	const res = await fetch(`${API_BASE_URL}/api/students/${studentId}/courses`, { headers: { Authorization: `Bearer ${authToken}` } });
	if (!res.ok) throw new Error('Failed to fetch enrollments');
	return res.json();
}

const api = { login, register, getCurrentUser, listStudents, getStudentById, createStudent, updateStudent, deleteStudent, listCourses, listStudentCourses };

export { api, setAuthToken, USE_MOCK_API, API_BASE_URL };
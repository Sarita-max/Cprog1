import { appState } from '../state.js';
import { setContent, showToast } from '../ui.js';
import { api } from '../api.js';

async function renderStudentDashboard() {
	const user = appState.user;
	if (!user || user.role !== 'Student') return location.hash = '#/login';
	try {
		const courses = await api.listStudentCourses(user.studentId);
		setContent(`
			<div class="grid">
				<div class="kpis">
					<div class="kpi"><div class="muted">Role</div><div><strong>${user.role}</strong></div></div>
					<div class="kpi"><div class="muted">Enrolled Courses</div><div><strong>${courses.length}</strong></div></div>
				</div>
				<div class="card">
					<h2>Welcome, ${user.name || user.email}</h2>
					<p class="muted">Manage your profile and view enrolled courses.</p>
					<div class="actions">
						<a class="btn" href="#/students/${user.studentId}">View Profile</a>
					</div>
				</div>
				<div class="card">
					<h3>Enrolled Courses</h3>
					${courses.length ? `<ul>${courses.map(c => `<li>${c.name}</li>`).join('')}</ul>` : '<div class="empty">No courses enrolled.</div>'}
				</div>
			</div>
		`);
	} catch (err) {
		showToast(err.message || 'Failed to load dashboard');
	}
}

export { renderStudentDashboard };
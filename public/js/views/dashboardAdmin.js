import { setContent } from '../ui.js';
import { api } from '../api.js';

async function renderAdminDashboard() {
	const [students, courses] = await Promise.all([
		api.listStudents().catch(() => []),
		api.listCourses().catch(() => []),
	]);
	setContent(`
		<div class="grid">
			<div class="kpis">
				<div class="kpi"><div class="muted">Students</div><div><strong>${students.length}</strong></div></div>
				<div class="kpi"><div class="muted">Courses</div><div><strong>${courses.length}</strong></div></div>
			</div>
			<div class="card">
				<h2>Admin Panel</h2>
				<p class="muted">Manage students and view system metrics.</p>
				<div class="actions">
					<a class="btn" href="#/admin/students">Manage Students</a>
				</div>
			</div>
		</div>
	`);
}

export { renderAdminDashboard };
import { appState } from '../state.js';
import { api } from '../api.js';
import { setContent, showToast } from '../ui.js';

async function renderStudentProfileView(ctx) {
	const requester = appState.user;
	let { id } = ctx.params;
	if (requester.role === 'Student') {
		id = requester.studentId;
	}
	try {
		const [student, courses] = await Promise.all([
			api.getStudentById(id),
			api.listStudentCourses(id)
		]);
		setContent(`
			<div class="grid">
				<div class="card">
					<h2>${student.name || 'Student'}</h2>
					<p class="muted">${student.email || ''}</p>
					<p>Major: <strong>${student.major || '-'}</strong></p>
					<p>Year: <strong>${student.year || '-'}</strong></p>
				</div>
				<div class="card">
					<h3>Courses</h3>
					${courses.length ? `<ul>${courses.map(c => `<li>${c.name}</li>`).join('')}</ul>` : '<div class="empty">No courses.</div>'}
				</div>
			</div>
		`);
	} catch (err) {
		showToast(err.message || 'Failed to load profile');
	}
}

export { renderStudentProfileView };
import { api } from '../api.js';
import { formToObject, setContent, showToast } from '../ui.js';

async function renderStudentFormView(ctx, { mode }) {
	let student = { name: '', email: '', major: '', year: '' };
	if (mode === 'edit') {
		student = await api.getStudentById(ctx.params.id).catch(() => student);
	}
	setContent(`
		<div class="card">
			<h2>${mode === 'edit' ? 'Edit Student' : 'Add Student'}</h2>
			<form id="student-form">
				<div class="input-group"><label>Name</label><input name="name" value="${student.name || ''}" required /></div>
				<div class="input-group"><label>Email</label><input name="email" type="email" value="${student.email || ''}" required /></div>
				<div class="input-group"><label>Major</label><input name="major" value="${student.major || ''}" /></div>
				<div class="input-group"><label>Year</label><input name="year" value="${student.year || ''}" /></div>
				<div class="actions">
					<button class="btn" type="submit">Save</button>
					<a class="btn secondary" href="#/admin/students">Cancel</a>
				</div>
			</form>
		</div>
	`);

	const form = document.getElementById('student-form');
	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const payload = formToObject(form);
		try {
			if (mode === 'edit') await api.updateStudent(student.id, payload);
			else await api.createStudent(payload);
			showToast('Saved');
			location.hash = '#/admin/students';
		} catch (err) {
			showToast(err.message || 'Save failed');
		}
	});
}

export { renderStudentFormView };
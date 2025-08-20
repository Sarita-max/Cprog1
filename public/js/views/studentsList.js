import { api } from '../api.js';
import { setContent, showToast } from '../ui.js';

async function renderStudentsListView() {
	const students = await api.listStudents().catch(() => []);
	setContent(`
		<div class="card">
			<div style="display:flex; align-items:center; justify-content: space-between; gap: 8px;">
				<h2>Students</h2>
				<a class="btn" href="#/admin/students/new">Add Student</a>
			</div>
			${students.length ? `
				<table class="table">
					<thead><tr><th>Name</th><th>Email</th><th>Major</th><th>Actions</th></tr></thead>
					<tbody>
						${students.map(s => `
							<tr>
								<td>${s.name || ''}</td>
								<td>${s.email || ''}</td>
								<td>${s.major || ''}</td>
								<td class="actions">
									<a class="btn secondary" href="#/admin/students/${s.id}">Edit</a>
									<button class="btn danger" data-action="delete" data-id="${s.id}">Delete</button>
								</td>
							</tr>
						`).join('')}
					</tbody>
				</table>
			` : '<div class="empty">No students found.</div>'}
		</div>
	`);

	document.querySelectorAll('button[data-action="delete"]').forEach(btn => {
		btn.addEventListener('click', async () => {
			const id = btn.getAttribute('data-id');
			if (!confirm('Delete this student?')) return;
			try {
				await api.deleteStudent(id);
				showToast('Deleted');
				location.hash = '#/admin/students';
			} catch (err) {
				showToast(err.message || 'Delete failed');
			}
		});
	});
}

export { renderStudentsListView };
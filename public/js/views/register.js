import { formToObject, setContent, showToast } from '../ui.js';
import { register } from '../auth.js';

function renderRegisterView() {
	setContent(`
		<div class="grid">
			<div class="card">
				<h2>Create Account</h2>
				<form id="register-form">
					<div class="input-group">
						<label>Name</label>
						<input name="name" required />
					</div>
					<div class="input-group">
						<label>Email</label>
						<input name="email" type="email" required />
					</div>
					<div class="input-group">
						<label>Password</label>
						<input name="password" type="password" required />
					</div>
					<div class="input-group">
						<label>Role</label>
						<select name="role" required>
							<option value="Student">Student</option>
							<option value="Admin">Admin</option>
						</select>
					</div>
					<div class="actions">
						<button class="btn" type="submit">Register</button>
						<a class="btn secondary" href="#/login">Back to login</a>
					</div>
				</form>
			</div>
		</div>
	`);

	const form = document.getElementById('register-form');
	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const payload = formToObject(form);
		try {
			await register(payload);
			location.hash = '#/login';
		} catch (err) {
			showToast(err.message || 'Registration failed');
		}
	});
}

export { renderRegisterView };
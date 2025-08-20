import { formToObject, setContent, showToast } from '../ui.js';
import { login } from '../auth.js';
import { appState } from '../state.js';

function renderLoginView() {
	setContent(`
		<div class="grid">
			<div class="card">
				<h2>Login</h2>
				<form id="login-form">
					<div class="input-group">
						<label>Email</label>
						<input name="email" type="email" required />
					</div>
					<div class="input-group">
						<label>Password</label>
						<input name="password" type="password" required />
					</div>
					<div class="actions">
						<button class="btn" type="submit">Login</button>
						<a class="btn secondary" href="#/register">Create an account</a>
					</div>
				</form>
			</div>
		</div>
	`);

	const form = document.getElementById('login-form');
	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const { email, password } = formToObject(form);
		try {
			await login(email, password);
			if (appState.user.role === 'Admin') location.hash = '#/admin';
			else location.hash = '#/dashboard';
		} catch (err) {
			showToast(err.message || 'Login failed');
		}
	});
}

export { renderLoginView };
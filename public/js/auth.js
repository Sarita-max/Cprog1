import { appState } from './state.js';
import { api, setAuthToken } from './api.js';
import { showToast } from './ui.js';

async function login(email, password) {
	const { token, user } = await api.login({ email, password });
	setAuthToken(token);
	appState.setSession(token, user);
	showToast(`Welcome ${user.name || user.email}`);
}

async function register({ name, email, password, role }) {
	await api.register({ name, email, password, role });
	showToast('Registration successful. Please login.');
}

function logout() {
	appState.clearSession();
	setAuthToken(null);
	location.hash = '#/login';
}

export { login, register, logout };
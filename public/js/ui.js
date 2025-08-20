import { appState } from './state.js';
import { logout } from './auth.js';

function buildNav({ user }) {
	if (!user) {
		return [
			{ label: 'Login', path: '/login' },
			{ label: 'Register', path: '/register' },
		];
	}
	if (user.role === 'Admin') {
		return [
			{ label: 'Admin', path: '/admin' },
			{ label: 'Students', path: '/admin/students' },
			{ label: 'Logout', path: '#', onClick: () => { logout(); } },
		];
	}
	return [
		{ label: 'Dashboard', path: '/dashboard' },
		{ label: 'Profile', path: `/students/${user.studentId || ''}` },
		{ label: 'Logout', path: '#', onClick: () => { logout(); } },
	];
}

function showToast(message) {
	const root = document.getElementById('toast-root');
	const el = document.createElement('div');
	el.className = 'toast';
	el.textContent = message;
	root.appendChild(el);
	setTimeout(() => {
		root.removeChild(el);
	}, 2500);
}

function formToObject(formEl) {
	const data = new FormData(formEl);
	const obj = {};
	for (const [k, v] of data.entries()) obj[k] = v;
	return obj;
}

function setContent(html) {
	const root = document.getElementById('app');
	root.innerHTML = html;
}

export { buildNav, showToast, formToObject, setContent };
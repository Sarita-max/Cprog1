import { Router } from './router.js';
import { appState } from './state.js';
import { buildNav } from './ui.js';
import { logout } from './auth.js';
import { renderLoginView } from './views/login.js';
import { renderRegisterView } from './views/register.js';
import { renderStudentDashboard } from './views/dashboardStudent.js';
import { renderAdminDashboard } from './views/dashboardAdmin.js';
import { renderStudentsListView } from './views/studentsList.js';
import { renderStudentFormView } from './views/studentForm.js';
import { renderStudentProfileView } from './views/studentProfile.js';

const appRoot = document.getElementById('app');
const navRoot = document.getElementById('nav');

const router = new Router({
	rootEl: appRoot,
	getUser: () => appState.user,
	redirect: (path) => router.navigate(path),
});

router.addRoute({ path: '/', render: () => {
	if (!appState.user) return router.navigate('/login');
	if (appState.user.role === 'Admin') return router.navigate('/admin');
	return router.navigate('/dashboard');
}});
router.addRoute({ path: '/login', render: renderLoginView, public: true });
router.addRoute({ path: '/register', render: renderRegisterView, public: true });
router.addRoute({ path: '/dashboard', render: renderStudentDashboard, roles: ['Student'] });
router.addRoute({ path: '/admin', render: renderAdminDashboard, roles: ['Admin'] });
router.addRoute({ path: '/admin/students', render: renderStudentsListView, roles: ['Admin'] });
router.addRoute({ path: '/admin/students/new', render: (ctx) => renderStudentFormView(ctx, { mode: 'create' }), roles: ['Admin'] });
router.addRoute({ path: '/admin/students/:id', render: (ctx) => renderStudentFormView(ctx, { mode: 'edit' }), roles: ['Admin'] });
router.addRoute({ path: '/students/:id', render: renderStudentProfileView, roles: ['Admin', 'Student'] });

function renderNav() {
	navRoot.innerHTML = '';
	const links = buildNav({ user: appState.user });
	for (const link of links) {
		const a = document.createElement('a');
		a.href = `#${link.path}`;
		a.textContent = link.label;
		if (router.currentPath === link.path) a.classList.add('active');
		if (link.onClick) {
			a.addEventListener('click', (e) => { e.preventDefault(); link.onClick(); });
		}
		navRoot.appendChild(a);
	}
}

window.addEventListener('hashchange', () => {
	router.handleRouteChange();
	renderNav();
});

document.addEventListener('DOMContentLoaded', () => {
	appState.initialize();
	router.handleRouteChange();
	renderNav();
});

export { router };
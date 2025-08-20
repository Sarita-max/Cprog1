class Router {
	constructor({ rootEl, getUser, redirect }) {
		this.rootEl = rootEl;
		this.getUser = getUser;
		this.redirect = redirect;
		this.routes = [];
		this.currentPath = '';
	}

	addRoute({ path, render, roles = null, public: isPublic = false }) {
		const { regex, keys } = this._compile(path);
		this.routes.push({ path, regex, keys, render, roles, isPublic });
	}

	navigate(path) {
		if (!path.startsWith('/')) path = '/' + path;
		if (location.hash !== '#' + path) {
			location.hash = path;
		}
		return null;
	}

	handleRouteChange() {
		const fragment = location.hash.replace(/^#/, '') || '/';
		this.currentPath = fragment;
		const match = this._match(fragment);
		if (!match) {
			this.rootEl.innerHTML = '<div class="card">Not found</div>';
			return;
		}
		const { route, params } = match;
		const user = this.getUser();
		if (!route.isPublic) {
			if (!user) return this.navigate('/login');
			if (route.roles && !route.roles.includes(user.role)) {
				if (user.role === 'Admin') return this.navigate('/admin');
				return this.navigate('/dashboard');
			}
		}
		this.rootEl.innerHTML = '';
		return route.render({ params, query: this._parseQuery(), path: fragment });
	}

	_match(path) {
		for (const route of this.routes) {
			const m = route.regex.exec(path);
			if (m) {
				const params = {};
				route.keys.forEach((key, idx) => params[key] = m[idx + 1]);
				return { route, params };
			}
		}
		return null;
	}

	_compile(path) {
		const keys = [];
		const pattern = path
			.replace(/\//g, '\\/')
			.replace(/:(\w+)/g, (_, key) => { keys.push(key); return '([^/]+)'; });
		return { regex: new RegExp('^' + pattern + '$'), keys };
	}

	_parseQuery() {
		const q = {};
		const queryString = location.hash.split('?')[1] || '';
		for (const pair of queryString.split('&')) {
			if (!pair) continue;
			const [k, v] = pair.split('=');
			q[decodeURIComponent(k)] = decodeURIComponent(v || '');
		}
		return q;
	}
}

export { Router };
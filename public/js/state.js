const STORAGE_TOKEN_KEY = 'sms_token';
const STORAGE_USER_KEY = 'sms_user';

const appState = {
	user: null,
	token: null,
	initialize() {
		try {
			const token = localStorage.getItem(STORAGE_TOKEN_KEY);
			const userJson = localStorage.getItem(STORAGE_USER_KEY);
			if (token && userJson) {
				this.token = token;
				this.user = JSON.parse(userJson);
			}
		} catch (err) {
			console.error('Failed to initialize state', err);
		}
	},
	setSession(token, user) {
		this.token = token;
		this.user = user;
		localStorage.setItem(STORAGE_TOKEN_KEY, token);
		localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
	},
	clearSession() {
		this.token = null;
		this.user = null;
		localStorage.removeItem(STORAGE_TOKEN_KEY);
		localStorage.removeItem(STORAGE_USER_KEY);
	}
};

export { appState };
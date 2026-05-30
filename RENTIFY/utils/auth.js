const AUTH_KEY = 'rentify_user';

const AuthService = {
    getCurrentUser: () => {
        try {
            const user = localStorage.getItem(AUTH_KEY);
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    },
    
    login: async (email, password) => {
        try {
            // Find user in trickle DB
            const response = await trickleListObjects('user', 100, true);
            const users = response.items || [];
            
            const user = users.find(u => u.objectData.email === email && u.objectData.password === password);
            
            if (user) {
                const userData = {
                    id: user.objectId,
                    ...user.objectData
                };
                localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
                return userData;
            } else {
                throw new Error("Invalid email or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    },

    register: async (name, email, password, role) => {
        try {
            // Check if user exists
            const response = await trickleListObjects('user', 100, true);
            const users = response.items || [];
            
            if (users.some(u => u.objectData.email === email)) {
                throw new Error("Email already registered");
            }
            
            // Create user
            const newUser = await trickleCreateObject('user', {
                name,
                email,
                password, // In a real app, this should be hashed. Here we store it for demo purposes.
                role
            });
            
            const userData = {
                id: newUser.objectId,
                ...newUser.objectData
            };
            
            localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
            return userData;
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem(AUTH_KEY);
        window.location.href = 'index.html';
    },

    requireAuth: () => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
        }
        return user;
    }
};
const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const { email, password, displayName, preferences } = req.body;

        if (!email || !password || !displayName) {
            return res.status(400).json({ error: 'Email, password, and displayName are required' });
        }

        const result = await authService.registerUser(email, password, displayName, preferences);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const result = await authService.loginUser(email, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const logout = async (req, res) => {
    // Firebase Auth using JWTs is stateless.
    // Logout is primarily handled on the client side by clearing the token.
    res.status(200).json({ message: "Logout successful (handled by client)" });
};

module.exports = { login, register, logout };

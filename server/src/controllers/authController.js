const login = async (req, res) => {
    res.status(200).json({ message: "Login route" });
};

const register = async (req, res) => {
    res.status(200).json({ message: "Register route" });
};

const logout = async (req, res) => {
    res.status(200).json({ message: "Logout route" });
};

module.exports = { login, register, logout };

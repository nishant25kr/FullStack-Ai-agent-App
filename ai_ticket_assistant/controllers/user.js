import bcrypt from 'bcrypt';
import User from '../model/user.model.js';
import jwt from 'jsonwebtoken';
import { inngest } from '../inngest/client.js';

const signup = async (req, res) => {
    const { email, password, skills = [] } = req.body;

    try {
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = await User.create({
            email,
            password: hashedPassword,
            skills,
        });

        // fire inngest
        await inngest.send({
            name: 'user/signup',
            data: { email },
        });

        // sign JWT
        const token = jwt.sign(
            {
                _id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ user, token });
    } catch (error) {
        res.status(500).json({
            error: 'signup failed',
            details: error.message,
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // sign JWT
        const token = jwt.sign(
            {
                _id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ user, token });
    } catch (error) {
        res.status(500).json({
            error: 'login failed',
            details: error.message,
        });
    }
};

const logout = async (req, res) => {
    try {
        const token = req.headers.authorization(" ")[1]
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json("unauthorized :", err)
            }
            res.json({ message: "User logout successfully " })
        })
    } catch (error) {
        res.status(500).json(
            {
                error: "logout failed",
                details: error.message
            }

        )
    }
}

const update = async (req, res) => {

    const { skills = [], role, email } = req.body;

    try {
        if (req.user?.role != 'admin') {
            return res.status(403).json({ error: "Forbidden" })
        }

        const useravailabe = await User.findOne({ email })
        if (!useravailabe) {
            return res.status(401).json({ error: "User not found" })
        }

        await User.updateOne({ email }, { skills: skills.length ? skills : useravailabe.skills, role })

        return res.json({ message: "User updated successfully" });


    } catch (error) {
        res.status(500).json(
            {
                message: "Error while updating data", details: error.message
            }
        )
    }

}

const getUser = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" })
        }
        const user = await User.find().select("-password")

        return res.json(user)
    } catch (error) {

    }
}

export {
    signup,
    login,
    logout,
    update,
    getUser
};

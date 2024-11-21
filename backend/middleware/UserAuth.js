import jwt from 'jsonwebtoken';

export const userAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized, please login again' });
        }

        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        
        console.log(tokenDecoded)
        req.body.userId = tokenDecoded.userId;
        next();
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
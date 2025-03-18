import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization
    const secretKey = process.env.AUTH_SECRET_KEY || '3c864babacaa1471620fe6d005c0b4d262fdd1b12031b682d627260ba52ea8454e0f8121674a1eca592e50ece5300f845d746243f64d505c7006567bb871125c'

    if (!token) {
        return res.status(401).json({ message: 'You cannot access this operation without a token!' })
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token provided!' })
        }

        req.user = decoded
        next()
    })
}

export default authMiddleware
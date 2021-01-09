import { sign, verify } from 'jsonwebtoken';

import authConfig from '../config/auth';

const Generator = {
    createToken(user){
        return sign({ user }, authConfig.secret, { expiresIn: authConfig.expiresIn });
    },

    verifyToken(token){
        return verify(token, authConfig.secret, function(err, decoded) {
            return decoded.user;
        });
    }
};

export default Generator;
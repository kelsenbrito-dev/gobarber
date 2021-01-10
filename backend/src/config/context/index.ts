import { PubSub } from 'apollo-server';
import { verify } from 'jsonwebtoken';

import UsuarioService from '../../app/services/UsuarioService';
import authConfig from '../auth';

const pubsub = new PubSub();

const context = async ({ req, connection }) => {

    // verifica o token passado
    const verifyToken = async token => {
        try {
            if (token) {
                return await verify(token, authConfig.secret, function(err, decoded) {
                    return decoded.user;
                });
            }
            return null
        } catch (error) {
            return null
        }
    }

    let user;
    if (!connection) {
        const token = req.headers.authorization || '';
        user = await verifyToken(token.replace('Bearer', ''));
    }

    return { 
        user,
        usuarioService: UsuarioService,
        pubsub
    };
};

export default context;
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { verify } from 'jsonwebtoken';

import typeDefs from './app/graphql/typeDefs';
import resolvers from './app/graphql/resolvers';
import authConfig from '../src/config/auth';

const createServer = async () => {

    try {
        dotenv.config();

        // verifica o token passado
        const verifyToken = token => {
            try {
                if (token) {
                    return verify(token, authConfig.secret, function(err, decoded) {
                        return decoded.user;
                    });
                }
                return null
            } catch (error) {
                return null
            }
        }
        
        // concexão com o banco de dados
        mongoose.connect(process.env.DATABASE_CONNECTION,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        
        const db = mongoose.connection;
        db.on('error', (err) => console.log(err));
        db.on('open', () => console.log('Database connected!'));

        const app = express();
        
        // confirguração do apollo server
        const server = new ApolloServer({ 
            typeDefs, 
            resolvers, 
            context: ({ req }) => {
                const token = req.headers.authorization || '';
                return { user: verifyToken(token.replace('Bearer', '')) };
            }
        });

        server.applyMiddleware({ app })
        
        // inicia a aplicação na porta 4000
        app.listen(3333, () =>
            console.log(
                `🚀 Server ready at http://localhost:3333${server.graphqlPath}`
            )
        )
    } catch (error) {
        console.log(error)
    }
};

createServer();
import { UserInputError } from 'apollo-server-express'
import bcrypt from 'bcryptjs';

import User from '../../models/User';
import generator from '../../../helpers/generator';

export default {
    Query: {
        users: (_, __, { user }) => {
            if(!user) throw new UserInputError('Você não está autenticado.');

            return User.find();
        },

        user: (_, { _id }, { user }) => {
            if(!user) throw new UserInputError('Você não está autenticado.');

            return User.findById(_id)
        }
    },
    Mutation: {
        login: async (_, { email, password }) => {
            //valida os dados
            if(email == null || password == null || email == undefined || password == undefined){
                throw new UserInputError('O e-mail e password são obrigatórios.');
            }
            
            //verifica se o usuário existe
            const user = await User.findOne({ email});
            if(!user){
                throw new UserInputError(`Usuário ${email} não encontrado.`, { email });
            }else if(!bcrypt.compareSync(password, user.password)){
                throw new UserInputError('Senha incorreta.');
            }else{
                user.token = generator.createToken(user);
                return user;
            }
        },

        createUser: async (_, { data }) => {
            const { name, email, avatar } = data;
            const password = await bcrypt.hash(data.password, 8);

            //grava o usuário
            return await User.create({ name, email, password, avatar }).then((user)=>{
                user.token = generator.createToken(user);
                return user;
            }).catch((error) => {
                throw new UserInputError(error.message);
            });
        },

        updateUser: async (_, { _id, data }, { user }) => {
            if(!user) throw new UserInputError('Você não está autenticado.');

            const { name, email, avatar } = data;
            const password = await bcrypt.hash(data.password, 8);

            return await User.findOneAndUpdate({ _id }, { name, email, password, avatar }, { new: true });
        },
        deleteUser: async (_, { _id }, { user }) => {
            if(!user) throw new UserInputError('Você não está autenticado.');

            return !!(await User.findByIdAndDelete(_id));
        },
    },
}
import { UserInputError } from 'apollo-server-express'
import bcrypt from 'bcryptjs';
import generatePassword from 'generate-password';

import generator from '../../helpers/generator';
import User from '../models/User';
import SendMail from '../utils/SendEmail';

const UsuarioService = {
    users(user) {
        if(!user) throw new UserInputError('Você não está autenticado.');
        return User.find();
    },

    user(_id, user) {
        if(!user) throw new UserInputError('Você não está autenticado.');
        return User.findById(_id)
    },

    async login(email, password) {
        //valida os dados
        if(email == null || password == null || email == undefined || password == undefined){
            throw new UserInputError('O e-mail e password são obrigatórios.');
        }
        
        //verifica se o usuário existe
        const user = await User.findOne({ email });
        if(!user){
            throw new UserInputError(`E-mail não encontrado: ${email}`, { email });
        }else if(!bcrypt.compareSync(password, user.password)){
            throw new UserInputError('Senha incorreta.');
        }
        user.token = generator.createToken(user);
        return user;
    },

    async resetPassword(email) {
        try {
            const user = await User.findOne({ email });
            if(!user){
                throw new UserInputError(`E-mail não encontrado: ${email}`, { email });
            }

            const password = generatePassword.generate({
                length: 8,
                numbers: true
            });

            await User.findOneAndUpdate({ _id: user._id }, { password: password }, { new: true });

            await SendMail({
                to: 'kelsen.brito@bbts.com.br', // <<= alterar para variável "email"
                subject: 'GoBarber - Senha alterada com sucesso.', 
                html: `Olá , <strong>${user.name}</strong>! <br>Sua nova senha é: <strong>${password}</strong>`
            });
        } catch (error) {
            throw new Error(error);
        }
        return true;
    },

    async forgotPassword(email) {
        try {
            const user = await User.findOne({ email });
            if(!user){
                throw new UserInputError(`E-mail não encontrado: ${email}`, { email });
            }

            await SendMail({
                to: 'kelsen.brito@bbts.com.br', // <<= alterar para variável "email"
                subject: 'GoBarber - Recuperação de senha.', 
                html: `Olá , <strong>${user.name}</strong>! <br>Sua senha é: <strong>${password}</strong>`
            });
        } catch (error) {
            throw new Error(error);
        }
        return true;
    },

    async createUser(data, pubsub, topic) {
        const { name, email, avatar } = data;
        const password = await bcrypt.hash(data.password, 8);

        const findUser = await User.findOne({ email });
        if(findUser){
            throw new UserInputError(`E-mail já cadastrado: ${email}`, { email });
        }

        //grava o usuário
        const user = await User.create({ name, email, password, avatar }).then((user)=>{
            return user;
        }).catch((error) => {
            throw new UserInputError(error.message);
        });

        pubsub.publish(topic, { userAdded: user });
        
        SendMail({
            to: 'kelsen.brito@bbts.com.br', // <<= alterar para variável "email"
            subject: 'GoBarber - Cadastro realizado com sucesso.', 
            html: `Olá , <strong>${name}</strong>! <br>Seu cadastro foi realizados com sucesso para o e-mail: <strong>${email}</strong>`}
        );

        return user;
    },

    async updateUser(_id, data, user){
        if(!user) throw new UserInputError('Você não está autenticado.');

        const { name, email, avatar } = data;
        const password = await bcrypt.hash(data.password, 8);

        return await User.findOneAndUpdate({ _id }, { name, email, password, avatar }, { new: true });
    },

    async deleteUser(_id, user){
        if(!user) throw new UserInputError('Você não está autenticado.');

        return !!(await User.findByIdAndDelete(_id));
    },

};

export default UsuarioService;
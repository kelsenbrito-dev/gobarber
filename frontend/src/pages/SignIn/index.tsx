import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { Container, Content, Background, AnimationContainer } from './styles';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface ISignInFormData {
    email: string;
    password: string;
};

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { signIn } = useAuth();
    const { addToast } = useToast();

    const handleSubmit = useCallback(async (data: ISignInFormData) => {
        try {
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                email: Yup.string()
                    .required('E-mail é obrigatório')
                    .email('Digite um e-mail válido'),
                password: Yup.string().min(6, 'No mínimo 6 dígitos'),
            });
            
            await schema.validate(data, { abortEarly: false });
            await signIn({
                email: data.email,
                password: data.password
            });
        } catch (err) {
            if(err instanceof Yup.ValidationError){
                const errors = getValidationErrors(err);
                formRef.current?.setErrors(errors);
                return;
            }
            
            addToast({ 
                type: 'success',
                title: 'Erro na autenticação',
                description: 'Ocorreu um erro ao fazer login, cheque as credenciais.'
            });
        }
    }, [signIn, addToast]);

    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logo} alt="GoBarber" />
                    <Form ref={formRef} onSubmit={handleSubmit} >
                        <h1>Faça seu logon</h1>

                        <Input name="email" icon={FiMail} placeholder="E-mail" />
                        <Input name="password" icon={FiLock} type="password" placeholder="Senha" />
                        <Button type="submit">Entrar</Button>

                        <a href="forgot">Esqueci minha senha</a>
                    </Form>

                    <Link to="/signup">
                        <FiLogIn />
                        Criar conta
                    </Link>
                </AnimationContainer>
            </Content>

            <Background />
        </Container>
    );
};

export default SignIn;
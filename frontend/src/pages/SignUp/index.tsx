import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';
import { Container, Content, Background, AnimationContainer } from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useToast } from '../../hooks/toast';

interface ISignUpFormData {
    name: string;
    email: string;
    password: string;
};

const SingUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();

    const handleSubmit = useCallback(async (data: ISignUpFormData) => {
        try {
            formRef.current?.setErrors({});
            
            const schema = Yup.object().shape({
                name: Yup.string()
                    .required('Nome é obrigatório'),
                email: Yup.string()
                    .required('E-mail é obrigatório')
                    .email('Digite um e-mail válido'),
                password: Yup.string().min(6, 'No mínimo 6 dígitos'),
            });
            
            await schema.validate(data, { abortEarly: false });

            await api.post('', {
                query: `
                    mutation createUser($data: UserInput!){
                        createUser(data: $data){
                            _id name email
                        }
                    }
                `,
                variables: {
                    data: data
                }
            }, {
                headers: {
                  'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if(!response.data.errors){
                    const user = response.data.data.createUser;

                    addToast({
                        type: 'success',
                        title: 'Cadastro realizado',
                        description: `${user.name}, você já pode realizar seu logon no GoBarber!`
                    });

                    history.push('/');
                } else {
                    addToast({
                        type: 'error',
                        title: 'Erro no cadastro',
                        description: response.data.errors[0].message
                    });
                }
            });

        } catch (err) {
            if(err instanceof Yup.ValidationError){
                const errors = getValidationErrors(err);
                formRef.current?.setErrors(errors);
                return;
            }

        }
    }, [addToast, history]);

    return (
        <Container>
            <Background />
            <Content>
                <AnimationContainer>
                    <img src={logo} alt="GoBarber" />

                    <Form ref={formRef} onSubmit={handleSubmit} >
                        <h1>Faça seu cadastro</h1>

                        <Input name="name" icon={FiUser} placeholder="Nome" />
                        <Input name="email" icon={FiMail} placeholder="E-mail" />
                        <Input name="password" icon={FiLock} type="password" placeholder="Senha" />
                        <Button type="submit">Cadastrar</Button>

                    </Form>

                    <Link to="/">
                        <FiArrowLeft />
                        Voltar para logon
                    </Link>
                </AnimationContainer>
            </Content>
        </Container>
    );
};

export default SingUp;
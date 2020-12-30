import React from 'react';
import { useTransition } from 'react-spring';

import Toast from './Toast';
import { Container } from './styles';
import { IToastMessage } from '../../hooks/toast';

interface IToastContainerProps {
    messages: IToastMessage[];
}

const ToastContainer: React.FC<IToastContainerProps> = ({ messages }) => {
    const messagesWithTransitions = useTransition(
        messages, 
        message => message.id,
        {
            from: { right: '-120%'},
            enter: { right: '0%' },
            leave: { right: '-120%' }
        }    
    );
    return (
        <Container>
            {messagesWithTransitions.map(({ item, key, props }) => (
                <Toast key={key} message={item} style={props} />
            ))}
        </Container>
    )
};

export default ToastContainer;
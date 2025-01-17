import React, { useEffect } from 'react';
import { FiAlertCircle, FiXCircle, FiInfo, FiCheckCircle } from 'react-icons/fi';

import { IToastMessage, useToast } from '../../../hooks/toast';
import { Container } from './styles';

interface IToastProps {
    message: IToastMessage;
    style: object;
}

const icons = {
    info: <FiInfo size={24}/>,
    error: <FiAlertCircle size={24}/>,
    success: <FiCheckCircle size={24}/>
}

const Toast: React.FC<IToastProps> = ({ message, style }) => {
    const { removeToast } = useToast();

    useEffect(() => {
        const timer = setTimeout(() => {
            removeToast(message.id);
        }, 3000);
        return () => {
            clearTimeout(timer);
        };
    }, [message.id, removeToast]);

    return (
        <Container type={message.type} hasDescription={message.description ? 1 : 0} style={style}>
            {icons[message.type || 'info']}

            <div>
                <strong>{message.type}</strong>
                {message.description && <p>{message.description}</p>}
            </div>

            <button type="button" onClick={() => removeToast(message.id)}>
                <FiXCircle size={18} />
            </button>
        </Container>
    );
};

export default Toast;
import React from 'react';
import { Redirect, Route as ReactDOMRoute, RouteProps as ReactDOMRouteProps } from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface IRouteProps extends ReactDOMRouteProps {
    isPrivate?: boolean;
    component: React.ComponentType;
};

const Route: React.FC<IRouteProps> = ({ isPrivate = false, component: Component, ...rest }) => {
    const { user } = useAuth();
    return (
        <ReactDOMRoute {...rest} 
            render={({location}) => {
                return isPrivate === !!user ? (
                    <Component />
                ) : (
                    <Redirect to={{ 
                        pathname: isPrivate ? '/' : '/dashboard',
                        state: { from: location }
                    }} />
                )
            }
        } />
    );
};

export default Route;
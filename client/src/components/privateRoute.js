import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { UserContext } from './userContext';

const PrivateRoute = ({ component: Component, route_type: RouteType, ...rest }) => {

    const { isAuthenticated } = useContext(UserContext);
    return <Route {...rest} render={(props) => {
        // console.log(isAuthenticated(), props);
        return isAuthenticated() === true
                        ?  <Component {...props} />
                        :  <Navigate to={{
                            pathname: '/login',
                            state: { from: props.location }
                        }} />
    }} />
}

export default PrivateRoute
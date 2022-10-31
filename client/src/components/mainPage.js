import React from 'react';
import Login from './login';
import UserProvider from './userProvider';
import {
    Route,
    Navigate,
    useLocation,
    Routes,
    useNavigate,
    useParams
} from 'react-router-dom';
import PrivateRoute from './privateRoute';
import Dashboard from './dashboard';

class MainPage extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
        <UserProvider>                             {/* DEN LEITOURGEI TO GAMIMENO TO ROUTES....DOKIMASTIKA EVALA TO LOGIN MONO TOU STO App.js KAI KANEI RENDER TO MPOYRDELO! */}
            <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="/login" component={Login}/>
                        <Route path="/dashboard" element={<PrivateRoute path="/dashboard" component={Dashboard} />} />
            </Routes>
        </UserProvider>
        )
    }
};

export default MainPage;
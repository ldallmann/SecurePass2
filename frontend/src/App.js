import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Access from './pages/Access';
import Home from './pages/Home';
import Profile from './pages/Profile';
import './styles/index.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import LoginRegisterForm from './pages/LoginRegisterForm';
import ProtectedRoute from './components/ProtectedRoute';
import useIdleTimeout from './hooks/useIdleTimeout';

function App() {
  const [users, setUsers] = useState([]);
  const [usersHome, setUsersHome] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [doors, setDoors] = useState([]);
  const [access, setAccess] = useState([]);
  const [accessTest, setAccessTest] = useState([]);
  const [permission, setPermission] = useState([]);
  const [permissionUser, setPermissionUser] = useState([]);
  const [accessLog, setAccessLog] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const fetchInitialData = async () => {
    const endpoints = [
      { url: "http://localhost:8800/user/", setter: setUsers },
      { url: "http://localhost:8800/userHome/", setter: setUsersHome },
      { url: "http://localhost:8800/door/", setter: setDoors },
      { url: "http://localhost:8800/access/", setter: setAccess },
      { url: "http://localhost:8800/accessTest/", setter: setAccessTest },
      { url: "http://localhost:8800/permission/", setter: setPermission },
    ];

    try {
      await Promise.all(
        endpoints.map(async ({ url, setter }) => {
          const response = await axios.get(url);
          setter(response.data);
        })
      );
    } catch (error) {
      console.error("Erro ao carregar dados iniciais:", error);
      toast.error("Erro ao carregar dados iniciais");
    }
  };

  const fetchData = useCallback(async (userID) => {
    try {
      const [userInfoRes, accessLogRes, permissionsUserRes] = await Promise.all([
        axios.get(`http://localhost:8800/userInfo/${userID}`),
        axios.get(`http://localhost:8800/accessLog/${userID}`),
        axios.get(`http://localhost:8800/permissionUser/${userID}`),
      ]);

      setUserInfo(userInfoRes.data);
      setAccessLog(accessLogRes.data);
      setPermissionUser(permissionsUserRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      toast.error("Erro ao carregar dados do usuário");
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <Router>
      <IdleTimeoutWrapper handleLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<LoginRegisterForm />} />
          <Route path="/home" element={<ProtectedRoute><Home usersHome={usersHome} permission={permission} reloadUsersHome={fetchInitialData} /></ProtectedRoute>} />
          <Route path="/access" element={<ProtectedRoute><Access users={users} accessTest={accessTest} doors={doors} reloadAccess={fetchInitialData} /></ProtectedRoute>} />
          <Route path="/profile/:userID" element={
            <ProtectedRoute>
              <UserProfileWrapper
                permission={permission}
                accessLog={accessLog}
                userInfo={userInfo}
                permissionUser={permissionUser}
                fetchData={fetchData}
                reloadUsersHome={fetchInitialData}
                setUserInfo={setUserInfo}
              />
            </ProtectedRoute>
          } />
        </Routes>
      </IdleTimeoutWrapper>
      <ToastContainer />
    </Router>
  );
}

function IdleTimeoutWrapper({ children, handleLogout }) {
  useIdleTimeout(1000000, handleLogout);
  return children;
}

function UserProfileWrapper({ permission, accessLog, userInfo, permissionUser, fetchData, setUserInfo, reloadUsersHome }) {
  const { userID } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfileData = async () => {
      setUserInfo(null);
      setLoading(true);
      await fetchData(userID);
      setLoading(false);
    };

    fetchUserProfileData();
  }, [userID, fetchData]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!userInfo) {
    return <div>Usuário não encontrado.</div>;
  }

  return (
    <Profile
      permission={permission}
      permissionUser={permissionUser}
      accessLog={accessLog}
      userInfo={userInfo}
      reloadUsersHome={reloadUsersHome}
    />
  );
}

export default App;
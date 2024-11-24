import React, { useState } from 'react';
import axios from 'axios';
import estilos from '../styles/LoginRegisterForm.module.css';
import { IoMailOutline } from "react-icons/io5";
import { HiOutlineKey } from "react-icons/hi2";
import { LuUserCircle } from "react-icons/lu";
import TopShield from '../assets/topShield.svg';
import BottomShield from '../assets/bottomShield.svg';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const LoginRegisterForm = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password, confirmPassword, name } = formData;

        if (isRegister) {
            if (password !== confirmPassword) {
                toast.error('As senhas não coincidem');
                return;
            }

            try {
                const response = await axios.post('http://localhost:8800/registerUser/', {
                    name,
                    email: email.toLowerCase(),
                    password
                });
                toast.success(response.data.message || 'Cadastro realizado com sucesso!');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao registrar');
                console.log(error);
            }
        } else {
            try {
                const response = await axios.post('http://localhost:8800/loginUser/', {
                    email: email.toLowerCase(),
                    password
                });
                if (response.data.success) {
                    localStorage.setItem('token', response.data.token);
                    toast.success('Login realizado com sucesso!');
                    setTimeout(() => {
                        window.location.href = '/home';
                    }, 1000);
                } else {
                    toast.error('Email ou senha inválidos');
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao logar');
                console.log(error);
            }
        }
    };

    const handleToggle = () => {
        setIsRegister(!isRegister);

        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            name: ''
        });
    };

    return (
        <div className={estilos.mainContainer}>
            <div className={estilos.container}>
                <div className={estilos.formcontainer}>
                    <div className={estilos.logoContainer}>
                        <img src={TopShield} alt='imagem' />
                        <p><span>Secure</span>Pass</p>
                        <img src={BottomShield} alt='imagem' />
                    </div>
                    <h2>{isRegister ? 'Cadastro' : 'Login'}</h2>
                    <form onSubmit={handleSubmit}>
                        {isRegister && (
                            <div className={estilos.inputContainer}>
                                <div>
                                    <LuUserCircle />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Nome"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        )}
                        <div className={estilos.inputContainer}>
                            <div>
                                <IoMailOutline />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className={estilos.inputContainer}>
                            <div>
                                <HiOutlineKey />
                            </div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Senha"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {isRegister && (
                            <div className={estilos.inputContainer}>
                                <div>
                                    <HiOutlineKey />
                                </div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirmar Senha"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        )}
                        <button type="submit">{isRegister ? 'Cadastrar' : 'Entrar'}</button>
                        <p className={estilos.toggletext} onClick={handleToggle}>
                            {isRegister ? 'Já tem uma conta? Login' : 'Cadastre-se'}
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginRegisterForm;
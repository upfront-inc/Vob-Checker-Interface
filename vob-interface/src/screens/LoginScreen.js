import '../login.css'
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { auth, db } from '../config/Firebase'
import { doc, getDoc } from 'firebase/firestore'
import image from '../assets/logo.png'
import SignupScreen from './SignupScreen'

const LoginScreen = (props) => {
    const {
        setCurrentView
    } = props

    const [currentTab, setCurrentTab] = useState('Login')

    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')

    const [invalidLogin, setInvalidLogin] = useState(false)

    const [activeAccount, setActiveAccount] = useState(true)

    const [resetEmail, setResetEmail] = useState()
    const [resettingPassword, setResettingPassword] = useState(false)

    const handleLoginEmailChange = (e) => {
        setLoginEmail(e.target.value)
    }

    const handleLoginPasswordChange = (e) => {
        setLoginPassword(e.target.value);
    }

    const handleResetEmailChange = (e) => {
        setResetEmail(e.target.value);
    }

    const grabUserInfo = (userId) => {
        const userRef = doc(db, "users", userId);

        getDoc(userRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    let userInfo = docSnap.data();
                    if(userInfo.type === 'active'){
                        setCurrentView('content');
                    } else {
                        setActiveAccount(false)
                    }
                } else {
                    console.log("No such user!");
                    return null;
                }
            })
            .catch((error) => {
                console.error("Error fetching user data:", error)
            });
    }

    const resetPasswordForUser = () => {
        sendPasswordResetEmail(auth, resetEmail.toLowerCase())
        .then(response => {
            console.log('email reset password sent')
            setResettingPassword(false)
        })
        .catch(error => {
            console.log(error)
        })
    }

    const loginUser = () => {
        signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            .then((userCredential) => {
                grabUserInfo(userCredential.user.uid);
            })
            .catch((error) => {
                setInvalidLogin(true);
            });
    }

    const displayLogin = () => {
        return(
            <div className='form-container'>
                <div className='form-header'>Login</div>
                <div className='errors'>
                    {
                        invalidLogin
                            ? <p className='error'>Email/Password don't match any records</p>
                            : null 
                    }
                    {
                        activeAccount === false
                            ? <p className='error'>Account Suspended! Contact Admin</p>
                            : null 
                    }
                </div>
                {
                    resettingPassword
                        ? <div>
                            <div className='input-container'>
                                <p className='label'>Confirm Email</p>
                                <input 
                                    className='input'
                                    type="text" 
                                    placeholder="email..."
                                    value={resetEmail}
                                    onChange={handleResetEmailChange} 
                                />
                            </div>
                            <div className='buttons-container'>
                                <button className='button' onClick={() => {resetPasswordForUser()}}>Reset Password</button>
                            </div>
                        </div>
                        : <div>
                            <div className='input-container'>
                                <p className='label'>Email</p>
                                <input 
                                    className='input'
                                    type="text" 
                                    placeholder="email..."
                                    value={loginEmail}
                                    onChange={handleLoginEmailChange} 
                                />
                            </div>
                            <div className='input-container'>
                                <p className='label'>Password</p>
                                <input 
                                    className='input'
                                    type="password" 
                                    placeholder="password..." 
                                    value={loginPassword}
                                    onChange={handleLoginPasswordChange}
                                />
                                <p style={{fontSize: '12px', marginTop: '4px', color: 'blue'}} onClick={() => {setResettingPassword(!resettingPassword)}}>Forgot Password</p>
                            </div>
                            <div className='buttons-container'>
                                <button className='button' onClick={() => {loginUser()}}>Login</button>
                                <button className='button' onClick={() => {setCurrentTab('Signup')}}>Signup</button>
                            </div>
                        </div>
                }
            </div>
        )
    }

    return (
        <div className='page'>
            <div className='image-container'>
                <img style={{height: '58px', width: '180px'}} src={image} alt='Intellisurance logo'/>
            </div>
            {
                currentTab === 'Login'
                    ? displayLogin()
                    : <SignupScreen setCurrentView={setCurrentView} setCurrentTab={setCurrentTab}/>
            }
        </div>
    )
}

export default LoginScreen
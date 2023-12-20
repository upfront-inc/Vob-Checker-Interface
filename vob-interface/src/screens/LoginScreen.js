import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { auth, db } from '../config/Firebase'
import { doc, setDoc } from 'firebase/firestore'

const LoginScreen = (props) => {
    const {
        setCurrentView
    } = props

    const [currentTab, setCurrentTab] = useState('Login')

    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')

    const [invalidLogin, setInvalidLogin] = useState(false)
    
    const [signupEmail, setSignupEmail] = useState('')
    const [signupPassword, setSignupPassword] = useState('')
    const [signupVerify, setSignupVerify] = useState('')

    const [validSignupEmail, setValidSignupEmail] = useState(false)
    const [validPasswordLength, setValidPasswordLength] = useState(false)
    const [validPasswordNumber, setValidPasswordNumber] = useState(false)
    const [validMatchingPassword, setValidMatchingPassword] = useState(false)

    const handleLoginEmailChange = (e) => {
        setLoginEmail(e.target.value)
    }

    const handleLoginPasswordChange = (e) => {
        setLoginPassword(e.target.value);
    }

    const handleSignupEmailChange = (e) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        emailRegex.test(e.target.value)
            ? setValidSignupEmail(true)
            : setValidSignupEmail(false)
        setSignupEmail(e.target.value);
    }

    const handleSignupPasswordChange = (e) => {
        const hasMinLength = e.target.value.length >= 8;
        hasMinLength 
            ? setValidPasswordLength(true)
            : setValidPasswordLength(false)
        const hasNumber = /\d/.test(e.target.value);
        hasNumber
            ? setValidPasswordNumber(true)
            : setValidPasswordNumber(false)
        setSignupPassword(e.target.value);
    }

    const handleSignupVerifyChange = (e) => {
        const areSame = signupPassword === e.target.value;
        areSame
            ? setValidMatchingPassword(true)
            : setValidMatchingPassword(false)
        setSignupVerify(e.target.value);
    }

    const loginUser = () => {
        signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            .then((userCredential) => {
                setCurrentView('content')
            })
            .catch((error) => {
                setInvalidLogin(true)
            });
    }

    const displayLogin = () => {
        return(
            <div>
                <div>LoginScreen</div>
                {
                    invalidLogin
                        ? <p>Email/Password don't match any records</p>
                        : null 
                }
                <div>
                    <p>Email</p>
                    <input 
                        className='input'
                        type="text" 
                        placeholder="email..."
                        value={loginEmail}
                        onChange={handleLoginEmailChange} 
                    />
                </div>
                <div>
                    <p>Password</p>
                    <input 
                        className='input'
                        type="password" 
                        placeholder="password..." 
                        value={loginPassword}
                        onChange={handleLoginPasswordChange}
                        />
                </div>
                <button onClick={() => {loginUser()}}>Login</button>
                <button onClick={() => {setCurrentTab('Signup')}}>Signup</button>
            </div>
        )
    }

    const signupUser = () => {
        if(validMatchingPassword && validPasswordLength && validPasswordNumber && validSignupEmail){
            createUserAccount()
        } 
    }

    const createUserAccount = () => {
        createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
            .then((userCredential) => {
                createProfile(userCredential.user.uid)
            })
            .catch((error) => {
                console.error('Error creating account:', error.message);
            });
        }
        
    const createProfile = (userId) => {
        const userRef = doc(db, "users", userId);
        const userData = {
            userId: userId,
            status: 'staff',
        }
        setDoc(userRef, userData)
            .then((response) => {
                setCurrentView('content')
            })
            .catch((error) => {
                console.log(`error: ${error}`)
            })
    }

    const displaySignup = () => {
        return(
            <div>
                <div>LoginScreen</div>
                <div>
                    <p>Email</p>
                    <input 
                        className='input'
                        type="text" 
                        placeholder="email..." 
                        value={signupEmail}
                        onChange={handleSignupEmailChange}
                        />
                </div>
                <div>
                    {
                        validSignupEmail
                            ? null
                            : <p>Please enter a valid email!</p>
                    }
                </div>
                <div>
                    <p>Password</p>
                    <input 
                        className='input'
                        type="password" 
                        placeholder="password..." 
                        security={true}
                        value={signupPassword}
                        onChange={handleSignupPasswordChange}
                    />
                </div>
                {
                    validPasswordLength
                        ? null 
                        : <p>Passwords must be 8 characters</p>
                }
                {
                    validPasswordNumber
                        ? null 
                        : <p>Passwords must include a number 0-9</p>
                }
                <div>
                    <p>Verify Password</p>
                    <input 
                        className='input'
                        type="password" 
                        placeholder="verify password..." 
                        security={true}
                        value={signupVerify}
                        onChange={handleSignupVerifyChange}
                    />
                </div>
                {
                    validMatchingPassword
                        ? null 
                        : <p>Password / Verify Don't match</p>
                }
                {
                    auth.currentUser === null 
                        ? null 
                        : <p>{auth.currentUser.uid}</p>
                }
                <button onClick={() => {signupUser()}}>Signup</button>
                <button onClick={() => {setCurrentTab('Login')}}>Login</button>
            </div>
        )
    }

    return (
        <div>
            {
                currentTab === 'Login'
                    ? displayLogin()
                    : displaySignup()
            }
        </div>
    )
}

export default LoginScreen
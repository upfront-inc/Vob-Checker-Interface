import '../login.css'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import React, { useState } from 'react'
import { auth, db } from '../config/Firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import image from '../assets/logo.png'

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
    const [signupName, setSignupName] = useState('')

    const [validSignupEmail, setValidSignupEmail] = useState(false)
    const [validPasswordLength, setValidPasswordLength] = useState(false)
    const [validPasswordNumber, setValidPasswordNumber] = useState(false)
    const [validMatchingPassword, setValidMatchingPassword] = useState(false)

    const [activeAccount, setActiveAccount] = useState(true)

    const handleLoginEmailChange = (e) => {
        setLoginEmail(e.target.value)
    }

    const handleLoginPasswordChange = (e) => {
        setLoginPassword(e.target.value);
    }

    const handleSignupNameChange = (e) => {
        setSignupName(e.target.value);
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
                </div>
                <div className='buttons-container'>
                    <button className='button' onClick={() => {loginUser()}}>Login</button>
                    <button className='button' onClick={() => {setCurrentTab('Signup')}}>Signup</button>
                </div>
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
                console.log(JSON.stringify(userCredential.user))
                createProfile(userCredential.user)
            })
            .catch((error) => {
                console.error('Error creating account:', error.message);
            });
        }
        
    const createProfile = (user) => {
        console.log(user.uid)
        const userRef = doc(db, "users", user.uid);
        const userData = {
            userId: user.uid,
            email: user.email,
            name: signupName,
            company: 'PHG',
            status: 'staff',
            createdAt: new Date(),
            type: 'active'
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
            <div className='form-container'>
                <div className='form-header'>Signup</div>
                <div className='errors'>
                    {
                        validSignupEmail
                        ? null
                        : <p className='error'>Please enter a valid email!</p>
                    }
                    {
                        validPasswordLength
                        ? null 
                        : <p className='error'>Passwords must be 8 characters</p>
                    }
                    {
                        validPasswordNumber
                        ? null 
                        : <p className='error'>Passwords must include (0-9)</p>
                    }
                    {
                        validMatchingPassword
                            ? null 
                            : <p className='error'>Password / Verify Don't match</p>
                    }
                </div>
                <div className='input-container'>
                    <p className='label'>Email</p>
                    <input 
                        className='input'
                        type="text" 
                        placeholder="email..." 
                        value={signupEmail}
                        onChange={handleSignupEmailChange}
                        />
                </div>
                <div>
                </div>
                <div className='input-container'>
                    <p className='label'>Full Name</p>
                    <input 
                        className='input'
                        type="text" 
                        placeholder="Full Name..." 
                        value={signupName}
                        onChange={handleSignupNameChange}
                    />
                </div>
                <div className='input-container'>
                    <p className='label'>Password</p>
                    <input 
                        className='input'
                        type="password" 
                        placeholder="password..." 
                        security={true}
                        value={signupPassword}
                        onChange={handleSignupPasswordChange}
                    />
                </div>
                <div className='input-container'>
                    <p className='label'>Verify Password</p>
                    <input 
                        className='input'
                        type="password" 
                        placeholder="verify password..." 
                        security={true}
                        value={signupVerify}
                        onChange={handleSignupVerifyChange}
                    />
                </div>
                <div className='buttons-container'>
                    <button className='button' onClick={() => {signupUser()}}>Signup</button>
                    <button className='button' onClick={() => {setCurrentTab('Login')}}>Login</button>
                </div>
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
                    : displaySignup()
            }
        </div>
    )
}

export default LoginScreen
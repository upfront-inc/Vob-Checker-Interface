import '../admin.css'
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../config/Firebase'

const AdminPanel = (props) => {
    const {
        userInfo
    } = props

    const [userList, setUserList] = useState([])
    const [companyName, setCompanyName] = useState(userInfo.company)
    const [adminUsers, setAdminusers] = useState()

    useEffect(() => {
        getCompanyUsers()
    }, [])

    const getCompanyUsers = () => {
        const collRef = collection(db, 'users')
        const q = query(collRef, where('company', '==', userInfo.company))
        onSnapshot(q, (snapshot) => {
            let allUsers = []
            let adminCount = 0
            snapshot.forEach(doc => {
                allUsers.push({data: doc.data(), id: doc.id})
                let docData = doc.data()
                if (docData.status === 'admin') {
                    adminCount++;
                }
            })
            setUserList(allUsers)
            setAdminusers(adminCount)
        })
    }

    const makeAdmin = (userId) => {
        const userRef = doc(db, 'users', userId);
        updateDoc(userRef, { status: 'admin' })
            .then(() => console.log(`User ${userId} made admin`))
            .catch((error) => console.error("Error updating user:", error));
    };
    
    const removeAdmin = (userId) => {
        const userRef = doc(db, 'users', userId);
        updateDoc(userRef, { status: 'staff' })
            .then(() => console.log(`Admin ${userId} changed to staff`))
            .catch((error) => console.error("Error updating user:", error));
    };

    const displayResults = () => {
        return(
            <div className='content'>
                {
                    userList.map((user) => {
                        return(
                            <div className='item-row'>
                                <div className='item-sub-row'>
                                    <p >{user.data.email}</p>
                                    <p>{user.data.status}</p>
                                </div>
                                {
                                    user.data.status === 'staff'
                                        ? <div className='edit-container'>
                                            <div>
                                                <button onClick={() => {makeAdmin(user.data.userId)}}>Make Admin</button>
                                            </div>
                                            <div style={{marginLeft: '8px'}}>
                                                <button>X</button>
                                            </div>
                                        </div>
                                        : user.data.status === 'admin'
                                            ? <div>
                                                <button onClick={() => {removeAdmin(user.data.userId)}}>Remove Admin</button>
                                            </div>
                                            : user.data.status === 'owner'
                                                ? null
                                                : null
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    return (
        <div className='admin-panel'>
            <div className='admin-header'>AdminPanel - {companyName}</div>
            {
                userList.length > 0
                    ? displayResults()
                    : null
            }
        </div>
    )
}

export default AdminPanel
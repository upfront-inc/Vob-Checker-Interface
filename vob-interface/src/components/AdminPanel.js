import '../admin.css'
import { collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
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
        if (window.confirm("Are you sure you want to make this user an admin?")) {
            const userRef = doc(db, 'users', userId);
            updateDoc(userRef, { status: 'admin' })
                .then(() => {})
                .catch((error) => console.error("Error updating user:", error));
        }
    };
    
    const removeAdmin = (userId) => {
        if (window.confirm("Are you sure you want to remove this user from admin?")) {
            const userRef = doc(db, 'users', userId);
            updateDoc(userRef, { status: 'staff' })
                .then(() => {})
                .catch((error) => console.error("Error updating user:", error));
        }
    };

    const deleteUserDocument = (userId) => {
        if (window.confirm("Are you sure you want to delete this user's account?")) {
            const userRef = doc(db, 'users', userId);
            updateDoc(userRef, { type: 'suspended' })
                .then(() => {})
                .catch((error) => console.error("Error updating user:", error));
        }
    };

    const displayPanel = () => {
        return(
            <div>
            <div className="table-container-admin hide-scrollbar">
            <table className='table-content'>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Priviledges</th>
                    <th>Remove</th>
                </tr>
                </thead>
                <tbody>
                {userList.map((customer, index) => (
                    <tr key={index}>
                    <td>{customer.data.name}</td>
                    <td>{customer.data.email}</td>
                    <td>{customer.data.status}</td>
                    {
                        customer.data.status === 'staff'
                            ? <td>
                                <button className='made-admin' onClick={() => {makeAdmin(customer.data.userId)}}>Make Admin</button>
                            </td>
                            : customer.data.status === 'admin'
                                ? <td>
                                    <button onClick={() => {removeAdmin(customer.data.userId)}}>Remove Admin</button>
                                </td>
                                : customer.data.status === 'owner'
                                    ? <td></td>
                                    : <td></td>
                    }
                    {
                        customer.data.status === 'staff'
                            ? <td>
                                <button style={{color: '#e94f4e'}} onClick={() => {deleteUserDocument(customer.data.userId)}}>Delete User</button>
                            </td>
                            : <td></td>
                    }
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        )
    }

    return (
        <div className='admin-panel'>
            {
                userList.length > 0
                    ? displayPanel()
                    : null
            }
        </div>
    )
}

export default AdminPanel
import '../dev.css'
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../config/Firebase'

const DevSupportComponent = () => {
    const [ticketList, setTicketList] = useState([])
    const [viewTicket, setViewTicket] = useState(false)
    const [selectedTicket, setSelectedTicket] = useState({})

    useEffect(() => {
        getTIckets()
    }, [])

    const getTIckets = () => {
        const collRef = collection(db, 'Support')
        onSnapshot(collRef, (snapshot) => {
            let allTickets = []
            snapshot.forEach(doc => {
                allTickets.push({data: doc.data(), id: doc.id})
            })
            setTicketList(allTickets)
        })
    }

    const updateViewableTicket = (ticket) => {
        setSelectedTicket(ticket)
        setViewTicket(!viewTicket)
    }

    const updateTicketStatus = (ticketId) => {
        setViewTicket(false)
        const userRef = doc(db, 'Support', ticketId);
        updateDoc(userRef, { status: 'closed' })
            .then(() => {})
            .catch((error) => console.error("Error updating user:", error));
    }

    const displayResults = () => {
        return(
            <div>
                <div className="table-container">
                <table className='table-content'>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>status</th>
                        <th>Subject</th>
                        <th>Message</th>
                        <th>Ticket #</th>
                        <th>Open/Closed</th>
                    </tr>
                    </thead>
                    <tbody>
                    {ticketList.map((ticket, index) => (
                        <tr key={index}>
                        <td>{ticket.data.name}</td>
                        <td>{ticket.data.email}</td>
                        {
                            ticket.data.status === 'closed'
                                ? <td>Closed</td>
                                : <td>Open</td>
                        }
                        <td>{ticket.data.subject}</td>
                        <td>{ticket.data.message}</td>
                        <td>#{ticket.data.ticket}</td>
                        {
                            ticket.data.status === 'active'
                                ? <td><button onClick={() => {updateTicketStatus(ticket.id)}}>Close Ticket</button></td>
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
                ticketList.length > 0
                    ? displayResults()
                    : null
            }
        </div>
    )
}

export default DevSupportComponent
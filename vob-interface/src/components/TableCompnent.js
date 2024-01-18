import React from 'react'

const TableCompnent = (props) => {
    const {
        list,
        customersH
    } = props

    return (
        <div>
            <div className="table-container hide-scrollbar">
            <table className='table-content'>
                <thead>
                <tr>
                    <th>Insurance Name</th>
                    <th>Insurance Prefix</th>
                    <th>Insurance LOC</th>
                    <th>Last Updated</th>
                </tr>
                </thead>
                <tbody>
                {list.map((customer, index) => (
                    <tr key={index}>
                    <td>{customer.data.insuranceName}</td>
                    <td>{customer.data.insurancePrefix}</td>
                    <td>{customer.data.insuranceLoc}</td>
                    <td>{new Date(customer.data.lastUpdate.seconds * 1000).toLocaleDateString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
    )
}

export default TableCompnent
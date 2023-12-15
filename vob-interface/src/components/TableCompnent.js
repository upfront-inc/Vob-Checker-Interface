import React from 'react'

const TableCompnent = (props) => {
    const {
        list,
        customersH
    } = props

    const formatDollarAmount = (str) => {
        const num = parseFloat(str);
        return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    return (
        <div>
            <div className="table-container hide-scrollbar">
            <table className='table-content'>
                <thead>
                <tr>
                    <th>Insurance Name</th>
                    <th>Insurance Prefix</th>
                    <th>Insurance LOC</th>
                    <th>VOB</th>
                    <th>Admitted</th>
                    <th>Last Updated</th>
                </tr>
                </thead>
                <tbody>
                {list.map((customer, index) => (
                    <tr key={index}>
                    <td>{customer.data.insuranceName}</td>
                    <td>{customer.data.insurancePrefix}</td>
                    <td>{customer.data.insuranceLoc}</td>
                    <td>{customer.data.vob}</td>
                    <td>{customer.data.admitted}</td>
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
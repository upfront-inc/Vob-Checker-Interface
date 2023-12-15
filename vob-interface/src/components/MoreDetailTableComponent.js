import React from 'react'

const MoreDetailTableComponent = (props) => {
    const {
        customersH
    } = props

    const formatDollarAmount = (str) => {
        const num = parseFloat(str);
        return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    return (
        <div className="table-container hide-scrollbar">
            <table className='table-content'>
                <thead>
                <tr>
                    <th>Insurance</th>
                    <th>Prefix</th>
                    <th>Residential</th>
                    <th>Detox</th>
                    <th>Total Charges</th>
                    <th>Total Paid</th>
                    <th>Payout Ratio</th>
                    <th>Facility</th>
                    <th>Network</th>
                </tr>
                </thead>
                <tbody>
                {customersH.map((customer, index) => (
                    <tr key={index}>
                    <td>{customer.data.insuranceCompany}</td>
                    <td>{customer.data.prefix}</td>
                    {
                        customer.data.ResidentialDays === undefined
                            ? <td>--</td>
                            : <td>{customer.data.ResidentialDays} Days</td>
                    }
                    {
                        customer.data.DetoxDays === undefined
                            ? <td>--</td>
                            : <td>{customer.data.DetoxDays} Days</td>
                    }
                    <td>{formatDollarAmount(customer.data.totalCharges)}</td>
                    <td>{formatDollarAmount(customer.data.totalPaid)}</td>
                    <td>{customer.data.payoutRatio}%</td>
                    <td>{customer.data.facility}</td>
                    <td>{customer.data.network}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
  )
}

export default MoreDetailTableComponent
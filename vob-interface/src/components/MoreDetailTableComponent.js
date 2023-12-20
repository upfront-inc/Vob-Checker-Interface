import React from 'react'
import { auth } from '../config/Firebase'

const MoreDetailTableComponent = (props) => {
    const {
        customersH,
        userAccess
    } = props

    const formatDollarAmount = (str) => {
        const num = parseFloat(str);
        return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    const showDetails = (customer) => {
        return(
            <>
                <td>{formatDollarAmount(customer.data.totalCharges)}</td>
                {
                    customer.data.totalPaid >= 30000
                        ? <td style={{backgroundColor: '#50c878'}}>{formatDollarAmount(customer.data.totalPaid)}</td>
                        : customer.data.totalPaid  > 0
                            ? <td style={{backgroundColor: '#ff5733'}}>{formatDollarAmount(customer.data.totalPaid)}</td>
                            : <td>{formatDollarAmount(customer.data.totalPaid)}</td>
                }
            </>
        )
    }

    return (
        <div className="table-container hide-scrollbar">
            <table className='table-content'>
                <thead>
                <tr>
                    <th>Insurance</th>
                    <th>Policy</th>
                    <th>Prefix</th>
                    <th>Residential</th>
                    <th>Detox</th>
                    {
                        userAccess === 'staff'
                            ? null
                            : <th>Total Charges</th>
                    }
                    {
                        userAccess === 'staff'
                        ? null
                        : <th>Total Paid</th>
                    }
                    <th>Payout Ratio</th>
                    <th>Facility</th>
                    <th>Network</th>
                </tr>
                </thead>
                <tbody>
                {customersH.map((customer, index) => (
                    <tr key={index}>
                    <td>{customer.data.insuranceCompany}</td>
                    <td>{customer.data.policyNumber}</td>
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
                    {
                        userAccess === 'staff'
                            ? null 
                            : showDetails(customer)
                    }
                    {
                        (((customer.data.payoutRatio) * 100).toFixed(0)) >= 75
                            ? <td style={{backgroundColor: '#50c878'}}>{((customer.data.payoutRatio) * 100).toFixed(0)}%</td>
                            : (((customer.data.payoutRatio) * 100).toFixed(0)) >= 50 && (((customer.data.payoutRatio) * 100).toFixed(0)) < 75
                                ? <td style={{backgroundColor: '#ffc300'}}>{((customer.data.payoutRatio) * 100).toFixed(0)}%</td>
                                : (((customer.data.payoutRatio) * 100).toFixed(0)) > 0 && (((customer.data.payoutRatio) * 100).toFixed(0)) < 50
                                    ? <td style={{backgroundColor: '#ff5733'}}>{((customer.data.payoutRatio) * 100).toFixed(0)}%</td>
                                    : <td>{((customer.data.payoutRatio) * 100).toFixed(0)}%</td>
                    }
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
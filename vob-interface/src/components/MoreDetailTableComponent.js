import React, { useState } from 'react'
import { auth } from '../config/Firebase'

const MoreDetailTableComponent = (props) => {
    const {
        billingList,
        userAccess,
        showTab,
        affinityRecords,
        beachsideRecords,
        axisRecords
    } = props

    const formatDollarAmount = (str) => {
        const num = parseFloat(str);
        return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    const limitString = (str) => {
        if (str.length > 30) {
            return str.substring(0, 30) + '...';
        } else {
            return str;
        }
    }

    const showDetails = (customer) => {
        return(
            <>
                <td>{formatDollarAmount(customer.data.totalCharges)}</td>
                {
                    customer.data.totalPaid >= 30000
                        ? <td style={{color: '#50c878', fontWeight: 600}}>{formatDollarAmount(customer.data.totalPaid)}</td>
                        : customer.data.totalPaid  > 0
                            ? <td style={{color:'#e94f4e', fontWeight: 600}}>{formatDollarAmount(customer.data.totalPaid)}</td>
                            : <td style={{fontWeight: 600}}>{formatDollarAmount(customer.data.totalPaid)}</td>
                }
            </>
        )
    }

    return (
        <div className="table-container-details hide-scrollbar">
            <table className='table-content'>
                <thead>
                <tr>
                    <th>Prefix</th>
                    <th>Insurance</th>
                    <th>Name</th>
                    <th>Network</th>
                    {/* <th>Policy</th> */}
                    <th>Residential</th>
                    <th>Detox</th>
                    <th>Facility</th>
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
                </tr>
                </thead>
                <tbody>
                    {
                        showTab === 'full'
                            ? billingList.map((customer, index) => (
                                <tr key={index}>
                                <td style={{fontWeight: 600}}>{customer.data.prefix}</td>
                                <td title={customer.data.insuranceName}>{limitString(customer.data.insuranceName)}</td>
                                <td>{customer.data.patientName}</td>
                                <td>{customer.data.network}</td>
                                {/* <td>{customer.data.policyNumber}</td> */}
                                {
                                    customer.data.ResidentialDays === undefined
                                        ? <td>--</td>
                                        : <td>{Math.round(customer.data.ResidentialDays)} Days</td>
                                }
                                {
                                    customer.data.DetoxDays === undefined
                                    ? <td>--</td>
                                    : <td>{Math.round(customer.data.DetoxDays)} Days</td>
                                }
                                <td>{customer.data.facility}</td>
                                {
                                    userAccess === 'staff'
                                        ? null 
                                        : showDetails(customer)
                                }
                                <td>{((customer.data.payoutRatio) * 100).toFixed(0)}%</td>
                                </tr>
                            ))
                            : showTab === 'affinity'
                                ? affinityRecords.map((customer, index) => (
                                    <tr key={index}>
                                    <td style={{fontWeight: 600}}>{customer.data.prefix}</td>
                                    <td title={customer.data.insuranceName}>{limitString(customer.data.insuranceName)}</td>
                                    <td>{customer.data.patientName}</td>
                                    <td>{customer.data.network}</td>
                                    {/* <td>{customer.data.policyNumber}</td> */}
                                    {
                                        customer.data.ResidentialDays === undefined
                                            ? <td>--</td>
                                            : <td>{Math.round(customer.data.ResidentialDays)} Days</td>
                                    }
                                    {
                                        customer.data.DetoxDays === undefined
                                        ? <td>--</td>
                                        : <td>{Math.round(customer.data.DetoxDays)} Days</td>
                                    }
                                    <td>{customer.data.facility}</td>
                                    {
                                        userAccess === 'staff'
                                            ? null 
                                            : showDetails(customer)
                                    }
                                    <td>{((customer.data.payoutRatio) * 100).toFixed(0)}%</td>
                                    </tr>
                                ))
                                : showTab === 'beachside'
                                    ? beachsideRecords.map((customer, index) => (
                                        <tr key={index}>
                                        <td style={{fontWeight: 600}}>{customer.data.prefix}</td>
                                        <td title={customer.data.insuranceName}>{limitString(customer.data.insuranceName)}</td>
                                        <td>{customer.data.patientName}</td>
                                        <td>{customer.data.network}</td>
                                        {/* <td>{customer.data.policyNumber}</td> */}
                                        {
                                            customer.data.ResidentialDays === undefined
                                                ? <td>--</td>
                                                : <td>{Math.round(customer.data.ResidentialDays)} Days</td>
                                        }
                                        {
                                            customer.data.DetoxDays === undefined
                                            ? <td>--</td>
                                            : <td>{Math.round(customer.data.DetoxDays)} Days</td>
                                        }
                                        <td>{customer.data.facility}</td>
                                        {
                                            userAccess === 'staff'
                                                ? null 
                                                : showDetails(customer)
                                        }
                                        <td>{((customer.data.payoutRatio) * 100).toFixed(0)}%</td>
                                        </tr>
                                    ))
                                    : showTab === 'axis'
                                        ? axisRecords.map((customer, index) => (
                                            <tr key={index}>
                                            <td style={{fontWeight: 600}}>{customer.data.prefix}</td>
                                            <td title={customer.data.insuranceName}>{limitString(customer.data.insuranceName)}</td>
                                            <td>{customer.data.patientName}</td>
                                            <td>{customer.data.network}</td>
                                            {/* <td>{customer.data.policyNumber}</td> */}
                                            {
                                                customer.data.ResidentialDays === undefined
                                                    ? <td>--</td>
                                                    : <td>{Math.round(customer.data.ResidentialDays)} Days</td>
                                            }
                                            {
                                                customer.data.DetoxDays === undefined
                                                ? <td>--</td>
                                                : <td>{Math.round(customer.data.DetoxDays)} Days</td>
                                            }
                                            <td>{customer.data.facility}</td>
                                            {
                                                userAccess === 'staff'
                                                    ? null 
                                                    : showDetails(customer)
                                            }
                                            <td>{((customer.data.payoutRatio) * 100).toFixed(0)}%</td>
                                            </tr>
                                        ))
                                        : null
                    }
                </tbody>
            </table>
        </div>
  )
}

export default MoreDetailTableComponent
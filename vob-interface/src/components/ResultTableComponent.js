import React from 'react'

const ResultTableCompnent = (props) => {
    const {
        list,
        customersH,
        userAccess
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
                <td>{formatDollarAmount(customer.data.totalCharges * .1)}</td>
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

    const displaySplit = () => {
        return(
            <div>
                <div className="table-container-half hide-scrollbar">
                    <div>Existing Policies</div>
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
                <div className="table-container-half hide-scrollbar">
                    <div>Billing Details</div>
                    <table className='table-content'>
                        <thead>
                        <tr>
                            <th>Insurance</th>
                            <th>Policy</th>
                            <th>Prefix</th>
                            <th>Residential</th>
                            <th>Detox</th>
                            <th>DOC</th>
                            {
                                userAccess === 'staff'
                                    ? null
                                    : <th>Total Charges</th>
                            }
                            {
                                userAccess === 'staff'
                                    ? null
                                    : <th>Deductable</th>
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
                            <td title={customer.data.insuranceName}>{limitString(customer.data.insuranceName)}</td>
                            <td>{customer.data.policyNumber}</td>
                            <td>{customer.data.insurancePrefix}</td>
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
                            <td>{'Alcohol'}</td>
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
            </div>
        )
    }

    const displayListOnly = () => {
        return(
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

    const displayCustomersOnly = () => {
        return(
            <div>
                <div className="table-container hide-scrollbar">
                    <table className='table-content'>
                        <thead>
                        <tr>
                            <th>Insurance</th>
                            <th>Policy</th>
                            <th>Prefix</th>
                            <th>Residential</th>
                            <th>Detox</th>
                            <th>DOC</th>
                            {
                                userAccess === 'staff'
                                    ? null
                                    : <th>Total Charges</th>
                            }
                            {
                                userAccess === 'staff'
                                    ? null
                                    : <th>Deductable</th>
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
                            <td title={customer.data.insuranceName}>{limitString(customer.data.insuranceName)}</td>
                            <td>{customer.data.policyNumber}</td>
                            <td>{customer.data.insurancePrefix}</td>
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
                            <td>{'Alcohol'}</td>
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
            </div>
        )
    }

    return (
        <div>
            {
                list.length > 0 && customersH.length > 0
                    ? displaySplit()
                    : list.length > 0
                        ? displayListOnly()
                        : customersH > 0
                            ? displayCustomersOnly()
                            : null
            }
        </div>
    )
}

export default ResultTableCompnent
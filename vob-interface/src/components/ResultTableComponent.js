import React from 'react'

const ResultTableCompnent = (props) => {
    const {
        list,
        customersH
    } = props

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
                            <th>VOB</th>
                            <th>Daily Rate</th>
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
                            <td>{customer.data.dailyRate}</td>
                            <td>{customer.data.admitted}</td>
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
                            <th>Insurance Name</th>
                            <th>Insurance Prefix</th>
                            <th>Residential Care</th>
                            <th>Detox Care</th>
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
                            <td>{customer.data.insuranceName}</td>
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
                            <td>{customer.data.totalCharges}</td>
                            <td>{customer.data.totalPaid}</td>
                            <td>{customer.data.payoutRatio}</td>
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
                            <th>VOB</th>
                            <th>Daily Rate</th>
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
                            <td>{customer.data.dailyRate}</td>
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

    const displayCustomersOnly = () => {
        return(
            <div>
                <div className="table-container hide-scrollbar">
                    <table className='table-content'>
                        <thead>
                        <tr>
                            <th>Insurance Name</th>
                            <th>Insurance Prefix</th>
                            <th>Residential Care</th>
                            <th>Detox Care</th>
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
                            <td>{customer.data.insuranceName}</td>
                            <td>{customer.data.insurancePrefix}</td>
                            <td>{customer.data.ResidentialDays}</td>
                            <td>{customer.data.DetoxDays}</td>
                            <td>{customer.data.totalCharges}</td>
                            <td>{customer.data.totalPaid}</td>
                            <td>{customer.data.payoutRatio}</td>
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
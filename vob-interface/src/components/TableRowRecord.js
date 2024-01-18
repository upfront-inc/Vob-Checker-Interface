import React, { useState } from 'react'
import { addDoc, collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../config/Firebase'

const TableRowRecord = (props) => {
    const {
        customer,
        index,
        limitString,
        userAccess,
        formatDollarAmount,
        showPrefix,
        showInsurance,
        showNetwork,
        showResDays,
        showResVisits,
        showDetoxDays,
        showDetoxVisits,
        showFacility,
        showTotalCharge,
        showTotalPaid,
        showPayout,
        showVobDecision,
        showVobPercent,
        handleShowSubRecords,
        handleCloseSubRecords,
        showSubTable
    } = props 


    const showDetails = (customer) => {
        return(
            <>
                <td>{formatDollarAmount(customer.data.prefixChargeAverage)}</td>
                <td>{formatDollarAmount(Math.round(customer.data.prefixPaidAverage))}</td>
            </>
        )
    }

    return (
        <>
            <tr key={index}>
                {
                    showPrefix
                        ? <td style={{fontWeight: 600}}>{customer.data.prefix}</td>
                        : null
                }
                {
                    showInsurance
                        ? <td title={customer.data.insuranceName}>{limitString(customer.data.insuranceName)}</td>
                        : null
                }
                {
                    showNetwork
                        ? <td>{customer.data.network.toUpperCase()}</td>
                        : null
                }
                {
                    showResDays
                        ? customer.data.avgResidentialDays === undefined
                            ? <td>--</td>
                            : <td>{Math.round(customer.data.avgResidentialDays)} DAYS</td>
                        : null
                }
                {
                    showResVisits
                        ? <td>{customer.data.totalResidentialPatientCount} VISITS</td>
                        : null
                }
                {
                    showDetoxDays
                        ? customer.data.avgDetoxDays === undefined
                            ? <td>--</td>
                            : <td>{Math.round(customer.data.avgDetoxDays)} DAYS</td>
                        : null
                }
                {
                    showDetoxVisits
                        ? <td>{customer.data.totalDetoxPatientDays} VISITS</td>
                        : null
                }
                {
                    showFacility
                        ? <td>{customer.data.facility}</td>
                        : null
                }
                {
                    userAccess === 'staff' || userAccess === 'owner' || userAccess === 'dev'
                    ? null 
                    : showTotalCharge
                        ? showDetails(customer)
                        : null
                }
                {
                    showPayout
                        ? <td>{Math.round(customer.data.payoutRatio * 100)}%</td>
                        : null
                }
                {
                    showVobDecision
                        ? customer.data.vobDecision.split(' ')[0] === 'Likely'
                            ? <td><p style={{fontWeight: '600', color: '#50C878'}}>{customer.data.vobDecision.split(' ')[0]}</p></td>
                            : <td><p style={{fontWeight: '600', color: '#e94f4e'}}>{customer.data.vobDecision.split(' ')[0]}</p></td>
                        : null
                }
                {
                    userAccess === 'staff' || userAccess === 'owner' || userAccess === 'dev'
                        ? null 
                        : showVobPercent
                            ? customer.data.vobPercent >= 70
                                ? <td><p style={{fontWeight: '600', color: '#50C878'}}>{customer.data.vobPercent}%</p></td>
                                : customer.data.vobPercent >= 60
                                    ? <td><p style={{fontWeight: '600', color: '#FDDA0D'}}>{customer.data.vobPercent}%</p></td>
                                    : <td><p style={{fontWeight: '600', color: '#e94f4e'}}>{customer.data.vobPercent}%</p></td>
                            : null
                }
                {
                    showSubTable
                        ? <td onClick={() => {handleCloseSubRecords()}}><p style={{color: 'blue'}}>Close</p></td>
                        : <td onClick={() => {handleShowSubRecords(customer, index)}}><p style={{color: 'blue'}}>Open</p></td>
                }
            </tr>
        </>
    )
}

export default TableRowRecord
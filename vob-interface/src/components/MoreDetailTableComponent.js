import React, { useState } from 'react'
import { db } from '../config/Firebase'
import { addDoc, collection, query, where, onSnapshot } from 'firebase/firestore'
import TableRowRecord from './TableRowRecord'

const MoreDetailTableComponent = (props) => {
    const {
        billingList,
        userAccess,
        showTab,
        affinityRecords,
        beachsideRecords,
        axisRecords,
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
    } = props

    const [showSubTable, setShowSubTable] = useState(false)
    const [subRecords, setSubRecords] = useState([])

    const [selectedRow, setSelectedRow] = useState(null);


    const handleShowSubRecords = (customer, index) => {
        setShowSubTable(true);
        setSelectedRow(index); // Use index or any other unique identifier
        grabAssociatedRecords(customer);
    };

    const grabAssociatedRecords = (customer) => {
        const colRef = collection(db, 'BillingDetailsInsurancePolicy');
        const q = query(colRef, where('insuranceName', '==', customer.data.insuranceName), where('prefix', '==', customer.data.prefix));
        onSnapshot(q, snapshot => {
            let results = [];
            snapshot.docs.forEach(doc => {
                const docData = doc.data();
                const docId = doc.id;
                results.push({ data: docData, id: docId });
            });
            setSubRecords(results);
        });
    };

    const showDetailsSub = (customer) => {
        return(
            <>
                <td>{formatDollarAmount(customer.data.totalCharges)}</td>
                {
                    customer.data.totalPaid >= 30000
                        ? <td style={{color: '#50c878', fontWeight: 600}}>{formatDollarAmount(customer.data.totalPaid)}</td>
                        : Math.round(customer.data.totalPaid)  > 0
                            ? <td style={{color:'#e94f4e', fontWeight: 600}}>{formatDollarAmount(customer.data.totalPaid)}</td>
                            : <td style={{fontWeight: 600}}>{formatDollarAmount(customer.data.totalPaid)}</td>
                }
            </>
        )
    }
    
    const handleCloseSubRecords = () => {
        setShowSubTable(false)
        setSubRecords([]);
    };

    const formatDollarAmount = (str) => {
        const num = parseFloat(str);
        return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    const limitString = (str) => {
        if (str.length > 25) {
            return str.substring(0, 25) + '...';
        } else {
            return str;
        }
    }

    return (
        <div>
            {
                showSubTable
                    ? <div className="table-container-details-sub-split hide-scrollbar">
                    <table className='table-content'>
                        <thead>
                        <tr>
                            {
                                showPrefix
                                    ? <th>PREFIX</th>
                                    : null
                            }
                            {
                                showInsurance
                                    ? <th>INSURANCE</th>
                                    : null
                            }
                            {
                                showNetwork
                                    ? <th>NETWORK</th>
                                    : null
                            }
                            {
                                showResDays
                                    ? <th>RES. DAYS</th>
                                    : null
                            }
                            {
                                showResVisits
                                    ? <th>RES. VISITS</th>
                                    : null
                            }
                            {
                                showDetoxDays
                                    ? <th>DET. DAYS</th>
                                    : null
                            }
                            {
                                showDetoxVisits
                                    ? <th>DET. VISITS</th>
                                    : null
                            }
                            {
                                showFacility
                                    ? <th>Facility</th>
                                    : null
                            }
                            {
                                userAccess === 'staff' || userAccess === 'owner' || userAccess === 'dev'
                                ? null
                                : showTotalCharge
                                    ? <th>TOTAL Charge</th>
                                    : null
                            }
                            {
                                userAccess === 'staff' || userAccess === 'owner' || userAccess === 'dev'
                                    ? null
                                    : showTotalPaid
                                        ? <th>TOTAL PAID</th>
                                        : null
                            }
                            {
                                showPayout
                                ? <th>PAYOUT %</th>
                                : null
                            }
                            {
                                showVobDecision
                                    ? <th>ADMIT</th>
                                    : null
                            }
                            {
                                userAccess === 'staff' || userAccess === 'owner' || userAccess === 'dev'
                                    ? null
                                    : showVobPercent
                                        ? <th>ADMIT %</th>
                                        : null
                            }
                            <th>Details</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                showTab === 'full'
                                    ? billingList.map((customer, index) => (
                                    isNaN(Math.round(customer.data.prefixPaidAverage / customer.data.prefixChargeAverage))
                                        ?   null 
                                        :   <TableRowRecord 
                                                customer={customer} 
                                                index={index}
                                                limitString={limitString}
                                                userAccess={userAccess}
                                                formatDollarAmount={formatDollarAmount}
                                                showPrefix={showPrefix}
                                                showInsurance={showInsurance}
                                                showNetwork={showNetwork}
                                                showResDays={showResDays}
                                                showResVisits={showResVisits}
                                                showDetoxDays={showDetoxDays}
                                                showDetoxVisits={showDetoxVisits}
                                                showFacility={showFacility}
                                                showTotalCharge={showTotalCharge}
                                                showTotalPaid={showTotalPaid}
                                                showPayout={showPayout}
                                                showVobDecision={showVobDecision}
                                                showVobPercent={showVobPercent}
                                                handleShowSubRecords={handleShowSubRecords}
                                                handleCloseSubRecords={handleCloseSubRecords}
                                                showSubTable={showSubTable}
                                                />
                                    ))
                                    : showTab === 'affinity'
                                        ? affinityRecords.map((customer, index) => (
                                            isNaN(Math.round(customer.data.prefixPaidAverage / customer.data.prefixChargeAverage))
                                                ?   null 
                                                :   <TableRowRecord 
                                                        customer={customer} 
                                                        index={index}
                                                        limitString={limitString}
                                                        userAccess={userAccess}
                                                        formatDollarAmount={formatDollarAmount}
                                                        showPrefix={showPrefix}
                                                        showInsurance={showInsurance}
                                                        showNetwork={showNetwork}
                                                        showResDays={showResDays}
                                                        showResVisits={showResVisits}
                                                        showDetoxDays={showDetoxDays}
                                                        showDetoxVisits={showDetoxVisits}
                                                        showFacility={showFacility}
                                                        showTotalCharge={showTotalCharge}
                                                        showTotalPaid={showTotalPaid}
                                                        showPayout={showPayout}
                                                        showVobDecision={showVobDecision}
                                                        showVobPercent={showVobPercent}
                                                        handleShowSubRecords={handleShowSubRecords}
                                                        handleCloseSubRecords={handleCloseSubRecords}
                                                        showSubTable={showSubTable}
                                                        />
                                        ))
                                        : showTab === 'beachside'
                                            ? beachsideRecords.map((customer, index) => (
                                                isNaN(Math.round(customer.data.prefixPaidAverage / customer.data.prefixChargeAverage))
                                                    ?   null 
                                                    :   <TableRowRecord 
                                                            customer={customer} 
                                                            index={index}
                                                            limitString={limitString}
                                                            userAccess={userAccess}
                                                            formatDollarAmount={formatDollarAmount}
                                                            showPrefix={showPrefix}
                                                            showInsurance={showInsurance}
                                                            showNetwork={showNetwork}
                                                            showResDays={showResDays}
                                                            showResVisits={showResVisits}
                                                            showDetoxDays={showDetoxDays}
                                                            showDetoxVisits={showDetoxVisits}
                                                            showFacility={showFacility}
                                                            showTotalCharge={showTotalCharge}
                                                            showTotalPaid={showTotalPaid}
                                                            showPayout={showPayout}
                                                            showVobDecision={showVobDecision}
                                                            showVobPercent={showVobPercent}
                                                            handleShowSubRecords={handleShowSubRecords}
                                                            handleCloseSubRecords={handleCloseSubRecords}
                                                            showSubTable={showSubTable}
                                                            />
                                            ))
                                            : showTab === 'axis'
                                                ? axisRecords.map((customer, index) => (
                                                    isNaN(Math.round(customer.data.prefixPaidAverage / customer.data.prefixChargeAverage))
                                                    ?   null 
                                                    :   <TableRowRecord 
                                                            customer={customer} 
                                                            index={index}
                                                            limitString={limitString}
                                                            userAccess={userAccess}
                                                            formatDollarAmount={formatDollarAmount}
                                                            showPrefix={showPrefix}
                                                            showInsurance={showInsurance}
                                                            showNetwork={showNetwork}
                                                            showResDays={showResDays}
                                                            showResVisits={showResVisits}
                                                            showDetoxDays={showDetoxDays}
                                                            showDetoxVisits={showDetoxVisits}
                                                            showFacility={showFacility}
                                                            showTotalCharge={showTotalCharge}
                                                            showTotalPaid={showTotalPaid}
                                                            showPayout={showPayout}
                                                            showVobDecision={showVobDecision}
                                                            showVobPercent={showVobPercent}
                                                            handleShowSubRecords={handleShowSubRecords}
                                                            handleCloseSubRecords={handleCloseSubRecords}
                                                            showSubTable={showSubTable}
                                                            />
                                                ))
                                                : null
                            }
                        </tbody>
                    </table>
                </div>
                    : <div className="table-container-details hide-scrollbar">
                    <table className='table-content'>
                        <thead>
                        <tr>
                            {
                                showPrefix
                                    ? <th>PREFIX</th>
                                    : null
                            }
                            {
                                showInsurance
                                    ? <th>INSURANCE</th>
                                    : null
                            }
                            {
                                showNetwork
                                    ? <th>NETWORK</th>
                                    : null
                            }
                            {
                                showResDays
                                    ? <th>RES. DAYS</th>
                                    : null
                            }
                            {
                                showResVisits
                                    ? <th>RES. VISITS</th>
                                    : null
                            }
                            {
                                showDetoxDays
                                    ? <th>DET. DAYS</th>
                                    : null
                            }
                            {
                                showDetoxVisits
                                    ? <th>DET. VISITS</th>
                                    : null
                            }
                            {
                                showFacility
                                    ? <th>Facility</th>
                                    : null
                            }
                            {
                                userAccess === 'staff' || userAccess === 'owner' || userAccess === 'dev'
                                ? null
                                : showTotalCharge
                                    ? <th>TOTAL Charge</th>
                                    : null
                            }
                            {
                                userAccess === 'staff' || userAccess === 'owner' || userAccess === 'dev'
                                    ? null
                                    : showTotalPaid
                                        ? <th>TOTAL PAID</th>
                                        : null
                            }
                            {
                                showPayout
                                ? <th>PAYOUT %</th>
                                : null
                            }
                            {
                                showVobDecision
                                    ? <th>ADMIT</th>
                                    : null
                            }
                            {
                                userAccess === 'staff' || userAccess === 'owner' || userAccess === 'dev'
                                    ? null
                                    : showVobPercent
                                        ? <th>ADMIT %</th>
                                        : null
                            }
                            <th>Details</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                showTab === 'full'
                                    ? billingList.map((customer, index) => (
                                    isNaN(Math.round(customer.data.prefixPaidAverage / customer.data.prefixChargeAverage))
                                        ?   null 
                                        :   <TableRowRecord 
                                                customer={customer} 
                                                index={index}
                                                limitString={limitString}
                                                userAccess={userAccess}
                                                formatDollarAmount={formatDollarAmount}
                                                showPrefix={showPrefix}
                                                showInsurance={showInsurance}
                                                showNetwork={showNetwork}
                                                showResDays={showResDays}
                                                showResVisits={showResVisits}
                                                showDetoxDays={showDetoxDays}
                                                showDetoxVisits={showDetoxVisits}
                                                showFacility={showFacility}
                                                showTotalCharge={showTotalCharge}
                                                showTotalPaid={showTotalPaid}
                                                showPayout={showPayout}
                                                showVobDecision={showVobDecision}
                                                showVobPercent={showVobPercent}
                                                handleShowSubRecords={handleShowSubRecords}
                                                handleCloseSubRecords={handleCloseSubRecords}
                                                showSubTable={showSubTable}
                                                />
                                    ))
                                    : showTab === 'affinity'
                                        ? affinityRecords.map((customer, index) => (
                                            isNaN(Math.round(customer.data.prefixPaidAverage / customer.data.prefixChargeAverage))
                                                ?   null 
                                                :   <TableRowRecord 
                                                        customer={customer} 
                                                        index={index}
                                                        limitString={limitString}
                                                        userAccess={userAccess}
                                                        formatDollarAmount={formatDollarAmount}
                                                        showPrefix={showPrefix}
                                                        showInsurance={showInsurance}
                                                        showNetwork={showNetwork}
                                                        showResDays={showResDays}
                                                        showResVisits={showResVisits}
                                                        showDetoxDays={showDetoxDays}
                                                        showDetoxVisits={showDetoxVisits}
                                                        showFacility={showFacility}
                                                        showTotalCharge={showTotalCharge}
                                                        showTotalPaid={showTotalPaid}
                                                        showPayout={showPayout}
                                                        showVobDecision={showVobDecision}
                                                        showVobPercent={showVobPercent}
                                                        handleShowSubRecords={handleShowSubRecords}
                                                        handleCloseSubRecords={handleCloseSubRecords}
                                                        showSubTable={showSubTable}
                                                        />
                                        ))
                                        : showTab === 'beachside'
                                            ? beachsideRecords.map((customer, index) => (
                                                isNaN(Math.round(customer.data.prefixPaidAverage / customer.data.prefixChargeAverage))
                                                    ?   null 
                                                    :   <TableRowRecord 
                                                            customer={customer} 
                                                            index={index}
                                                            limitString={limitString}
                                                            userAccess={userAccess}
                                                            formatDollarAmount={formatDollarAmount}
                                                            showPrefix={showPrefix}
                                                            showInsurance={showInsurance}
                                                            showNetwork={showNetwork}
                                                            showResDays={showResDays}
                                                            showResVisits={showResVisits}
                                                            showDetoxDays={showDetoxDays}
                                                            showDetoxVisits={showDetoxVisits}
                                                            showFacility={showFacility}
                                                            showTotalCharge={showTotalCharge}
                                                            showTotalPaid={showTotalPaid}
                                                            showPayout={showPayout}
                                                            showVobDecision={showVobDecision}
                                                            showVobPercent={showVobPercent}
                                                            handleShowSubRecords={handleShowSubRecords}
                                                            handleCloseSubRecords={handleCloseSubRecords}
                                                            showSubTable={showSubTable}
                                                            />
                                            ))
                                            : showTab === 'axis'
                                                ? axisRecords.map((customer, index) => (
                                                    isNaN(Math.round(customer.data.prefixPaidAverage / customer.data.prefixChargeAverage))
                                                    ?   null 
                                                    :   <TableRowRecord 
                                                            customer={customer} 
                                                            index={index}
                                                            limitString={limitString}
                                                            userAccess={userAccess}
                                                            formatDollarAmount={formatDollarAmount}
                                                            showPrefix={showPrefix}
                                                            showInsurance={showInsurance}
                                                            showNetwork={showNetwork}
                                                            showResDays={showResDays}
                                                            showResVisits={showResVisits}
                                                            showDetoxDays={showDetoxDays}
                                                            showDetoxVisits={showDetoxVisits}
                                                            showFacility={showFacility}
                                                            showTotalCharge={showTotalCharge}
                                                            showTotalPaid={showTotalPaid}
                                                            showPayout={showPayout}
                                                            showVobDecision={showVobDecision}
                                                            showVobPercent={showVobPercent}
                                                            handleShowSubRecords={handleShowSubRecords}
                                                            handleCloseSubRecords={handleCloseSubRecords}
                                                            showSubTable={showSubTable}
                                                            />
                                                ))
                                                : null
                            }
                        </tbody>
                    </table>
                </div>
            }
            
            {
                showSubTable
                    ? subRecords.length < 1
                        ?   null
                        :   <div className='table-container-details-sub-table'>
                                <table className='table-content-sub'>
                                    <thead>
                                    <tr>
                                        <th>Insurance</th>
                                        <th>Policy</th>
                                        <th>Prefix</th>
                                        <th>Network</th>
                                        <th>Facility</th>
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
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {subRecords.map((customer, index) => (
                                        isNaN(customer.data.totalPaid)
                                            ? null 
                                            : 
                                        <tr key={index}>
                                        <td title={customer.data.insuranceName}>{limitString(customer.data.insuranceName)}</td>
                                        <td>{customer.data.insurancePolicy}</td>
                                        <td>{customer.data.prefix}</td>
                                        <td>{customer.data.network}</td>
                                        <td>{customer.data.facility}</td>
                                        {
                                            customer.data.residentialDaysAverage === undefined
                                                ? <td>--</td>
                                                : <td>{Math.round(customer.data.residentialDaysAverage)} Days</td>
                                        }
                                        {
                                            customer.data.detoxDaysAverage === undefined
                                                ? <td>--</td>
                                                : <td>{Math.round(customer.data.detoxDaysAverage)} Days</td>
                                        }
                                        {
                                            userAccess === 'staff'
                                                ? null 
                                                : showDetailsSub(customer)
                                        }
                                        {
                                            (((customer.data.payoutRatio) * 100).toFixed(0)) >= 75
                                                ? <td style={{color: '#50c878'}}>{((customer.data.payoutRatio) * 100).toFixed(0)}%</td>
                                                : (((customer.data.payoutRatio) * 100).toFixed(0)) >= 50 && (((customer.data.payoutRatio) * 100).toFixed(0)) < 75
                                                    ? <td style={{color: '#e94f4e'}}>{((customer.data.payoutRatio) * 100).toFixed(0)}%</td>
                                                    : (((customer.data.payoutRatio) * 100).toFixed(0)) > 0 && (((customer.data.payoutRatio) * 100).toFixed(0)) < 50
                                                        ? <td style={{color: '#ff5733'}}>{((customer.data.payoutRatio) * 100).toFixed(0)}%</td>
                                                        : <td>{((customer.data.payoutRatio) * 100).toFixed(0)}%</td>
                                        }
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                    : null
            }
        </div>
  )
}

export default MoreDetailTableComponent
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
        axisRecords
    } = props

    const [showPrefix, setShowPrefix] = useState(true)
    const [showInsurance, setShowInsurance] = useState(true)
    const [showNetwork, setShowNetwork] = useState(true)
    const [showResDays, setShowResDays] = useState(true)
    const [showResVisits, setShowResVisits] = useState(true)
    const [showDetoxDays, setShowDetoxDays] = useState(true)
    const [showDetoxVisits, setShowDetoxVisits] = useState(true)
    const [showFacility, setShowFacility] = useState(true)
    const [showTotalCharge, setShowTotalCharge] = useState(true)
    const [showTotalPaid, setShowTotalPaid] = useState(true)
    const [showPayout, setShowPayout] = useState(true)
    const [showVobDecision, setShowVobDecision] = useState(true)
    const [showVobPercent, setShowVobPercent] = useState(true)

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

    const handleShowPrefix = () => {
        setShowPrefix(!showPrefix)
    }

    const handleShowInsurance = () => {
        setShowInsurance(!showInsurance)
    }

    const handleShowNetwork = () => {
        setShowNetwork(!showNetwork)
    }

    const handleShowResDays = () => {
        setShowResDays(!showResDays)
    }

    const handleShowResVisits = () => {
        setShowResVisits(!showResVisits)
    }

    const handleShowDetoxDays = () => {
        setShowDetoxDays(!showDetoxDays)
    }

    const handleShowDetoxVisits = () => {
        setShowDetoxVisits(!showDetoxVisits)
    }

    const handleShowFacility = () => {
        setShowFacility(!showFacility)
    }

    const handleShowTotalCharge = () => {
        setShowTotalCharge(!showTotalCharge)
    }

    const handleShowTotalPaid = () => {
        setShowTotalPaid(!showTotalPaid)
    }

    const handleShowPayout = () => {
        setShowPayout(!showPayout)
    }

    const handleShowVobDecision = () => {
        setShowVobDecision(!showVobDecision)
    }

    const handleShowVobPercent = () => {
        setShowVobPercent(!showVobPercent)
    }

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
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginBottom: '12px'}}>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginRight: '10px'}}>
                    <input type="checkbox" id="prefix" name="prefix" onChange={handleShowPrefix} checked={showPrefix}/>
                    <label style={{whiteSpace: 'nowrap', marginLeft: '4px'}} htmlFor="prefix">Prefix</label> 
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginRight: '10px'}}>
                    <input type="checkbox" id="insurance" name="insurance" onChange={handleShowInsurance} checked={showInsurance}/>
                    <label style={{whiteSpace: 'nowrap', marginLeft: '4px'}} htmlFor="prefix">Insurance</label> 
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginRight: '10px'}}>
                    <input type="checkbox" id="network" name="network" onChange={handleShowNetwork} checked={showNetwork}/>
                    <label style={{whiteSpace: 'nowrap', marginLeft: '4px'}} htmlFor="prefix">Network</label> 
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginRight: '10px'}}>
                    <input type="checkbox" id="resDays" name="resDays" onChange={handleShowResDays} checked={showResDays}/>
                    <label style={{whiteSpace: 'nowrap', marginLeft: '4px'}} htmlFor="prefix">Res. Days</label> 
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginRight: '10px'}}>
                    <input type="checkbox" id="resVisits" name="resVisits" onChange={handleShowResVisits} checked={showResVisits}/>
                    <label style={{whiteSpace: 'nowrap', marginLeft: '4px'}} htmlFor="prefix">Res. Visits</label> 
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginRight: '10px'}}>
                    <input type="checkbox" id="detoxDays" name="detoxDays" onChange={handleShowDetoxDays} checked={showDetoxDays}/>
                    <label style={{whiteSpace: 'nowrap', marginLeft: '4px'}} htmlFor="prefix">Detox Days</label> 
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginRight: '10px'}}>
                    <input type="checkbox" id="detoxVisits" name="detoxVisits" onChange={handleShowDetoxVisits} checked={showDetoxVisits}/>
                    <label style={{whiteSpace: 'nowrap', marginLeft: '4px'}} htmlFor="prefix">Detox Visits</label> 
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginRight: '10px'}}>
                    <input type="checkbox" id="facility" name="facility" onChange={handleShowFacility} checked={showFacility}/>
                    <label style={{whiteSpace: 'nowrap', marginLeft: '4px'}} htmlFor="prefix">Facility</label> 
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginRight: '10px'}}>
                    <input type="checkbox" id="totalCharges" name="totalCharges" onChange={handleShowTotalCharge} checked={showTotalCharge}/>
                    <label style={{whiteSpace: 'nowrap', marginLeft: '4px'}} htmlFor="prefix">Total Charges</label> 
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginRight: '10px'}}>
                    <input type="checkbox" id="totalPaid" name="totalPaid" onChange={handleShowTotalPaid} checked={showTotalPaid}/>
                    <label style={{whiteSpace: 'nowrap', marginLeft: '4px'}} htmlFor="prefix">Total Paid</label> 
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginRight: '10px'}}>
                    <input type="checkbox" id="payout" name="payout" onChange={handleShowPayout} checked={showPayout}/>
                    <label style={{whiteSpace: 'nowrap', marginLeft: '4px'}} htmlFor="prefix">Payout Ratio</label> 
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginRight: '10px'}}>
                    <input type="checkbox" id="decision" name="decision" onChange={handleShowVobDecision} checked={showVobPercent}/>
                    <label style={{whiteSpace: 'nowrap', marginLeft: '4px'}} htmlFor="prefix">ADMIT</label> 
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginRight: '10px'}}>
                    <input type="checkbox" id="vobPercent" name="vobPercent" onChange={handleShowVobPercent} checked={showVobPercent}/>
                    <label style={{whiteSpace: 'nowrap', marginLeft: '4px'}} htmlFor="prefix">ADMIT %</label> 
                </div>
            </div>
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
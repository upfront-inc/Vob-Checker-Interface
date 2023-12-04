import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://24.144.87.113:3010/api/v1/interface';

function App() {
  const [customers, setCustomers] = useState([])
  const [approvedCustomers, setApprovedCustomers] = useState([])
  const [rejectedCustomers, setRejectedCustomers] = useState([])
  const [unknownCustomers, setUnknownCustomers] = useState([])
  const [currentTab, setCurrentTab] = useState('Unknown')
  const [loadingData, setLoadingData] = useState('true')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isApprovedChecked, setIsApprovedChecked] = useState(false)
  const [isRejectedChecked, setIsRejectedChecked] = useState(false)

  useEffect(() => {
    grabCustomers()
  }, [])

  useEffect(() => {
    if (selectedCustomer === null) {
      return;
    }
  
    if (selectedCustomer.evaluation === "Yes") {
      setIsApprovedChecked(true);
      setIsRejectedChecked(false)
    } else if (selectedCustomer.evaluation === "No") {
      setIsRejectedChecked(true);
      setIsApprovedChecked(false);
    } else {
      setIsApprovedChecked(false);
      setIsRejectedChecked(false)
    }
    
  }, [selectedCustomer])

  const grabCustomers = () => {
    const requestConfig = {
      url: API_BASE_URL, 
      method: 'get',  
      headers: {
        'Content-Type': 'application/json',  
      },
    };
    axios.request(requestConfig)
      .then(response => {
        setCustomers(response.data)
        sortCustomers(response.data)
        setLoadingData(false)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const sortCustomers = (customerList) => {
    let approved = [];
    let rejected = [];
    let unknown = [];
  
    customerList.forEach(customer => {
      if (customer.evaluation === "Unknown") {
        unknown.push(customer);
      } else if (customer.evaluation === "Yes") {
        approved.push(customer);
      } else {
        rejected.push(customer);
      }
    });
  
    setApprovedCustomers(approved);
    setRejectedCustomers(rejected);
    setUnknownCustomers(unknown);
  }

  const changeEvaluation = () => {
    
  }

  const displayUnknown = () => {
    return(
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Insurance Prefix</th>
              <th>Level of Care</th>
              <th>Daily Rate</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {unknownCustomers.map((customer, index) => (
              <tr key={index} onClick={() => {setSelectedCustomer(customer)}}>
                <td>{customer.customerName}</td>
                <td>{customer.insurancePrefix}</td>
                <td>{customer.insuranceLoc}</td>
                <td>{customer.dailyRate}</td>
                <td>{customer.lastUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const displayAccepted = () => {
    return(
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Insurance Prefix</th>
              <th>Level of Care</th>
              <th>Daily Rate</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {approvedCustomers.map((customer, index) => (
              <tr key={index} onClick={() => {setSelectedCustomer(customer)}}>
                <td>{customer.customerName}</td>
                <td>{customer.insurancePrefix}</td>
                <td>{customer.insuranceLoc}</td>
                <td>{customer.dailyRate}</td>
                <td>{customer.lastUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const displayRejected = () => {
    return(
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Insurance Prefix</th>
              <th>Level of Care</th>
              <th>Daily Rate</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {rejectedCustomers.map((customer, index) => (
              <tr key={index} onClick={() => {setSelectedCustomer(customer)}}>
                <td>{customer.customerName}</td>
                <td>{customer.insurancePrefix}</td>
                <td>{customer.insuranceLoc}</td>
                <td>{customer.dailyRate}</td>
                <td>{customer.lastUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          VOB-checker-interface
        </p>
        <div onClick={() => {setCurrentTab('Unknown')}}>
          <p>Unknown</p>
        </div>
        <div onClick={() => {setCurrentTab('Approved')}}>
          <p>Accepted</p>
        </div>
        <div onClick={() => {setCurrentTab('Rejected')}}>
          <p>Rejected</p>
        </div>
        {
          loadingData === true
            ? <p>Loading</p>
            : currentTab === 'Unknown'
                ? displayUnknown()
                : currentTab === 'Approved'
                    ? displayAccepted()
                    : currentTab === 'Rejected'
                        ? displayRejected()
                        : null
        }
        {
          selectedCustomer === null
            ? null 
            : (
              <div>
                <p>Customer Name: {selectedCustomer.customerName}</p>
                <p>Customer Name: {selectedCustomer.insurancePrefix}</p>
                <p>Customer Name: {selectedCustomer.insuranceLoc}</p>
                <p>Customer Name: {selectedCustomer.dailyRate}</p>
                <p>Customer Name: {selectedCustomer.lastUpdate}</p>
                <div>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={isApprovedChecked} 
                      onChange={() => {changeEvaluation()}} 
                    />
                    Yes
                  </label>

                  <label>
                    <input 
                      type="checkbox" 
                      checked={isRejectedChecked} 
                      // onChange={handleNoChange} 
                    />
                    No
                  </label>
                </div>
              </div>
            )
        }
      </header>
    </div>
  );
}

export default App;

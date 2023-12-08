import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://24.144.87.113:3010/api/v1/interface';
const API_BASE_URL_Local = 'http://localhost:3010/api/v1/interface';

function App() {
  const [customers, setCustomers] = useState([])
  const [approvedCustomers, setApprovedCustomers] = useState([])
  const [rejectedCustomers, setRejectedCustomers] = useState([])
  const [oldCustomers, setOldCustomers] = useState([])
  const [unknownCustomers, setUnknownCustomers] = useState([])
  const [currentTab, setCurrentTab] = useState('old')
  const [loadingData, setLoadingData] = useState('true')

  const [selectedOption, setSelectedOption] = useState('insurancePrefix');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    grabCustomers()
  }, [])

  const grabCustomers = () => {
    const requestConfig = {
      url: API_BASE_URL_Local, 
      method: 'get',  
      headers: {
        'Content-Type': 'application/json',  
      },
    };
    axios.request(requestConfig)
      .then(response => {
        console.log(response.data.length)
        setCustomers(response.data)
        sortCustomers(response.data)
        setLoadingData(false)
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  const sortCustomers = (customerList) => {
    let old = [];
    let approved = [];
    let rejected = [];
    let unknown = [];
  
    customerList.forEach(customer => {
      if (customer.data.evaluation === "yes") {
        approved.push(customer);
        old.push(customer)
      } else if (customer.data.evaluation === "no") {
        rejected.push(customer);
        old.push(customer)
      } else if (customer.data.evaluation === "unknown") {
        unknown.push(customer);
      }
    });

    console.log('approved length: ', approved.length)
    console.log('rejected length: ', rejected.length)
    console.log('unknown length: ', unknown.length)
  
    setApprovedCustomers(approved);
    setRejectedCustomers(rejected);
    setUnknownCustomers(unknown);
    setOldCustomers(old)
  }

  const handleSelect = (e) => {
    setSelectedOption(e.target.value);
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  }

  const searchCurrentQuery = () => {
    let newUrl = API_BASE_URL_Local 
    if(selectedOption === 'insurancePrefix'){
      newUrl = newUrl + '?' + 'insurancePrefix=' + searchQuery
    } else if (selectedOption === 'insuranceName'){
      newUrl = newUrl + '?' + 'insuranceName=' + searchQuery
    } else if (selectedOption === 'insuranceLoc'){
      newUrl = newUrl + '?' + 'insuranceLoc=' + searchQuery
    } else {
      newUrl = newUrl
    }
    console.log(newUrl)
    const requestConfig = {
      url: newUrl, 
      method: 'get',  
      headers: {
        'Content-Type': 'application/json',  
      },
    };
    axios.request(requestConfig)
      .then(response => {
        console.log(response.data.length)
        setCustomers(response.data)
        sortCustomers(response.data)
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  const displayAccepted = () => {
    return(
      <div className="table-container">
       <table>
          <thead>
            <tr>
              <th>Insurance Name</th>
              <th>Insurance Prefix</th>
              <th>Insurance LOC</th>
              <th>Daily Rate</th>
              <th>VOB</th>
              <th>Admitted</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {oldCustomers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.data.insuranceName}</td>
                <td>{customer.data.insurancePrefix}</td>
                <td>{customer.data.insuranceLoc}</td>
                <td>{customer.data.dailyRate}</td>
                <td>{customer.data.evaluation}</td>
                <td>{customer.data.admitted}</td>
                <td>{customer.data.lastUpdate}</td>
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
              <th>Insurance Name</th>
              <th>Insurance Prefix</th>
              <th>Insurance LOC</th>
              <th>Daily Rate</th>
              <th>VOB</th>
              <th>Admitted</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {oldCustomers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.data.insuranceName}</td>
                <td>{customer.data.insurancePrefix}</td>
                <td>{customer.data.insuranceLoc}</td>
                <td>{customer.data.dailyRate}</td>
                <td>{customer.data.evaluation}</td>
                <td>{customer.data.admitted}</td>
                <td>{customer.data.lastUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const displayUnknown = () => {
    return(
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Insurance Name</th>
              <th>Insurance Prefix</th>
              <th>Insurance LOC</th>
              <th>Daily Rate</th>
              <th>VOB</th>
              <th>Admitted</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {unknownCustomers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.data.insuranceName}</td>
                <td>{customer.data.insurancePrefix}</td>
                <td>{customer.data.insuranceLoc}</td>
                <td>{customer.data.dailyRate}</td>
                <td>{customer.data.evaluation}</td>
                <td>{customer.data.admitted}</td>
                <td>{customer.data.lastUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const displayOld = () => {
    return(
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Insurance Name</th>
              <th>Insurance Prefix</th>
              <th>Insurance LOC</th>
              <th>Daily Rate</th>
              <th>VOB</th>
              <th>Admitted</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {oldCustomers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.data.insuranceName}</td>
                <td>{customer.data.insurancePrefix}</td>
                <td>{customer.data.insuranceLoc}</td>
                <td>{customer.data.dailyRate}</td>
                <td>{customer.data.evaluation}</td>
                <td>{customer.data.admitted}</td>
                <td>{customer.data.lastUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="App">
      <div className="App-header">
        <div className='top-bar'>
          <p className='header'>
            Premier Health Group VOB 
          </p>
          <div className="menuTabs">
            <div className='sub-menu left-nav'>
              <div className="menuItem" onClick={() => {setCurrentTab('old')}}>
                <p>Hisorical Entries</p>
              </div>
              <div className="menuItem" onClick={() => {setCurrentTab('new')}}>
                <p>New Entries</p>
              </div>
            </div>
            <div className='sub-menu'>
              {
                currentTab === 'old' || currentTab === 'yes' || currentTab === 'no'
                  ? <div className="menuTabs">
                      <div className="menuItem" onClick={() => {setCurrentTab('yes')}}>
                        <p>Approved</p>
                      </div>
                      <div className="menuItem" onClick={() => {setCurrentTab('no')}}>
                        <p>Rejected</p>
                      </div>
                    </div>
                  : null
              }
            </div>
          </div>
          <div className='bottom-bar'>
            <div className='search-bar'>
              <select className='select-container' value= {selectedOption} onChange={handleSelect}>
                <option value="insurancePrefix">Insurance Prefix</option>
                <option value="insuranceName">Insurance Name</option>
                <option value="insuranceLoc">Insurance LOC</option>
              </select>
              <input 
                className='input'
                type="text" 
                placeholder="Search..." 
                value={searchQuery} 
                onChange={handleSearchChange} 
              />
              <button onClick={() => {searchCurrentQuery()}}>Search</button>
            </div>
            <div className='sort-container'>
              <p className='sort-header'>Sort: </p>
              <select className='sort-select' value={selectedOption} onChange={handleSelect}>
                <option value="insuranceName">Insurance Name</option>
                <option value="insurancePrefix">Insurance Prefix</option>
                <option value="insuranceLoc">Insurance LOC</option>
                <option value="insurancePrefix">Daily Rate</option>
                <option value="insuranceName">VOB</option>
                <option value="insuranceLoc">Admitted</option>
                <option value="insuranceLoc">Last Upated</option>
              </select>
            </div>
          </div>
        </div>
        <div className='table-content'>
          {
            loadingData === true
              ? <p>Loading</p>
              : currentTab === 'old'
                  ? displayOld()
                  : currentTab === 'yes'
                      ? displayAccepted()
                      : currentTab === 'no'
                          ? displayRejected()
                          : currentTab === 'new'
                              ? displayUnknown()
                              : null
          }
        </div>
      </div>
    </div>
  );
}

export default App;

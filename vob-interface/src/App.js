import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import image from './assets/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import TableCompnent from './components/TableCompnent';
import MoreDetailTableComponent from './components/MoreDetailTableComponent';
import { auth, db } from './config/Firebase';
import LoginScreen from './screens/LoginScreen';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const API_BASE_URL = 'https://www.telliref.com/api/v1/interface';
const API_BASE_URL_Historical = 'https://www.telliref.com/api/v1/interface';
const API_BASE_URL_Local = 'http://localhost:3010/api/v1/interface';
const API_BASE_URL_Local_Historical = 'http://localhost:3010/api/v1/interface-historical';

function App() {
  const [customers, setCustomers] = useState([])
  const [customersH, setCustomersH] = useState([])
  const [approvedCustomers, setApprovedCustomers] = useState([])
  const [rejectedCustomers, setRejectedCustomers] = useState([])
  const [oldCustomers, setOldCustomers] = useState([])
  const [unknownCustomers, setUnknownCustomers] = useState([])
  const [currentTab, setCurrentTab] = useState('old')
  const [loadingData, setLoadingData] = useState('true')

  const [selectedOption, setSelectedOption] = useState('insurancePrefix');
  const [searchQuery, setSearchQuery] = useState('');

  const [sortOption, setSortOption] = useState('insuranceName')

  const [currentView, setCurrentView] = useState('content')

  const [userAccess, setuserAccess] = useState('staff')

  useEffect(() => {
    if (auth.currentUser === null) {
      console.log()
    } else {
      grabCustomers();
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentView('content');
        grabUserInfo();
        grabCustomers();
      } else {
        setCurrentView('login');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    searchCurrentQuery()
  }, [sortOption])

  const grabUserInfo = () => {
    const userRef = doc(db, "users", auth.currentUser.uid);

    getDoc(userRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          let access = docSnap.data();
          console.log("User data:", access.status);
          setuserAccess(access.status)
        } else {
          console.log("No such user!");
          return null;
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        throw error;
      });
  }

  const grabCustomers = () => {
    const requestConfig = {
      url: API_BASE_URL_Local, 
      method: 'get',  
      headers: {
        'Content-Type': 'application/json',  
      },
    };
    const requestConfigH = {
      url: API_BASE_URL_Local_Historical, 
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
        axios.request(requestConfigH)
          .then(response => {
            console.log(response.data.length)
            setCustomersH(response.data)
            setLoadingData(false)
          })
          .catch(error => {
            console.log(error.message)
          })
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
      if (customer.data.vob === "yes") {
        approved.push(customer);
        old.push(customer)
      } else if (customer.data.vob === "no") {
        rejected.push(customer);
        old.push(customer)
      } else if (customer.data.vob === "unknown") {
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

  const handleSortChange = (e) => {
    console.log('updateSortOption')
    setSortOption(e.target.value)
  }

  const searchCurrentQuery = () => {
    let newUrl = API_BASE_URL_Local 
    
  }

  const signoutUser = () => {
    signOut(auth)
      .then(() => {
          setCurrentView('login')
      })
      .catch((error) => {
          console.error("Error signing out:", error);
      });
  }

  const displayContent = () => {
    return(
      <div className="App-header">
        <div className='side-bar'>
          <div>
            <div className='header'>
              <img style={{height: '57px', width: '170px'}} src={image} alt='Intellisurance logo'/>
            </div>
            {
              console.log(currentTab)
            }
            {
              currentTab === 'old' || currentTab === 'yes' || currentTab === 'no' || currentTab === 'new'
                ? <div>
                    <div onClick={() => {setCurrentTab('old')}} className='menu-tab align-horizontally'>
                      <p>Existing Policies</p>
                      <FontAwesomeIcon icon={faChevronUp} />
                    </div>
                    <div className='sub-menu'>
                    <div onClick={() => {setCurrentTab('yes')}} className='menu-tab align-horizontally'>
                        <p className='menu-text'>Accepted Insurances</p>
                      </div>
                      <div onClick={() => {setCurrentTab('no')}} className='menu-tab'>
                        <p className='menu-text'>Rejected Insurances</p>
                      </div>
                    </div>
                    <div onClick={() => {setCurrentTab('new')}} className='menu-tab'>
                      <p className='menu-text'>Unknown Insurances</p>
                    </div>
                  </div>
                : <div onClick={() => {setCurrentTab('old')}} className='menu-tab align-horizontally'>
                    <p>Existing Policies</p>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
            }
            <div onClick={() => {setCurrentTab('billing')}} className='menu-tab'>
              <p>Billing Details</p>
            </div>
          </div>
          <div>
            <div onClick={() => {signoutUser()}} className='menu-tab align-horizontally'>
              <p style={{color: 'red'}}>Logout</p>
            </div>
            <div className='bottom-side-bar bottom-legal'>
              <p className='legal-disclaimer'>@2023-2024 Intellisurance Inc.</p>
              <p className='legal-disclaimer'>All rights reserved.</p>
            </div>
          </div>
        </div>
        <div className='content'>
          <div className='top-bar'>
            <div className='bottom-bar'>
              <div className='search-bar'>
                <input 
                  className='input'
                  type="text" 
                  placeholder="Search Prefix..." 
                  value={searchQuery} 
                  onChange={handleSearchChange} 
                />
                <button style={{borderRadius:'8px'}} onClick={() => {searchCurrentQuery()}}>Search</button>
              </div>
              <div className='sort-container'>
                <p className='sort-header'>Sort: </p>
                <select className='sort-select' value={sortOption} onChange={handleSortChange}>
                  <option value="insuranceName">Insurance Name</option>
                  <option value="insurancePrefix">Insurance Prefix</option>
                </select>
              </div>
            </div>
          </div>
          <div className='content-container'>
            {
              loadingData === true
                ? <p>Loading</p>
                : currentTab === 'old'
                    ? <TableCompnent list={oldCustomers} customersH={customersH}/>
                    : currentTab === 'yes'
                        ? <TableCompnent list={approvedCustomers} customersH={customersH}/>
                        : currentTab === 'no'
                            ? <TableCompnent list={rejectedCustomers} customersH={customersH}/>
                            : currentTab === 'new'
                                ? <TableCompnent list={unknownCustomers} customersH={customersH}/>
                                : currentTab === 'results'
                                    ? <TableCompnent list={unknownCustomers} customersH={customersH}/>
                                    : currentTab === 'billing'
                                        ? <MoreDetailTableComponent userAccess={userAccess} customersH={customersH}/>
                                        : null

            }
          </div>
        </div>
      </div>
    )
  }

  const displayLogin = () => {
    return(
      <div>
        <LoginScreen setCurrentView={setCurrentView}/>
      </div>
    )
  }

  return (
    <div className="App">
      {
        auth.currentUser === null 
          ? displayLogin()
          : displayContent()
      }
    </div>
  );
}

export default App;

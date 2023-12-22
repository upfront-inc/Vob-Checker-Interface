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
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import AdminPanel from './components/AdminPanel';
import ResultTableCompnent from './components/ResultTableComponent';

const API_BASE_URL = 'https://www.telliref.com/api/v1/interface';
const API_BASE_URL_Historical = 'https://www.telliref.com/api/v1/interface';
const API_BASE_URL_Local = 'http://localhost:3010/api/v1/interface';
const API_BASE_URL_Local_Historical = 'http://localhost:3010/api/v1/interface-historical';
const API_BASE_URL_Local_SORT = 'http://localhost:3010/api/v1/interface-sort';

function App() {
  const [customers, setCustomers] = useState([])
  const [customersH, setCustomersH] = useState([])
  const [approvedCustomers, setApprovedCustomers] = useState([])
  const [rejectedCustomers, setRejectedCustomers] = useState([])
  const [oldCustomers, setOldCustomers] = useState([])
  const [unknownCustomers, setUnknownCustomers] = useState([])
  const [currentTab, setCurrentTab] = useState('old')
  const [loadingData, setLoadingData] = useState('true')

  const [insruanceList, setInsruanceList] = useState([])
  const [billingList, setBillingList] = useState([])
  const [activeSearch, setActiveSearhc] = useState(false)

  const [selectedOption, setSelectedOption] = useState('insurancePrefix');
  const [searchQuery, setSearchQuery] = useState('');

  const [sortOption, setSortOption] = useState('insuranceName')

  const [currentView, setCurrentView] = useState('content')

  const [userAccess, setuserAccess] = useState('staff')
  const [userInfo, setUserInfo] = useState('')

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentView('content');
        grabUserInfo();
        grabInformation();
      } else {
        setCurrentView('login');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    searchQuery === ''
      ? sortCurrentQuery()
      : searchCurrentQuery()
  }, [sortOption])

  const grabUserInfo = () => {
    const userRef = doc(db, "users", auth.currentUser.uid);

    getDoc(userRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          let access = docSnap.data();
          console.log("User data:", access.status);
          if(access.type === 'suspended'){
            signoutUser()
          }
          setUserInfo(access)
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

  const grabInformation = () => {
    let queryRefInsruance;
    let queryRefBilling;
    queryRefInsruance = collection(db, 'CurrentInsurance')
    queryRefBilling = collection(db, 'BillingDetails')
    onSnapshot(queryRefInsruance, snapshot => {
        let insurances = [];
        snapshot.docs.forEach(doc => {
          insurances.push({data: doc.data(), id: doc.id});
        });
        setInsruanceList(insurances)
        sortInsurances(insurances)
    });
    onSnapshot(queryRefBilling, snapshot => {
        let billings = [];
        snapshot.docs.forEach(doc => {
            billings.push({data: doc.data(), id: doc.id});
        });
        setBillingList(billings)
    });
  }

  const sortInsurances = (insruances) => {
    let old = [];
    let approved = [];
    let rejected = [];
    let unknown = [];
  
    insruances.forEach(customer => {
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

    console.log(`aprroved length: ${approved.length}`)
    console.log(`rejected length: ${rejected.length}`)
    console.log(`unknown length: ${unknown.length}`)
    console.log(`old length: ${old.length}`)
  
    setApprovedCustomers(approved);
    setRejectedCustomers(rejected);
    setUnknownCustomers(unknown);
    setOldCustomers(old)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  }

  const handleSortChange = (e) => {
    setSortOption(e.target.value)
    sortCurrentQuery()
  }

  const sortCurrentQuery = () => {
    console.log(`sort filter: ${sortOption}`)
    setInsruanceList([])
    setBillingList([])
    let queryRefInsruance;
    let queryRefBilling;
    queryRefInsruance = query(collection(db, 'CurrentInsurance'), orderBy(sortOption));
    queryRefBilling = query(collection(db, 'BillingDetails'), orderBy(sortOption));
    onSnapshot(queryRefInsruance, snapshot => {
        let insurances = [];
        snapshot.docs.forEach(doc => {
          insurances.push({data: doc.data(), id: doc.id});
        });
        setInsruanceList(insurances)
        sortInsurances(insurances)
    });
    onSnapshot(queryRefBilling, snapshot => {
        let billings = [];
        snapshot.docs.forEach(doc => {
            billings.push({data: doc.data(), id: doc.id});
        });
        setBillingList(billings)
    });
  }

  const searchCurrentQuery = () => {
    setActiveSearhc(true)
    let queryRefInsruance;
    let queryRefBilling;
    queryRefInsruance = query(collection(db, 'CurrentInsurance'), where('insurancePrefix', '==', searchQuery.toUpperCase()),orderBy(sortOption));
    queryRefBilling = query(collection(db, 'BillingDetails'), where('insurancePrefix', '==', searchQuery.toUpperCase()),orderBy(sortOption));
    onSnapshot(queryRefInsruance, snapshot => {
        let insurances = [];
        snapshot.docs.forEach(doc => {
          insurances.push({data: doc.data(), id: doc.id});
        });
        setInsruanceList(insurances)
        setCurrentTab('results')
    });
    onSnapshot(queryRefBilling, snapshot => {
        let billings = [];
        snapshot.docs.forEach(doc => {
            billings.push({data: doc.data(), id: doc.id});
        });
        setBillingList(billings)
    });
  }

  const clearSearch = () => {
    grabInformation()
    setActiveSearhc(false)
    setSearchQuery('')
    setCurrentTab('old')
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
            {
              userAccess === 'admin'
                ? <div onClick={() => {setCurrentTab('admin')}} className='menu-tab align-horizontally'>
                    <p>Admin Panel</p>
                  </div>
                : userAccess === 'owner'
                    ? <div onClick={() => {setCurrentTab('admin')}} className='menu-tab align-horizontally'>
                        <p>Admin Panel</p>
                      </div>
                    : null
            }
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
                <button style={{borderRadius:'8px', marginLeft: '16px'}} onClick={() => {searchCurrentQuery()}}>Search</button>
                {
                  activeSearch === true 
                    ? <div onClick={() => {clearSearch()}} style={{marginLeft: '16px', color: 'blue'}}>Clear Search</div>
                    : null 
                }
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
                    ? <TableCompnent list={oldCustomers}/>
                    : currentTab === 'yes'
                        ? <TableCompnent list={approvedCustomers}/>
                        : currentTab === 'no'
                            ? <TableCompnent list={rejectedCustomers}/>
                            : currentTab === 'new'
                                ? <TableCompnent list={unknownCustomers}/>
                                : currentTab === 'results'
                                    ? <ResultTableCompnent list={insruanceList} customersH={billingList}/>
                                    : currentTab === 'billing'
                                        ? <MoreDetailTableComponent userAccess={userAccess} billingList={billingList}/>
                                        : currentTab === 'admin' && (userAccess === 'admin' || userAccess === 'owner')
                                            ? <AdminPanel userInfo={userInfo}/>
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

// transfer ownership option

import './App.css';
import React, { useEffect, useState } from 'react';
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
import SupportPanel from './components/SupportPanel';

function App() {
  const [approvedCustomers, setApprovedCustomers] = useState([])
  const [rejectedCustomers, setRejectedCustomers] = useState([])
  const [existingCustomers, setexistingCustomers] = useState([])
  const [unknownCustomers, setUnknownCustomers] = useState([])
  const [currentTab, setCurrentTab] = useState('existing')
  const [loadingData, setLoadingData] = useState('true')

  const [insruanceList, setInsruanceList] = useState([])
  const [billingList, setBillingList] = useState([])
  const [activeSearch, setActiveSearhc] = useState(false)

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
          if(access.type === 'suspended'){
            signoutUser()
          }
          setUserInfo(access)
          setuserAccess(access.status)
        } else {
          console.error("No such user!");
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
    });
    onSnapshot(queryRefBilling, snapshot => {
        let billings = [];
        snapshot.docs.forEach(doc => {
            billings.push({data: doc.data(), id: doc.id});
        });
        setBillingList(billings)
    });
  }

  // const sortInsurances = (insruances) => {
  //   let existing = [];
  //   let approved = [];
  //   let rejected = [];
  //   let unknown = [];
  
  //   insruances.forEach(customer => {
  //     if (customer.data.vob === "yes") {
  //       approved.push(customer);
  //       existing.push(customer)
  //     } else if (customer.data.vob === "no") {
  //       rejected.push(customer);
  //       existing.push(customer)
  //     } else if (customer.data.vob === "unknown") {
  //       unknown.push(customer);
  //     }
  //   });
  
  //   setApprovedCustomers(approved);
  //   setRejectedCustomers(rejected);
  //   setUnknownCustomers(unknown);
  //   setexistingCustomers(existing)
  // }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  }

  const handleSortChange = (e) => {
    setSortOption(e.target.value)
    sortCurrentQuery()
  }

  const sortCurrentQuery = () => {
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
    setCurrentTab('existing')
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
            {/* {
              currentTab === 'existing' || currentTab === 'yes' || currentTab === 'no' || currentTab === 'new'
                ? <div>
                    <div onClick={() => {setCurrentTab('existing')}} className='menu-tab align-horizontally'>
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
                : <div onClick={() => {setCurrentTab('existing')}} className='menu-tab align-horizontally'>
                    <p>Existing Policies</p>
                  </div>
            } */}
            <div onClick={() => {setCurrentTab('existing')}} className='menu-tab align-horizontally'>
              <p>Existing Policies</p>
            </div>
            <div onClick={() => {setCurrentTab('billing')}} className='menu-tab'>
              <p>Billing Details</p>
            </div>
          </div>
          <div>
            {
              userAccess === 'Dev'
                ? <div onClick={() => {setCurrentTab('support')}} className='menu-tab align-horizontally'>
                    <p>Dev Support</p>
                  </div>
                : null
            }
            {
              userAccess === 'admin'
                ? <div onClick={() => {setCurrentTab('admin')}} className='menu-tab align-horizontally'>
                    <p>Admin Panel</p>
                  </div>
                : userAccess === 'owner'
                    ? <div onClick={() => {setCurrentTab('admin')}} className='menu-tab align-horizontally'>
                        <p>Admin Panel</p>
                      </div>
                    : userAccess === 'Dev'
                        ? <div onClick={() => {setCurrentTab('admin')}} className='menu-tab align-horizontally'>
                            <p>Admin Panel</p>
                          </div>
                        : null
            }
            <div onClick={() => {setCurrentTab('support')}} className='menu-tab align-horizontally'>
              <p>Support</p>
            </div>
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
          {
            currentTab === 'admin'
              ? null 
              : currentTab === 'support'
                  ? null 
                  : <div className='top-bar'>
                      <div className='bottom-bar'>
                        <div className='search-bar'>
                          <input 
                            className='input'
                            type="text" 
                            placehexistinger="Search Prefix..." 
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
          }
          <div className='content-container'>
            {
              console.log(currentTab)
            }
            {
              loadingData === true
                ? <p>Loading</p>
                : currentTab === 'existing'
                    ? <TableCompnent list={insruanceList}/>
                    : currentTab === 'results'
                        ? <ResultTableCompnent list={insruanceList} customersH={billingList}/>
                        : currentTab === 'billing'
                            ? <MoreDetailTableComponent userAccess={userAccess} billingList={billingList}/>
                            : currentTab === 'support'
                                ? <SupportPanel />
                                : currentTab === 'admin' && (userAccess === 'admin' || userAccess === 'owner' || userAccess === 'Dev')
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

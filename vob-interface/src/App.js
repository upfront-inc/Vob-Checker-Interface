// transfer ownership option

import './App.css';
import React, { useEffect, useState } from 'react';
import image from './assets/IntellasuranceLogo_2.png'
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
import DevSupportComponent from './components/DevSupportComponent';

function App() {
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

  const [showTab, setShowTab] = useState('full')
  const [affinityRecords, setAffinityRecords] = useState([])
  const [beachsideRecords, setBeachsideRecords] = useState([])
  const [axisRecords, setAxisRecords] = useState([])

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
  };

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
    let affinity = []
    let beachside = []
    let axis = []
    let queryRefInsruance;
    let queryRefBilling;
    queryRefInsruance = collection(db, 'CurrentInsurance')
    queryRefBilling = collection(db, 'BillingDetailsPrefixVOB')
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
          let docData = doc.data()
          billings.push({data: doc.data(), id: doc.id});
          if(docData.facility === 'AFFINITY'){
            affinity.push({data: doc.data(), id: doc.id})
          } else if(docData.facility === 'BEACHSIDE'){
            beachside.push({data: doc.data(), id: doc.id})
          } else if(docData.facility === 'AXIS'){
            axis.push({data: doc.data(), id: doc.id})
          } else {
            console.log('facility not found')
          }
        });
        console.log('axis length', axis.length)
        console.log('beachside length', beachside.length)
        console.log('affinity length', affinity.length)
        console.log('affinity length', billings.length)
        setAffinityRecords(affinity)
        setBeachsideRecords(beachside)
        setAxisRecords(axis)
        setBillingList(billings)
    });
  }

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
    queryRefBilling = query(collection(db, 'BillingDetailsPrefix2'), orderBy(sortOption));
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
    queryRefBilling = query(collection(db, 'BillingDetailsPrefix2'), where('prefix', '==', searchQuery.toUpperCase()),orderBy(sortOption));
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

  const displayContent = () => {
    return(
      <div className="App-header">
        <div className='side-bar'>
          <div>
            <div className='header'>
              <img style={{height: '46px', width: '190px'}} src={image} alt='Intellisurance logo'/>
            </div>
            <div onClick={() => {setCurrentTab('existing')}} className='menu-tab align-horizontally'>
              {
                currentTab === 'existing'
                  ? <p style={{color: 'blue'}}>Existing Policies</p>
                  : <p>Existing Policies</p>
              }
            </div>
            <div onClick={() => {setCurrentTab('billing')}} className='menu-tab'>
              {
                currentTab === 'billing'
                  ? <p style={{color: 'blue'}}>Billing Details</p>
                  : <p>Billing Details</p>
              }
            </div>
          </div>
          <div>
            {
              userAccess === 'Dev' 
                ? <div onClick={() => {setCurrentTab('dev-tools')}} className='menu-tab align-horizontally'>
                    {
                      currentTab === 'dev-support'
                        ? <p style={{color: 'blue'}}>Dev Tools</p>
                        : <p>Dev Tools</p>
                    }
                  </div>
                : null
            }
            {
              userAccess === 'Dev' || userAccess === 'admin' || userAccess === 'owner'
                ? <div onClick={() => {setCurrentTab('dev-support')}} className='menu-tab align-horizontally'>
                    {
                      currentTab === 'dev-support'
                        ? <p style={{color: 'blue'}}>Support Tickets</p>
                        : <p>Support Tickets</p>
                    }
                  </div>
                : null
            }
            {
              userAccess === 'admin'
                ? <div onClick={() => {setCurrentTab('admin')}} className='menu-tab align-horizontally'>
                    {
                      currentTab === 'admin'
                        ? <p style={{color: 'blue'}}>Admin Panel</p>
                        : <p>Admin Panel</p>
                    }
                  </div>
                : userAccess === 'owner'
                    ? <div onClick={() => {setCurrentTab('admin')}} className='menu-tab align-horizontally'>
                        {
                          currentTab === 'admin'
                            ? <p style={{color: 'blue'}}>Admin Panel</p>
                            : <p>Admin Panel</p>
                        }
                      </div>
                    : userAccess === 'Dev'
                        ? <div onClick={() => {setCurrentTab('admin')}} className='menu-tab align-horizontally'>
                            {
                              currentTab === 'admin'
                                ? <p style={{color: 'blue'}}>Admin Panel</p>
                                : <p>Admin Panel</p>
                            }
                          </div>
                        : null
            }
            <div onClick={() => {setCurrentTab('support')}} className='menu-tab align-horizontally'>
              {
                currentTab === 'support'
                  ? <p style={{color: 'blue'}}>Support</p>
                  : <p>Support</p>
              }
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
                  : currentTab === 'billing'
                      ? <div className='top-bar'>
                          <div className='bottom-bar'>
                            <div className='facility-tab'>
                              <p className='facility-header'>Facility:</p>
                              <p onClick={() => {setShowTab('affinity')}} className='facility-text'>Affinity</p>
                              <p onClick={() => {setShowTab('beachside')}} className='facility-text'>Beachside</p>
                              <p onClick={() => {setShowTab('axis')}} className='facility-text'>Axis</p>
                              <p onClick={() => {setShowTab('full')}} className='facility-text'>All</p>
                            </div>
                            <div className='bottom-bar-side'>
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
                              <button style={{borderRadius:'8px', padding: '4px', paddingLeft: '8px', paddingRight: '8px'}} onClick={() => {toggleDropdown()}}>Filter Options</button>
                              {
                                !isDropdownOpen
                                  ? null
                                  : <div style={{
                                        position: 'absolute',
                                        width: '190px',
                                        top: 75, 
                                        right: 22,
                                        zIndex: 1000, 
                                        backgroundColor: 'white',
                                        borderRadius: '8px',
                                        paddingTop: '16px',
                                        paddingBottom: '16px',
                                        border: '2px solid grey',
                                    }}>
                                        <div style={{marginRight: '10px'}}>
                                            <input type="checkbox" id="prefix" name="prefix" onChange={handleShowPrefix} checked={showPrefix}/>
                                            <label style={{fontSize: '12px'}} htmlFor="prefix">PREFIX</label> 
                                        </div>
                                        <div style={{marginRight: '10px'}}>
                                            <input type="checkbox" id="insurance" name="insurance" onChange={handleShowInsurance} checked={showInsurance}/>
                                            <label style={{fontSize: '12px'}} htmlFor="prefix">INSURANCE</label> 
                                        </div>
                                        <div style={{marginRight: '10px'}}>
                                            <input type="checkbox" id="network" name="network" onChange={handleShowNetwork} checked={showNetwork}/>
                                            <label style={{fontSize: '12px'}} htmlFor="prefix">NETWORK</label> 
                                        </div>
                                        <div style={{marginRight: '10px'}}>
                                            <input type="checkbox" id="resDays" name="resDays" onChange={handleShowResDays} checked={showResDays}/>
                                            <label style={{fontSize: '12px'}} htmlFor="prefix">RES. DAYS</label> 
                                        </div>
                                        <div style={{marginRight: '10px'}}>
                                            <input type="checkbox" id="resVisits" name="resVisits" onChange={handleShowResVisits} checked={showResVisits}/>
                                            <label style={{fontSize: '12px'}} htmlFor="prefix">RES VISITS</label> 
                                        </div>
                                        <div style={{marginRight: '10px'}}>
                                            <input type="checkbox" id="detoxDays" name="detoxDays" onChange={handleShowDetoxDays} checked={showDetoxDays}/>
                                            <label style={{fontSize: '12px'}} htmlFor="prefix">DETOX DAYS</label> 
                                        </div>
                                        <div style={{marginRight: '10px'}}>
                                            <input type="checkbox" id="detoxVisits" name="detoxVisits" onChange={handleShowDetoxVisits} checked={showDetoxVisits}/>
                                            <label style={{fontSize: '12px'}} htmlFor="prefix">DETOX VISITS</label> 
                                        </div>
                                        <div style={{marginRight: '10px'}}>
                                            <input type="checkbox" id="facility" name="facility" onChange={handleShowFacility} checked={showFacility}/>
                                            <label style={{fontSize: '12px'}} htmlFor="prefix">FACILITY</label> 
                                        </div>
                                        {
                                          userAccess === 'staff' || userAccess === 'owner' || userAccess === 'dev'
                                          ? null
                                          : <div style={{marginRight: '10px'}}>
                                                <input type="checkbox" id="totalCharges" name="totalCharges" onChange={handleShowTotalCharge} checked={showTotalCharge}/>
                                                <label style={{fontSize: '12px'}} htmlFor="prefix">TOTAL CHARGES</label> 
                                            </div>
                                        }
                                        {
                                          userAccess === 'staff' || userAccess === 'owner' || userAccess === 'dev'
                                            ? null
                                            : <div style={{marginRight: '10px'}}>
                                                <input type="checkbox" id="totalPaid" name="totalPaid" onChange={handleShowTotalPaid} checked={showTotalPaid}/>
                                                <label style={{fontSize: '12px'}} htmlFor="prefix">TOTAL PAID</label> 
                                              </div>
                                        }
                                        <div style={{marginRight: '10px'}}>
                                            <input type="checkbox" id="payout" name="payout" onChange={handleShowPayout} checked={showPayout}/>
                                            <label style={{fontSize: '12px'}} htmlFor="prefix">PAYOUT RATIO</label> 
                                        </div>
                                        <div style={{marginRight: '10px'}}>
                                            <input type="checkbox" id="decision" name="decision" onChange={handleShowVobDecision} checked={showVobPercent}/>
                                            <label style={{fontSize: '12px'}} htmlFor="prefix">ADMIT</label> 
                                        </div>
                                        <div style={{marginRight: '10px'}}>
                                            <input type="checkbox" id="vobPercent" name="vobPercent" onChange={handleShowVobPercent} checked={showVobPercent}/>
                                            <label style={{fontSize: '12px'}} htmlFor="prefix">ADMIT %</label> 
                                        </div>
                                    </div>
                              }
                            </div>
                          </div>
                        </div>
                      : <div className='top-bar'>
                          <div className='bottom-bar'>
                            <div>
                              Filter
                            </div>
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
              loadingData === true
                ? <p>Loading</p>
                : currentTab === 'existing'
                    ? <TableCompnent list={insruanceList}/>
                    : currentTab === 'results'
                        ? <ResultTableCompnent list={insruanceList} userAccess={userAccess} customersH={billingList}/>
                        : currentTab === 'billing'
                            ? <MoreDetailTableComponent 
                                userAccess={userAccess}
                                showTab={showTab} 
                                billingList={billingList} 
                                affinityRecords={affinityRecords}
                                beachsideRecords={beachsideRecords}
                                axisRecords={axisRecords}
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
                                showVobPercent={showVobPercent}/>
                            : currentTab === 'dev-support'
                                ? <DevSupportComponent />
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

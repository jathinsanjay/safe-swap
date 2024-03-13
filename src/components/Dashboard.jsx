import React, { useEffect, useState } from 'react';
import GoodsContractAbi from '../contracts/GoodsContract.json';
import Web3 from 'web3';
import Cookies from 'js-cookie';
import './Dashboard.css'

const Dashboard = () => {

  const username = Cookies.get('username');
  const time = Cookies.get("time");
  const [purchaseCount, setPurchaseCount] = useState();
  const pc = async() => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const userAddress = "0x9CB7a24C844afd220f05EB1359691E6A4DB80e3a";
    const contract = new web3.eth.Contract(GoodsContractAbi.abi,userAddress);
    let purchaseCount = await contract.methods.purchaseCounter(username).call();
    setPurchaseCount(purchaseCount);
  }

  useEffect(() => {
    pc();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  
   
  return (
    <div className='main'>
    <div className='dashboard'>


        <div className="home-container">
     
      <div className="content">
        <h1 className="title">Transforming digital trade, Ensuring Unparalleled Security.</h1>
        <p className="description">
          Welcome to SecureTrade, Where trust meets technology. Our platform revolutionalizes online commerce by harnessing the power of blockchain security. Say goodbye to worries about stolen goods and fraudulent activities. With secure trade you can shop and sell with confidence here...
        </p>
        <div className="cta-buttons">
          <button className="sell-button">Check Status</button>
          <button className="buy-button">Upload Asset</button>
        </div>
      </div>
      

      
        
     

    
        </div>


      
    </div>

        <div id='dashfull'>
        <div className='userdiv'>
        <h1 className='det'>User Id </h1>
        <p>{username}</p>
        </div>
        <div className='userdiv'>
        <h1 className='det'>Purchases </h1>
        <p>{purchaseCount}</p>
        </div>
        <div className='userdiv'>
        <h2 className='det'>Logged In Time </h2>
        <p>{time}</p>
        </div>
        </div>
      
      </div>
    
  )
}

export default Dashboard;

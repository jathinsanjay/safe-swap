import React, { useEffect, useState } from 'react';
import SellerContractGoods from '../contracts/SellerContractGoods.json';
import Web3 from 'web3';
import './Dashboard.css'

const SellerDash = () => {
  const [counter,setCounter] = useState(1);
  const items = async() => {
    //e.preventDefault();
    try{
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        const abi = SellerContractGoods.abi;
        const contract = new web3.eth.Contract(abi,"0x93140112610128D738b264E1a913CC2142548BfB");
        const acc = await web3.eth.getAccounts();
        console.log(acc);
        const result=await contract.methods.counter().call({ from: acc[0] });
        setCounter(result)
        
       
    }catch(err){
      console.log(err);
    }
  }
  useEffect(() => {
    items();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <div className="main">

    
    <div className='dashboard'>


<div className="home-container">
     
     <div className="content">
       <h1 className="title">Transforming digital trade, Ensuring Unparalleled Security.</h1>
       <p className="description">
         Welcome to SecureTrade, Where trust meets technology. Our platform revolutionalizes online commerce by harnessing the power of blockchain security. Say goodbye to worries about stolen goods and fraudulent activities. With secure trade you can shop and sell with confidence here...
       </p>
       <div className="cta-buttons">
         <button className="sell-button">Sell</button>
         <button className="buy-button">Track a Purchase</button>
       </div>
     </div>


   

    </div>

    
   
    </div>

    <div id='dashfull'>
        <div className='userdiv'>
        <h1 className='det'>Number of Items Sold: </h1>
        <p>{counter}</p>
        </div>
      </div>

    </div>
  )
}

export default SellerDash

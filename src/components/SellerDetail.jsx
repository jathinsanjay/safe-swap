import React, { useState } from 'react';
import SellerContractGoods from '../contracts/SellerContractGoods.json';
import Web3 from 'web3';
import './soldUser.css';
import './Dashboard.css'

const SellerDetail = () => {
  const [query,setQuery] = useState('');
  const [display,setDisplay] = useState('');
  const getDisplayPurchases = async(e) => {
     e.preventDefault();
     try{
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        const abi = SellerContractGoods.abi;
        const contract = new web3.eth.Contract(abi,"0x93140112610128D738b264E1a913CC2142548BfB");
        await contract.methods.getProduct(query).call().then(result => {
         setDisplay(result);
         console.log(result)
        })

     }catch(err){
      console.log(err);
     }
  }
  return (
    <div className='detail-container2'>
    <div className='' id='topdiv'>
            <form>
            <label>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
            <button type="submit"  id="search-button" onClick={getDisplayPurchases}>Search</button>
            </form>
            <div id='purchases'>
            <div id='purchase'>
            
              <p className='detail'>Seller Name :{display.sellerName} </p>
              <p className='detail'>Purchaser Name:<span className='spantext'>{display.purchaserName}</span></p>
              <p className='detail'>Date: <span className='spantext'>{display.date}</span></p>
              <p className='detail'>Price: <span className='spantext'>{display.price}</span></p>
              <p className='detail'>Buyer Purchase Id : <span className='spantext'>{display.friendPurchaseId}</span></p>
            
            </div>
            </div>
       </div>
       </div>
  )
}

export default SellerDetail

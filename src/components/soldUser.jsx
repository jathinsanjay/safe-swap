import React, { useState } from 'react'
import './soldUser.css';
import UserSold from '../contracts/UserSold.json';
import Web3 from 'web3';
import SellerContractGoods from '../contracts/SellerContractGoods.json';
import GoodsContractAbi from '../contracts/GoodsContract.json';
const SoldUser = () => {
    const [email,setEmail] = useState('');
    const [from,setFrom] = useState('');
    const [to,setTo] = useState('');
    const [date,setDate] = useState('');
    const [price,setPrice] = useState();
    const [id, setId] = useState('');

    const handle = async(e) => {
        e.preventDefault();
        console.log(email);
        try{
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const abi = UserSold.abi;
    const contract = new web3.eth.Contract(abi,'0x020ca760915Ec44C5BAb23A85189c04043f28880'); 
    // const arr = [];
    const acc = await web3.eth.getAccounts();
    let newProductId;
    await contract.methods.makePurchase(from,to,date,price,id).send({from:acc[0]})
    .on('receipt', function(receipt) {
      console.log('Receipt:', receipt);
      const events = receipt.events;
      const productId = events.PurchaseMade.returnValues.productId;
      newProductId = events.PurchaseMade.returnValues.newProductId;
      console.log('Return Values:', productId, newProductId);
  });
    // await contract.methods.makePurchase(from,to,date,price,id).call().then(result => {
    //   console.log(result);
    //   for(let i=0;i<2;i++){
    //     arr.push(result);
    //   }
    // });
  //  console.log(arr[0][1]);
    // const b = arr[0][1];
    const abii = SellerContractGoods.abi;
   const contracts = new web3.eth.Contract(abii,"0x93140112610128D738b264E1a913CC2142548BfB");
  
    await contracts.methods.addFriendPurchase(id, newProductId)
    .send({ from:acc[0] , gas: 1000000 }) 
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });
    const s = await contracts.methods.verify(newProductId).call();
    console.log(s);
    const userAddress = "0x9CB7a24C844afd220f05EB1359691E6A4DB80e3a";
    const contractss = new web3.eth.Contract(GoodsContractAbi.abi, userAddress);
    await contractss.methods.updatePurchaseSold(id,from).send({from:acc[0]});
    // console.log(b);
    const sub = "Your_Purchase_ID";
    const message = `Hello ${to}, your purchase id is ${newProductId}, price of your product is ${price} (!!WARNING: DONT SHARE IT WITH ANYONE) `;
    const mailtoLink = `mailto:${email}?subject=${sub}&body=${message}`;
    window.location.href = mailtoLink;
    const g = await contracts.methods.getProduct(id).call();
    console.log(g);
    console.log(g.purchaserName);
        }catch(err){
            console.log(err);
        }
    }

    


  return (
    <div className='upload-sudheer'>

<div className='bg-upload'>

    <div id="box2">
      <form id="form" className='cont'>
                <h2 id='h1'>Enter Consumer Product Details :</h2>
                
                <div className='inp'>
                <label id='label'>Id :</label>
                <input type='text' id='sellerSeller' name='user_name' onChange={(e) => setId(e.target.value)} required autocomplete="off"></input>
                </div>

                <div className='inp'>
                <label id='label'>From :</label>
                <input type='text' id='sellerSeller' name='user_name' onChange={(e) => setFrom(e.target.value)} required autocomplete="off"></input>
                </div>

                <div className='inp'>
                <label id='label'>To :</label>
                <input type='text' id='sellerPurchaser' onChange={(e) => setTo(e.target.value)} required autocomplete="off"></input>
                </div>

                <div className='inp'>
                <label id='label'>Date :</label>
                <input type='date' id='id'  onChange={(e) => setDate(e.target.value)} ></input>
                </div>

                <div className='inp'>
                <label id='label'>Price :</label>
                <input type='number' min={0} id='sellerprice' name='message' onChange={(e) => setPrice(e.target.value)} required autocomplete="off"></input>
                </div>

                <div className='inp'>
                <label id='label'>Email :</label>
                <input type="email"  name='user_email' onChange={(e) => setEmail(e.target.value)} required autocomplete="off"></input>
                </div>

                <div className='button-div'>
                <button type='submit' id='send' onClick={handle} >Send</button>
                </div>

                </form>
         </div>
         </div>
         </div>
  )
}

export default SoldUser

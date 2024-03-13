import React,{useState,useEffect} from 'react'
import UserSold from '../contracts/UserSold.json';
import Web3 from 'web3';
import SellerContractGoods from '../contracts/SellerContractGoods.json';
import './Track.css';
const Track = () => {

  const [purchaseIds, setPurchaseIds] = useState([]);
  const [newProductIds,setNewProductIds] = useState([]);
  const [purchaseBlocklist, setPurchaseBlocklist] = useState([]);
  const [newProductBlocklist, setNewProductBlocklist] = useState([]);

  const detail = async(e) => {
    e?.preventDefault();
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const abi = UserSold.abi;
    const contract = new web3.eth.Contract(abi,'0x0635605d7cd6d565Ab8088cC15e45A927c139d3E'); 
    const a =  await contract.methods.getAllPurchaseIds().call();
    const [productIdList, newProductIdList] = [a[0],a[1]]
    console.log(a[0]);
     setPurchaseIds(productIdList);
    setNewProductIds(newProductIdList);
    console.log(purchaseIds);


    const abii = SellerContractGoods.abi;
    const contracts = new web3.eth.Contract(abii,"0x93140112610128D738b264E1a913CC2142548BfB");

    const purchaseBlocklist = await Promise.all(
      productIdList.map(async (id) => {
        const isBlocked = await contracts.methods.blocklist(id).call();
        return isBlocked;
      })
    );
    setPurchaseBlocklist(purchaseBlocklist);

    const newProductBlocklist = await Promise.all(
      newProductIdList.map(async (id) => {
        const isBlocked = await contracts.methods.blocklist(id).call();
        return isBlocked;
      })
    );
    setNewProductBlocklist(newProductBlocklist);
    
  };
  
useEffect(() => {
detail();
// eslint-disable-next-line react-hooks/exhaustive-deps
},[])
  return (
    <div id='side' className="flex">
    <table className="custom-table">
      <thead>
        <tr>
          <th>From</th>
          <th>To</th>
        </tr>
      </thead>
      <tbody>
        {purchaseIds.map((id, index) => (
          <tr key={id}>
            <td>
              {id} ({purchaseBlocklist[index] ? 'blocked' : 'unblocked'})
            </td>
            <td>
              {newProductIds[index]} ({newProductBlocklist[index] ? 'blocked' : 'unblocked'})
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default Track

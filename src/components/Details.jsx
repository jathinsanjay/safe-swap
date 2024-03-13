import React, { useState, useEffect } from 'react';
import './Detail.css';
import Web3 from 'web3';
import GoodsContractAbi from '../contracts/GoodsContract.json';
import Cookies from 'js-cookie';
import { Pagination } from 'semantic-ui-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

//import SellerContractGoods from '../contracts/SellerContractGoods.json';

const Details = () => {

  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [yourId, setId] = useState();
  const [query, setQuery] = useState("");
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const username = Cookies.get('username');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handlePageChange = (event, { activePage }) => {
    setCurrentPage(activePage);
  };

  // const handleShareButtonClick = async () => {
  //   if (navigator.share) {
  //     try {
  //       await navigator.share({
  //         title: "hey",
  //         text: `I found this product and you might be interested!`,
  //         url: `http://localhost:8080`,
  //         yourId:yourId
  //       });
  //       console.log('Shared successfully');
  //     } catch (error) {
  //       console.error('Error sharing:', error);
  //     }
  //   } else {
  //     console.log('Web Share API not supported');
  //   }
  // };


  const fetchPurchases = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const userAddress = "0x9CB7a24C844afd220f05EB1359691E6A4DB80e3a";
    const contract = new web3.eth.Contract(GoodsContractAbi.abi, userAddress);
    let purchaseCount = await contract.methods.purchaseCounter(username).call();
    setId(purchaseCount);
    const fetchedPurchases = [];
    for (let i = 1; i <= purchaseCount; i++) {
      const purchase = await contract.methods.getPurchaseById(username, i).call();
      fetchedPurchases.push(purchase);
      console.log(purchase);
    }
    setPurchaseDetails(fetchedPurchases);
    //console.log(purchase.sold);
  };

  useEffect(() => {
    fetchPurchases();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(yourId);
  const handleSearch = (event) => {
    event.preventDefault();
    const searchQuery = query.toLowerCase();
    const filteredPurchases = purchaseDetails.filter(
      (purchase) =>
        purchase.uniqueId.toLocaleLowerCase().includes(searchQuery) ||
        purchase.purchaseId.toLocaleLowerCase().includes(searchQuery) ||
        purchase.sellerName.toLowerCase().includes(searchQuery) ||
        purchase.purchaserName.toLowerCase().includes(searchQuery) ||
        purchase.date.toLowerCase().includes(searchQuery) ||
        purchase.price.toLowerCase().includes(searchQuery)
    );
    setFilteredPurchases(filteredPurchases);
   
  };

  const generatePDF = () => {
    const doc = new jsPDF("p","mm",[297,210]);

    doc.autoTable({
      head: [['Id', 'Price', 'Date', 'SellerName','soldOut']],
      body: purchaseDetails.map(purchase => [purchase.uniqueId, purchase.price, purchase.date, purchase.sellerName,purchase.sold.toString()])
    });
  
    doc.save('purchases.pdf');
  };
  

  const getDisplayPurchases = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    console.log(purchaseDetails);
    const currentPurchases = filteredPurchases.length > 0 ? filteredPurchases : purchaseDetails;
 
    return currentPurchases.slice(startIndex, endIndex).map((purchase, index) => (
      <div id='detaildiv'>
      <div id='flexdiv' key={index}>
        <div>
          <img  src={`https://gateway.pinata.cloud/ipfs/${purchase.image1Hash}`} className='productimage' alt=''></img>
          <hr/>
          <p>Order No: <span className='spantext'>{purchase.purchaseId}</span></p>
          {/* <hr /> */}
          <p id='more'>Purchase Id:  <span className='spantext'>{purchase.uniqueId}</span></p>
          {/* <hr /> */}
         <div className='people'>
          <p>Seller Name:  <span className='spantext'>{purchase.sellerName}</span></p>
          {/* <hr /> */}
          <p>Purchaser Name:  <span className='spantext'>{purchase.purchaserName}</span></p>
          {/* <hr /> */}
          </div>
          
          <div className='people'>
          <p>Price:  <span className='spantext'>{purchase.price}</span></p>
          {/* <hr /> */}
          <p>Date:  <span className='spantext'>{purchase.date}</span></p>
          {/* <hr /> */}
          <p>Sold :  <span className='spantext'>{purchase.sold.toString()}</span></p>
          </div>

          <a id='anchor' href={`https://gateway.pinata.cloud/ipfs/${purchase.image2Hash}`} target='_blank' rel="noopener noreferrer">Image2</a>
          <a id='anchor' href={`https://gateway.pinata.cloud/ipfs/${purchase.image3Hash}`} target='_blank' rel="noopener noreferrer">Image3</a>
          <a id='anchor' href={`https://gateway.pinata.cloud/ipfs/${purchase.image4Hash}`} target='_blank' rel="noopener noreferrer">Image3</a>   
          </div>
          </div> </div>  ));
          };
 return (
  <div className='detail-parent'>

  
<div className='detail-container' id='topdiv'>
            <form onSubmit={handleSearch}>
            <label>
            <input type="text" placeholder='Search for an asset' value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
            
            <button type="submit" className='buy-button'>Search</button>
            <button id='download' className='sell-button' onClick={generatePDF}>Download</button>
           
            </form>
            <div id='purchases2'>
            {getDisplayPurchases()}
            </div>
            {/* <Pagination
                 onPageChange={handlePageChange}
                 defaultActivePage={currentPage}
                 className='page'
                 totalPages={Math.ceil(filteredPurchases.length > 0 ? filteredPurchases.length / itemsPerPage : purchaseDetails.length / itemsPerPage)}
            /> */}
            {/* <button onClick={handleShareButtonClick} /> */}
            </div>

            </div>
 );
 };
 
 export default Details;
 
            
            
            
            
            
       
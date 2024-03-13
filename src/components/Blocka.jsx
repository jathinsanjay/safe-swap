import React, { useState } from 'react';
import Web3 from 'web3';
import SellerContractGoods from '../contracts/SellerContractGoods.json';
import './Blocka.css';

const Blocka = () => {
    const [input, setInput] = useState('');

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const blocked = async (e) => {
        e.preventDefault();
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        const abi = SellerContractGoods.abi;
        const contract = new web3.eth.Contract(abi,"0x93140112610128D738b264E1a913CC2142548BfB");
        console.log(input);
        const acc = await web3.eth.getAccounts();
        
        await contract.methods.blockProduct(input)
            .send({ from: acc[0]}) // replace with your own account address
        
    };

    const unblock = async (e) => {
        e.preventDefault();
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        const abi = SellerContractGoods.abi;
        const contract = new web3.eth.Contract(abi,"0x93140112610128D738b264E1a913CC2142548BfB");
        const acc = await web3.eth.getAccounts();
        await contract.methods.unblockProduct(input)
            .send({ from: acc[0], gas: 1000000 }) // replace with your own account address
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.error(error);
            });
        
    };

    return (
        <div className='status-bg'>

            <div>
            <label className='title'>Block / UnBlock :</label>
            <input type='text' id='blockid' value={input} onChange={handleInputChange}></input>
            <div id='blockbtn'>
                <button id='btn2' className='blk1' onClick={blocked}>Block</button>
                <button id='btn2' className='blk2' onClick={unblock}>UnBlock</button>
            </div>
        </div>
    
        </div>
    )
}

export default Blocka;

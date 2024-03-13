import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import AuthContract from '../contracts/Auth.json';
import './Login.css'
import Navbar from './navele';
import SellerContract from '../contracts/Seller.json';
//import Upload from './Upload';
//import { selectUser } from '../features/userSlice';
//import {useSelector} from 'react-redux';
import Cookies from 'js-cookie';
import Seller from './Seller';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TailSpin } from 'react-loader-spinner';
import { login } from '../features/userSlice';
import { useDispatch } from 'react-redux';



const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [privateNumber, setPrivateNumber] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hashedPassword,setHashedPassword] = useState('');
  const [hashedPrivateNumber,setHashedPrivateNumber] = useState('');
  const [sellers,setSellers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const loggedInStatus = Cookies.get("username");
    if (loggedInStatus) {
      setLoggedIn(true);
    }
  }, []);

  const dispatch = useDispatch();
  dispatch(login({
    username:username
  }));
  
  console.log(username);
  console.log(hashedPassword,hashedPrivateNumber);
const handleLogin = async (e) => {
    try {
      e.preventDefault();
    
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const abi = AuthContract.abi;
    const contract = new web3.eth.Contract(abi,'0xFc18426b71EDa3dC001dcc36ADC9C67bC6f38747');  
    const hashedPass = web3.utils.keccak256(password);
    const hashedPrivateNum = web3.utils.keccak256(privateNumber);
    const result = await contract.methods.login(username, hashedPass,hashedPrivateNum ).call();
    const loginTime = new Date().toLocaleTimeString();
      if ( result ) {
        Cookies.set("username", username,{ expires: 1 });
        Cookies.set("time",loginTime);
        setLoggedIn(true);
      } else {
        setErrorMessage('Invalid credentials');
      
      }
    } catch (error) {
      setErrorMessage("Invalid Credentials");
      console.log("Invalid Credentials");
      
    }
  };

  const handleRegister = async (e) => {
    setIsLoading(true);
    try {
      e.preventDefault();
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const abi = AuthContract.abi;
    const contract = new web3.eth.Contract(abi,'0xFc18426b71EDa3dC001dcc36ADC9C67bC6f38747');  

      const hashedPassword = web3.utils.keccak256(password);
      const hashedPrivateNumber = web3.utils.keccak256(privateNumber);
      const acc = await web3.eth.getAccounts();
      setHashedPassword(hashedPassword);
      setHashedPrivateNumber(hashedPrivateNumber);
      
      await contract.methods.register(username, hashedPassword, hashedPrivateNumber).send({ from: acc[0] });

     
      setLoggedIn(false);
      e.preventDefault();
      setUsername('');
      setPassword('');
      setPrivateNumber('');
      
    } catch (error) {
      setErrorMessage("Invalid Username Or Password");
      console.log(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  
  const sellerhandle = async(e) => {
    e.preventDefault();
    try {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
      const abi = SellerContract.abi;
      const contract = new web3.eth.Contract(abi,"0xB65C61E60b2081B44adF3a73FD84eBB08b28F0cA");
      const acc = await web3.eth.getAccounts();

       //await contract.methods.addSeller("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC").send({from: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"});
        const a = await contract.methods.login(acc[0]).call();
        if(a){
          Cookies.set("sellers","true");
          setSellers(true);
         setLoggedIn(true);
        }else {
          alert('Your are not a seller!!')
        }

    } catch(err) {
      console.log(err);
    }
  }
  const beseller=async(e)=>{
   e.preventDefault();
   try {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const abi = SellerContract.abi;
    const contract = new web3.eth.Contract(abi,"0xB65C61E60b2081B44adF3a73FD84eBB08b28F0cA");
    const acc = await web3.eth.getAccounts();

     await contract.methods.addSeller(acc[0]).send({from: acc[0]});
    //  console.log(acc[0]);
    //   const a = await contract.methods.login(acc[0]).call();
    //   if(a){
    //     Cookies.set("sellers","true");
    //     setSellers(true);
    //    setLoggedIn(true);
    //   }else {
    //     alert('Your are not a seller!!')
    //   }

  } catch(err) {
    console.log(err);
  }

  }
  
  

  if (loggedIn) {
     if (sellers){
      return (
        <div> 
        <Seller />
        </div>
      );
     }else{
      return (
        <div>
           <Navbar />
        </div>
      );

     }
  } else {
    return (
      <div className='bg'>

        {isLoading && (
                <div className="popup">
                  <TailSpin   // Type of spinner
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        />
                </div>
              )}

      <div className='auth-form-container'>
      <form className='login-form'>

      <div className='logocontainer2'>
        <img src="data:image/png;base64,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" className='imagelogo'/>
        <h2 className='logotitle'>SwapSafe</h2>
        </div>

        <h1 className='main-text'>Login / Register</h1>
        <div>
          <label id='usrname'>Username:</label>
          <input id='username' type="text" value={username} onChange={(e) => setUsername(e.target.value)}  autoComplete="off" />
        </div>
        <div>
          <label id='usrname'>Password:</label>
          <input id='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)}  autoComplete="off"/>
        </div>
        <div>
          <label id='usrname'>Private Number:</label>
          <input id='private' type="number" value={privateNumber} onChange={(e) => setPrivateNumber(e.target.value)}  autoComplete="off" />
        </div>
        {errorMessage && <div className='error'>{errorMessage}</div>}
        <div id='buttons'>
          <button id='btn' className='b1' type="submit" onClick={handleLogin}>Login</button>
          <button id='btn' className='b2' type="submit" onClick={handleRegister}>Connect Wallet</button>
          <div >
            <button id='sellerbtn'  type='submit' onClick={sellerhandle}>Login as Seller</button>
            <button id='sellerbtn'  type='submit' onClick={beseller}>Be a Seller</button>
          </div>
        </div>
      </form>
    </div>
    </div>

    );
  }


 
}

export default Login;

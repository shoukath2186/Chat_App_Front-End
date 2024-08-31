import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import {useHistory} from 'react-router-dom';
import { useToast } from '@chakra-ui/react'
import axios from 'axios';

function LogIn() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading,setLoading]=useState(false);

  const history=useHistory()

  const toast = useToast()

  function handleClick() {
    setShow((v) => !v);
  }

  async function submitHandiler(){
    setLoading(true)
    if(!email.trim()||!password.trim()){
      toast({
        title: 'All field requared.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:'top'
      })
      setLoading(false)
      return
    }

   

    
    try {
      
      const {data}=await axios.post('/api/user/login',{email,password},{
        headers: {
          "Content-type": "application/json",
        }
      })
     
      
      toast({
        title: 'Login successful.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position:'top'
      })
    
      
      setLoading(false)
      localStorage.setItem('userInfo',JSON.stringify(data))
      history.push('/chats')
    } catch (error) {

      

      toast({
        title: error.response.data.message,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:'top'
      })
      
      setLoading(false)
    }
  }

  return (
    <VStack spacing='5px'>
     

      <FormControl id='log-email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type='email'
          placeholder='Enter Your Email'
          onChange={(e) => setEmail(e.target.value)} // Use onChange
        />
      </FormControl>

      <FormControl id='log-password' isRequired>
        <FormLabel>Password</FormLabel> 
        <InputGroup>
        <Input
          type={show ? 'text' : 'password'}
          placeholder='Enter Your Password'
          onChange={(e) => setPassword(e.target.value)} // Use onChange
        />
        <InputRightElement width='4.5rem'>
          <Button h='1.75rem' size='sm' onClick={handleClick}>
            {show ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
        </InputGroup>
      </FormControl>

     

      
      <Button
      colorScheme='blue'
      width='100%'
      style={{marginTop:15}}
      isLoading={loading}
      onClick={submitHandiler}
      >
         Log In
      </Button>
      <Button
      colorScheme='red'
      width='100%'
      style={{marginTop:15}}
      isLoading={loading}
      onClick={()=>{
        setEmail('guest@example.com');
        setPassword('123456')
      }}
      >
         Get Guest User Credentials
      </Button>
    </VStack>
  );
}

export default LogIn;

import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import { ChatState } from '../../ContextApi/context'

function Register() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const history=useHistory()

  const {setUser}= ChatState()
  const toast = useToast()

  function handleClick() {
    setShow((v) => !v);
  }

  async function submitHandiler() {
    setLoading(true)
    if(!name.trim||!email.trim()||!password.trim()||!confirmPassword){
      toast({
        title: 'All field requared.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:'top'
      })
      return
    }

    if(password!==confirmPassword){
      toast({
        title: 'Password did not Match.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:'top'
      })
      return
    }

   
    try {
      
      const {data}=await axios.post('/api/user/',{name,email,password,pic},{
        headers: {
          "Content-type": "application/json",
        }
      })

      toast({
        title: 'Registration successful.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position:'top'
      })
      setLoading(false)
      localStorage.setItem('userInfo',JSON.stringify(data))
      setUser(data)
       history.push('/chats')
    } catch (error) {
      console.log(1212,error.response.data.message);
      toast({
        title:error.response.data.message,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:'top'
      })
      
      setLoading(false)
    }

  }

  const handlePic = (e) => {
    setLoading(true)
    const pic = e.target.files[0];

    if (!pic) {
      toast({
        title: 'Plese select an image.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:'top'
      })
      setLoading(false)

      return
    }


    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append('file', pic);
      data.append('upload_preset', 'Chat-app');
      data.append('cloud_name', 'dawbpijep');

      fetch("https://api.cloudinary.com/v1_1/dawbpijep/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.url.toString());
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
    
      toast({
        title: 'Please select a valid format.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:'top'

      });
      setLoading(false);
      return;
    }


  }

  return (
    <VStack spacing='5px'>
      <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder='Enter Your Name'
          onChange={(e) => setName(e.target.value)} // Use onChange
        />
      </FormControl>

      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type='email'
          placeholder='Enter Your Email'
          onChange={(e) => setEmail(e.target.value)} // Use onChange
        />
      </FormControl>

      <FormControl id='password' isRequired>
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

      <FormControl id='confirm-password' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder='Enter Your Password'
            onChange={(e) => setConfirmPassword(e.target.value)} // Use onChange
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='pic'>
        <FormLabel>Profile Picture</FormLabel>
        <Input
          type='file'
          p={1.5}
          accept='image/*'
          onChange={handlePic}  // Use onChange for file input
        />
      </FormControl>



      <Button
        colorScheme='blue'
        width='100%'
        style={{ marginTop: 15 }}
        onClick={submitHandiler}
        isLoading={loading}
      >
        Sing In
      </Button>
    </VStack>
  );
}

export default Register;

import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Register from '../Components/Authentication/Register'
import Login from '../Components/Authentication/Login'
import {useHistory} from 'react-router-dom';
function Home() {

    const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    if (userInfo) history.push('/chats');
    
  }, [history]);


    return (
        <Container maxW='xl' centerContent>
            <Box
                display='flex'
                justifyContent='center'
                p={3}
                bg={'white'}
                w='100%'
                m='40px 0 15px 0'
                borderRadius='lg'
                borderWidth='1px'
            >
                <Text fontSize='4xl' fontFamily={'revert-layer'}>WhasApp</Text>
            </Box>
            <Box bg='white' w='100%' p={4} borderRadius='lg' borderWidth='1px'>
                <Tabs variant='soft-rounded'    >
                    <TabList mb='1em'>
                        <Tab width='50%'>Tab 1</Tab>
                        <Tab width='50%'>Tab 2</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                           <Login></Login>
                        </TabPanel>
                        <TabPanel>
                            <Register></Register>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default Home
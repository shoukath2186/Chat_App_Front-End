import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'; 
import ChatProvider from './ContextApi/context';
import Chat from './Pages/Chat';
import Home from './Pages/Home';


function App() {
  return (
    <BrowserRouter>
    <ChatProvider>
      <div className="App">
        <Switch>
          <Route path='/' component={Home}  exact/>
          <Route path='/chats' component={Chat} />
        </Switch>
      </div>
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;

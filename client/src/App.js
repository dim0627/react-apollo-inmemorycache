import './App.css';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://lvh.me:5000',
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
        <div className="App">
          aaa
        </div>
    </ApolloProvider>
  );
}

export default App;

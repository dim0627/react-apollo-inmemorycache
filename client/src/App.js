import { ApolloClient, ApolloProvider, gql, InMemoryCache, useQuery } from '@apollo/client';
import React from 'react';

const client = new ApolloClient({
  uri: 'http://lvh.me:4000',
  cache: new InMemoryCache()
});

const GET_BOOKS = gql`
{
  books {
  	title
    author
	}
}
`

const Books = () => {
  const { loading, error, data } = useQuery(GET_BOOKS)

  if (error) {
    throw new Error(error)
  }

  if (loading) {
    return <div>loading...</div>
  }

  console.log('books loaded', data.books)

  return (
    <ul>
      {data.books.map(book =>
        <li key={book.title}>
          {book.title} - {book.author}
        </li>
      )}
    </ul>
  )
}

const App = () => {
  return (
    <div  className="App">
      <ApolloProvider client={client}>
        <Books />
      </ApolloProvider>
    </div>
  );
}

export default App;

import { ApolloClient, ApolloProvider, gql, InMemoryCache, useQuery } from '@apollo/client';
import React, { useState } from 'react';

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

const BookForm = () => {
  const [newBook, setNewBook] = useState({ title: '', author: '' })

  const handleSubmit = (ev) => {
    ev.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        onChange={(ev) => setNewBook((prev) => ({ ...prev, title: ev.target.value }))}
        defaultValue={newBook.title}
        required
      />
      <input
        type="text"
        name="author"
        onChange={(ev) => setNewBook((prev) => ({ ...prev, author: ev.target.value }))}
        defaultValue={newBook.author}
        required
      />
    </form>
  )
}

const App = () => {
  return (
    <div  className="App">
      <ApolloProvider client={client}>
        <Books />
        <BookForm />
      </ApolloProvider>
    </div>
  );
}

export default App;

import { ApolloClient, ApolloProvider, gql, InMemoryCache, useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';

const client = new ApolloClient({
  uri: 'http://lvh.me:4000',
  cache: new InMemoryCache()
});

const GET_BOOKS = gql`
query {
  books {
    id
  	title
    author
	}
}
`

const ADD_BOOK = gql`
mutation CreateBook($title: String!, $author: String!) {
  addBook(title: $title, author: $author) {
    id
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

const NEW_BOOK_PLACEHOLDER = { title: '', author: '' }

const BookForm = () => {
  const [newBook, setNewBook] = useState(NEW_BOOK_PLACEHOLDER)
  const [addBook, { data }] = useMutation(ADD_BOOK);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    console.log('submit', newBook)
    addBook({
      variables: newBook
    })
    console.log('succeeded', data)
    setNewBook(NEW_BOOK_PLACEHOLDER)
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
      <button type="submit">submit</button>
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

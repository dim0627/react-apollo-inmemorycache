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

const UPDATE_BOOK = gql`
mutation UpdateBook($title: String!, $author: String!) {
  updateBook(title: $title, author: $author) {
    id
    title
    author
  }
}
`

const Books = (props) => {
  const { loading, error, data } = useQuery(GET_BOOKS)

  if (error) {
    throw new Error(error)
  }

  if (loading) {
    return <div>loading...</div>
  }

  console.log('books loaded', data.books)

  return (
    <>
      <h2>Books</h2>
      <ul>
        {data.books.map(book =>
          <li key={book.title}>
            {book.title} - {book.author}
            <button type="button" onClick={() => props.handleClickEdit(book)}>edit</button>
          </li>
        )}
      </ul>
    </>
  )
}

const BookForm = (props) => {
  const [book, setBook] = useState(() => props.book)
  const [addBook, { data }] = useMutation(UPDATE_BOOK);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    console.log('submit', book)
    addBook({
      variables: book
    })
    console.log('succeeded', data)
    setBook({ title: '', author: '' })
  }

  console.log(book)

  return (
    <>
      <h2>Edit</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          onChange={(ev) => setBook((prev) => ({ ...prev, title: ev.target.value }))}
          defaultValue={book.title}
          required
        />
        <input
          type="text"
          name="author"
          onChange={(ev) => setBook((prev) => ({ ...prev, author: ev.target.value }))}
          defaultValue={book.author}
          required
        />
        <button type="submit">submit</button>
      </form>
    </>
  )
}

const App = () => {
  const [editTargetBook, setEditTargetBook] = useState()

  const handleClickEdit = (book) => {
    setEditTargetBook(book)
  }

  console.log(editTargetBook)

  return (
    <div  className="App">
      <ApolloProvider client={client}>
        <Books handleClickEdit={handleClickEdit} />
        {editTargetBook && <BookForm book={editTargetBook} />}
      </ApolloProvider>
    </div>
  );
}

export default App;

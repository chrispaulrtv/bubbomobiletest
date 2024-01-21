/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import axios from 'axios';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import BookItem from './src/components/BookItem';

function App(): React.JSX.Element {
  const [booksList, setBooksList] = useState([] as any);
  const [addBookProcess, setAddBookProcess] = useState({
    process: false,
    item: null,
  });
  const [payloadBook, setPayloadBook] = useState({
    bookName: '',
    author: '',
    publisher: '',
    description: '',
  });
  const [selectedBook, setSelectedBook] = useState({
    bookName: '',
    author: '',
    publisher: '',
    description: '',
  });

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const urlApi = 'http://localhost:3000';

  const handleCancelAddBook = () => {
    setAddBookProcess({
      process: false,
      item: null,
    });
    setPayloadBook({
      bookName: '',
      author: '',
      publisher: '',
      description: '',
    });
  };

  useEffect(() => {
    const getBooksFromApi = async () => {
      try {
        const response = await axios.get(`${urlApi}/books`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const {data} = response;

        if (data && data.length > 0) {
          // console.log('🚀 ~ getBooksFromApi ~ data:', data);
          setBooksList(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getBooksFromApi();
  }, []);

  const handleAddBook = async () => {
    console.log('🚀 ~ handleAddBook ~ payloadBook:', payloadBook);
    try {
      if (
        payloadBook.bookName.trim() === '' ||
        payloadBook.author.trim() === '' ||
        payloadBook.publisher.trim() === '' ||
        payloadBook.description.trim() === ''
      ) {
        Alert.alert('Error', 'Todos los campos son obligatorios');
        return;
      }
      const response = await axios.post(
        `${urlApi}/books`,
        {
          bookName: payloadBook.bookName,
          author: payloadBook.author,
          publisher: payloadBook.publisher,
          description: payloadBook.description,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const {data} = response;
      console.log('🚀 ~ handleAddBook ~ data:', data);
      setBooksList([...booksList, data]);

      if (data) {
        setAddBookProcess({
          process: false,
          item: null,
        });
        setPayloadBook({
          bookName: '',
          author: '',
          publisher: '',
          description: '',
        });
      }
      // getBooksFromApi();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditBook = item => {
    console.log('🚀 ~ handleEditBook ~ item', item);
    setSelectedBook(item);
    setAddBookProcess({
      process: true,
      item: item,
    });
    setPayloadBook({
      bookName: item.bookName,
      author: item.author,
      publisher: item.publisher,
      description: item.description,
    });
  };

  const handleShowInfoBook = async item => {
    const response = await axios.get(`${urlApi}/books/${item.id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const {data} = response;
    console.log('🚀 ~ handleShowInfoBook ~ data', data);

    Alert.alert(
      'Información del libro',
      `Título: ${data.bookName}\nAutor: ${data.author}\nEditorial: ${data.publisher} \n Descripción: ${data.description}`,
    );
  };

  const handleDeleteBook = async item => {
    console.log('🚀 ~ handleDeleteBook ~ selectedBook:', item);
    try {
      const response = await axios.delete(`${urlApi}/books/${item.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const {data} = response;
      setBooksList(booksList.filter(book => book.id !== item.id));
      console.log('🚀 ~ handleDeleteBook ~ data:', data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateBook = async () => {
    try {
      console.log('🚀 ~ handleUpdateBook ~ payloadBook:', payloadBook);
      const response = await axios.put(
        `${urlApi}/books/${selectedBook.id}`,
        {
          bookName: payloadBook.bookName,
          author: payloadBook.author,
          publisher: payloadBook.publisher,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const {data} = response;
      console.log('🚀 ~ handleUpdateBook ~ data:', data);
      if (data.status === 'Book updated') {
        setBooksList(
          booksList.map(book =>
            book.id === selectedBook.id
              ? {
                  ...book,
                  bookName: data.bookName,
                  author: data.author,
                  publisher: data.publisher,
                }
              : book,
          ),
        );
      }
      setAddBookProcess({
        process: false,
        item: null,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />

        {addBookProcess.process && (
          <AddBookForm
            payloadBook={payloadBook}
            setPayloadBook={setPayloadBook}
          />
        )}
        <TouchableOpacity
          style={{
            backgroundColor: 'green',
            margin: 10,
            padding: 15,
            borderRadius: 10,
            shadowColor: 'black',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 5,
          }}
          onPress={() => {
            if (!addBookProcess.process && !addBookProcess.item) {
              setAddBookProcess({
                process: true,
                item: null,
              });
            } else if (addBookProcess.process && !addBookProcess.item) {
              handleAddBook();
            } else if (addBookProcess.process && addBookProcess.item) {
              handleUpdateBook();
            }
          }}>
          <Text
            style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
            {!addBookProcess.process && !addBookProcess.item
              ? 'Agregar Libro'
              : addBookProcess.process && !addBookProcess.item
              ? 'Guardar Libro'
              : addBookProcess.process && addBookProcess.item
              ? 'Actualizar Libro'
              : 'Agregar Libro'}
          </Text>
        </TouchableOpacity>
        {addBookProcess.process && (
          <TouchableOpacity
            style={{
              backgroundColor: 'gray',
              marginHorizontal: 10,
              padding: 15,
              borderRadius: 10,
              shadowColor: 'black',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 5,
            }}
            onPress={() => {
              handleCancelAddBook();
            }}>
            <Text
              style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
              Cancelar
            </Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={booksList}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                handleShowInfoBook(item);
              }}>
              <BookItem
                item={item}
                handleDeleteBook={handleDeleteBook}
                handleUpdateBook={handleEditBook}
              />
            </TouchableOpacity>
          )}
          keyExtractor={item => item?.id.toString()}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const AddBookForm = ({payloadBook, setPayloadBook}: any) => {
  return (
    <View>
      <TextInput
        style={{
          height: 50,
          margin: 8,
          borderWidth: 1,
          borderRadius: 10,
          padding: 10,
        }}
        placeholder="Escribe el nombre del libro..."
        value={payloadBook.bookName}
        onChange={e => {
          setPayloadBook({...payloadBook, bookName: e.nativeEvent.text});
        }}
      />
      <TextInput
        style={{
          height: 50,
          margin: 8,
          borderWidth: 1,
          borderRadius: 10,
          padding: 10,
        }}
        placeholder="Escribe el nombre del autor..."
        value={payloadBook.author}
        onChange={e => {
          setPayloadBook({...payloadBook, author: e.nativeEvent.text});
        }}
      />
      <TextInput
        style={{
          height: 50,
          margin: 8,
          borderWidth: 1,
          borderRadius: 10,
          padding: 10,
        }}
        placeholder="Escribe el nombre de la editorial..."
        value={payloadBook.publisher}
        onChange={e => {
          setPayloadBook({...payloadBook, publisher: e.nativeEvent.text});
        }}
      />
      <TextInput
        style={{
          height: 100,
          margin: 8,
          borderWidth: 1,
          borderRadius: 10,
          padding: 10,
        }}
        multiline={true}
        numberOfLines={4}
        placeholder="Escribe la descripción del libro..."
        value={payloadBook.description}
        onChange={e => {
          setPayloadBook({...payloadBook, description: e.nativeEvent.text});
        }}
      />
    </View>
  );
};

export default App;

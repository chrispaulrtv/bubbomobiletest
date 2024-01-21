import React, {useCallback, useEffect, useRef} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';

const BookItem = ({
  item,
  handleDeleteBook,
  handleUpdateBook,
}: {
  item: any;
  handleDeleteBook: (item: any) => void;
  handleUpdateBook: (item: any) => void;
}) => {
  console.log('🚀 ~ item:', item);
  const ref = useRef<Swipeable | null>(null);

  const handleEditBook = useCallback(() => {
    console.log('🚀 ~ handleEditBook ~ item', item);
    handleUpdateBook(item);
    ref.current?.close();
  }, [item]);

  const handleDelete = useCallback(() => {
    console.log('🚀 ~ handleDeleteBook ~ item', item);
    handleDeleteBook(item);
    ref.current?.close();
  }, [item]);

  const leftSwipe = () => (
    <>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Eliminar</Text>
        <Image
          source={require('../assets/images/delete.png')}
          style={styles.buttonImage}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.editButton} onPress={handleEditBook}>
        <Text style={styles.buttonText}>Editar</Text>
        <Image
          source={require('../assets/images/edit.png')}
          style={styles.buttonImage}
        />
      </TouchableOpacity>
    </>
  );

  useEffect(() => {
    if (item?.opened === false) {
      ref.current?.close();
    }
  }, [item]);

  return (
    <Swipeable
      ref={ref}
      renderLeftActions={leftSwipe}
      onSwipeableOpen={() => {
        // setItemSelected();
      }}>
      <View style={styles.container}>
        <Text>Título: {item?.bookName}</Text>
        <Text>Autor: {item?.author}</Text>
        <Text>Editorial: {item?.publisher}</Text>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  deleteButton: {
    backgroundColor: '#7D0A0A',
    marginVertical: 10,
    marginLeft: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  editButton: {
    backgroundColor: '#365486',
    marginVertical: 10,
    marginLeft: 0,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  buttonImage: {
    width: 30,
    height: 30,
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default BookItem;

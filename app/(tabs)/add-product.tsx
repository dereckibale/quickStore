import addProduct from '@/components/ModifyData';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Button, Dimensions, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { useProducts } from '../../components/FetchData';
import { Product } from "../../utils/types";

const { width, height } = Dimensions.get('window');

export default function AddProductScreen() {
 
  const [scanned, setScanned] = useState(true); // camera hidden initially
  const [scannedData, setScannedData] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const [modalVisible, setModalVisible] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    barcode: undefined,
    name: '',
    selling_price: undefined,
    purchase_price: undefined,
    description: undefined,
  });

  const {products, reload} = useProducts(); //employed this exported function from FetchData component because this component is already wrapped inside FetchData component from parent component

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanned(true); // close camera
    setScannedData(data);
    console.log('Scanned barcode:', data);
    const foundProduct = products?.find(
    (product) => product.barcode?.toString() === data );
        if(!foundProduct){
            console.log("Product NOT found, show form to add new product");
            console.log(products)
            // Initialize the new product form with scanned barcode
            setNewProduct({
                ...newProduct,
                barcode: data,
            });
            setModalVisible(true); // open modal popup
        }else{
            console.log("Product is already stored in the database")
        }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.centered}>
        <Text>Camera permission is required.</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }


    const handleSaveButton = async () => {
      
      if (!newProduct.name || !newProduct.barcode) {
        alert('Please fill in the required fields.');
        return;
      }
      if (typeof newProduct.selling_price !== "number" || isNaN(newProduct.selling_price)) {
        alert('Please enter a valid Selling Price.');
        return;
      }

     //Backend expects:  name, Selling_price, Wholesale_price, Barcode, description
     
      const productToSave: Product = {
        name: newProduct.name,
        selling_price: newProduct.selling_price,
        purchase_price: newProduct.purchase_price ?? 0,
        barcode: newProduct.barcode,
        description: newProduct.description ?? '',
      };
      try{
        console.log('Ready to save:', productToSave);
        const savedProduct = await addProduct(productToSave);
        console.log('Product saved successfully:', savedProduct)
        setModalVisible(false);
        reload();
        setNewProduct({}); // reset form
      }
      catch (error) {
        console.error('Failed to save product:', error);
        alert('Failed to save product. Please try again.');
      }

    };


  return (
    <View style={styles.container}>
      {scanned ? (
        <>
          <Button title="Scan Barcode" onPress={() => setScanned(false)} />
          {scannedData ? <Text style={styles.text}>{scannedData}</Text> : null}
        </>
      ) : (
        <View style={styles.cameraContainer}>
            <CameraView
                style={styles.cameraView}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                barcodeScannerSettings={{
                barcodeTypes: ['qr', 'ean13', 'ean8', 'code128'],
                }}
            />
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Allows closing with hardware back button on Android
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Product</Text>

            <Text>Barcode: {newProduct.barcode ?? ''}</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newProduct.name}
              onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Selling Price"
              value={newProduct.selling_price?.toString() ?? ''}
              keyboardType="numeric"
              onChangeText={(text) => setNewProduct({ ...newProduct, selling_price: Number(text) })}
            />
            <TextInput
              style={styles.input}
              placeholder="Wholesale Price"
              value={newProduct.purchase_price?.toString() ?? ''}
              keyboardType="numeric"
              onChangeText={(text) => setNewProduct({ ...newProduct, purchase_price: Number(text) })}
            />
            
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Description"
              value={newProduct.description}
              multiline
              onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Save" onPress={() => handleSaveButton() } />
            </View>
          </View>
        </View>
      </Modal>
   
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF'},
  
  cameraContainer: {
    width: width * 0.5,
    height: height * 0.25,
    overflow: 'hidden', 
    borderRadius: 12,
    alignSelf: 'center',
  },
  
  cameraView: {
    flex: 1,
  },
  
  text: { marginTop: 20, fontSize: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // ADD THESE:
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    elevation: 5, 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 8,
    marginBottom: 15,
  },
});


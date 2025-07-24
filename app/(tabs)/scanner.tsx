import { useProducts } from '@/components/FetchData';
import { Product } from '@/utils/types';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Button, Dimensions, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ScannerScreen() {

  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [detectedProduct, setDetectedProduct] = useState<Product | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [modalVisible, setModalVisible] = useState(false);

  const screenHeight = Dimensions.get('window').height;
  const cameraHeight = screenHeight/2
  const cameraWidth = ((Dimensions.get('window').width)*3)/4
  const {products, reload} = useProducts()

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

useEffect(() => {
  let matchProduct = products?.find((product) => product.barcode?.toString() === scannedData);
  if (matchProduct) {
    setDetectedProduct(matchProduct);
    setModalVisible(true); // Show modal on detected product
    console.log(products)
  } else {
    setDetectedProduct(null);
    setModalVisible(false); // Hide modal if nothing detected
  }
  console.log(products)
}, [scannedData]);


  if (!permission?.granted) {
    return (
      <View>
        <Text>Camera permission is required.</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }: {data: string}) => {
    setScanned(true);
    setScannedData(data);
  };



return (
<ScrollView
style={{ flex: 1, backgroundColor: '#FFF' }}
contentContainerStyle={{
flexGrow: 1,
justifyContent: 'flex-start',
paddingTop: 30,
alignItems: 'center',
paddingVertical: 20,
}}
>

  {!scanned && (//this portion cannot render once scanned is true because modal should pop up
    <View style={{ height: cameraHeight, width: cameraWidth, backgroundColor: '#000' }}>
      <CameraView
        style={{ flex: 1 }}
        onBarcodeScanned={handleBarcodeScanned}  // enabled only when visible
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'ean8', 'code128'],
        }}
      />
    </View>
  )}

   <View style={{ marginTop: 30, alignItems: 'center', width: '90%' }}>
    {scanned ? (
      <>
          <Text style={{ fontSize: 18, marginBottom: 10, textAlign: 'center' }}>
            Scanned: {scannedData}
          </Text>
          <Button title="Scan" onPress={() => {setScannedData(''); setScanned(false)}} />
        </>
      ) : (
        <Text style={{ fontSize: 16, color: '#555', textAlign: 'center' }}>
          Point the camera to scan a barcode.
        </Text>
    )}

  
  </View>


    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Product Detected</Text>

          {detectedProduct ? (
            <>
              <Text style={{ fontWeight: 'bold' }}>Name:</Text>
              <Text>{detectedProduct.name}</Text>

              <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Barcode:</Text>
              <Text>{detectedProduct.barcode}</Text>

              <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Selling Price:</Text>
              <Text>{detectedProduct.selling_price}</Text>

              <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Wholesale Price:</Text>
              <Text>{detectedProduct.purchase_price}</Text>

              <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Description:</Text>
              <Text>{detectedProduct.description || 'N/A'}</Text>
            </>
          ) : (
            <Text>No product data available.</Text>
          )}

          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </View>
    </Modal>

</ScrollView>
)
}


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
});
import { useProducts } from '@/components/FetchData';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Button, Dimensions, ScrollView, Text, View } from 'react-native';


export default function ScannerScreen() {

  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [detectedProduct, setDetectedProduct] = useState({})
  const [permission, requestPermission] = useCameraPermissions();

  const screenHeight = Dimensions.get('window').height;
  const cameraHeight = screenHeight/2
  const cameraWidth = ((Dimensions.get('window').width)*3)/4


  const {products, reload} = useProducts()
  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  useEffect(()=>{
      let matchProduct = products?.find((product) => product.Barcode.toString() === scannedData)
      if(matchProduct){
        setDetectedProduct(matchProduct)
      }else {
      setDetectedProduct({});
    }
  }, [scannedData])

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

    
      {!scanned && (
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
            <Button title="Scan Again" onPress={() => {setScannedData(''); setScanned(false)}} />
          </>
        ) : (
          <Text style={{ fontSize: 16, color: '#555', textAlign: 'center' }}>
            Point the camera to scan a barcode.
          </Text>
        )}
      </View>

        {detectedProduct && Object.keys(detectedProduct).length > 0 && (
          <View>
            {Object.entries(detectedProduct)
              .filter(([key]) => key !== 'id')
              .map(([key, value]) => (
                <Text key={key} style={{ textAlign: 'center' }}>
                  {key}: {value?.toString()}
                </Text>
              ))}
          </View>
        )}
    </ScrollView>
  )
}
import { useProducts } from "@/components/FetchData";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  let { products } = useProducts();
  return (
    <View style={styles.container}>
      <Text>Whats the Problem Why can't I navigate???</Text>
      {products?.map((product)=>
         <Text key={product.id}>{product.name}</Text>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                  // fill the entire screen
    backgroundColor: '#FFF',  // white background
    justifyContent: 'center', // vertical centering
    alignItems: 'center',     // horizontal centering
  },
});

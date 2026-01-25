// Pastikan import komponen-komponen ini dari 'react-native-paper' dan 'react-native'
import { Portal, Dialog, List, Button, TextInput, Text, Divider } from 'react-native-paper';
import { Pressable, View, FlatList, Dimensions, StyleSheet } from 'react-native';

import React from "react";

export default function UnitSelector({
  value,
  options = [],
  onSelect,
}: {
  value: string;
  options?: string[];
  onSelect: (val: string) => void;
}) {
  const [visible, setVisible] = React.useState(false);
  const { height } = Dimensions.get('window');

  return (
    <>
      {/* 1. Trigger berupa Input Read-Only */}
      <Pressable onPress={() => setVisible(true)} style={styles.unitTrigger}>
        <View pointerEvents="none">
          <TextInput
            mode="outlined"
            value={value}
            placeholder="Unit"
            label="Satuan"
            editable={false} // User tidak mengetik, tapi memilih
            right={<TextInput.Icon icon="chevron-down" />}
            style={styles.unitInput}
            contentStyle={{ paddingRight: 0 }} 
          />
        </View>
      </Pressable>

      {/* 2. Modal Pilihan Unit */}
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => setVisible(false)}
          style={{ maxHeight: height * 0.6, borderRadius: 12 }} // Rounded & batas tinggi
        >
          <Dialog.Title>Pilih Satuan</Dialog.Title>
          <Dialog.Content style={{ paddingHorizontal: 0, paddingBottom: 0 }}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => (
                <List.Item
                  title={item}
                  titleNumberOfLines={2} // Agar teks panjang tidak terpotong
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                  // Tanda centang jika item sedang dipilih
                  right={props => 
                    item === value 
                      ? <List.Icon {...props} icon="check" color="green" /> 
                      : null
                  }
                  style={{ paddingVertical: 4 }}
                />
              )}
              ItemSeparatorComponent={() => <Divider />}
              // Menangani list kosong
              ListEmptyComponent={
                 <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text>Tidak ada pilihan unit.</Text>
                 </View>
              }
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Batal</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  unitTrigger: {
    width: 110,
    justifyContent: 'flex-end',
  },
  unitInput: {
    backgroundColor: '#fff',
  },
});
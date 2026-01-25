import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Pressable,
  StyleSheet,
  Dimensions,
  TextInput as NativeTextInput, // Optional jika butuh input native
} from 'react-native';
import {
  TextInput,
  Text,
  ActivityIndicator,
  Portal,
  Dialog,
  Searchbar,
  Divider,
  Button,
  useTheme,
  IconButton,
} from 'react-native-paper';
import { searchFoodsByPrefix } from '../../db/foodsRepo'; // Pastikan path ini benar

// --- Helper Functions ---
function pickServing(food: any) {
  const servings = food?.servings ?? [];
  if (!Array.isArray(servings) || servings.length === 0) return null;

  const by100g = servings.find(
    s =>
      String(s?.serving_label_id ?? s?.serving_label).toLowerCase() === '100 g',
  );

  return by100g ?? servings[0];
}

function formatMacros(nutrition: any) {
  if (!nutrition) return '';
  const c = nutrition.calories ?? 0;
  const p = nutrition.protein ?? 0;
  const carb = nutrition.carbohydrate ?? 0;
  const f = nutrition.fat ?? 0;
  return `${c} kcal • P ${p}g • C ${carb}g • F ${f}g`;
}

type FoodItem = {
  id?: number | string;
  name?: string;
  name_id?: string;
  [key: string]: any;
};

interface IngredientNameAutocompleteProps {
  value: string;
  onChange: (text: string) => void;
  onSelect: (item: FoodItem) => void;
}

export function IngredientNameAutocomplete({
  value,
  onChange,
  onSelect,
}: IngredientNameAutocompleteProps) {
  const theme = useTheme();
  const { height } = Dimensions.get('window');

  // State
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);

  const openModal = () => {
    setSearchQuery('');
    setItems([]);
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  // Logic Pencarian
  useEffect(() => {
    if (!visible) return;

    const query = searchQuery.trim().toLowerCase();
    if (query.length < 2) {
      setItems([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const rows = await searchFoodsByPrefix(query, 20);

        const mapped: FoodItem[] = rows.map((r: any) => {
          if (r.raw_json) {
            try {
              return JSON.parse(r.raw_json);
            } catch {}
          }
          return { id: r.id, name_id: r?.name_id ?? r.name };
        });

        setItems(mapped);
      } catch (err) {
        console.warn('Search Error:', err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, visible]);

  // Render Item
  const renderItem = useCallback(
    ({ item }: { item: FoodItem }) => {
      const serving = pickServing(item);
      const nutrition = serving?.nutrition;
      const householdUnit = serving?.household_unit_id ?? serving?.household_unit ?? '';
      const macros = formatMacros(nutrition);
      const name = item.name_id ?? item.name ?? 'Unnamed';

      return (
        <Pressable
          style={({ pressed }) => [
            styles.itemContainer,
            { backgroundColor: pressed ? theme.colors.elevation.level2 : 'transparent' }
          ]}
          onPress={() => {
            onSelect(item);
            onChange(name);
            closeModal();
          }}
        >
          <View style={{ flex: 1 }}>
            <Text variant="bodyLarge" style={{ fontWeight: '600' }}>
              {name}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 2 }}>
              {householdUnit ? (
                <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                  {householdUnit}
                </Text>
              ) : null}
              {macros ? (
                <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
                  {macros}
                </Text>
              ) : null}
            </View>
          </View>
          <IconButton icon="plus-circle-outline" size={24} iconColor={theme.colors.primary} />
        </Pressable>
      );
    },
    [onChange, onSelect, theme]
  );

  console.log('searchQuery:', searchQuery);

  return (
    <>
      {/* Input Trigger */}
      <View style={styles.inputWrapper}>
        <Pressable onPress={openModal}>
          <View pointerEvents="none">
            <TextInput
              label="Nama Bahan"
              value={value}
              placeholder="Cari bahan..."
              mode="outlined"
              editable={false}
              right={<TextInput.Icon icon="chevron-down" />}
              style={styles.mainInput}
            />
          </View>
        </Pressable>
      </View>

      {/* Modal / Dialog */}
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={closeModal}
          // PERBAIKAN DI SINI: tambahkan borderRadius: 12 (atau 8)
          style={{
            maxHeight: height * 0.8,
            marginTop: 40,
            borderRadius: 12, // <-- INI KUNCINYA
            backgroundColor: theme.colors.surface,
          }}
          theme={{ colors: { backdrop: 'rgba(0,0,0,0.6)' } }}
        >
          <Dialog.Title style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
            Cari Bahan Makanan
          </Dialog.Title>
          
          <Dialog.Content style={{ paddingHorizontal: 0, paddingBottom: 0 }}>
            <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
              <Searchbar
                placeholder="Ketik nama bahan..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                autoFocus
                style={{ 
                  backgroundColor: theme.colors.elevation.level1,
                  height: 46,
                }}
                inputStyle={{ minHeight: 0 }}
              />
            </View>
            
            <View style={{ height: 350, borderTopWidth: 1, borderTopColor: theme.colors.outlineVariant }}>
              {loading ? (
                <View style={styles.centerContainer}>
                  <ActivityIndicator size="large" />
                  <Text style={{ marginTop: 10 }}>Mencari...</Text>
                </View>
              ) : (
                <FlatList
                  data={items}
                  keyExtractor={(item, idx) => String(item.id ?? idx)}
                  renderItem={renderItem}
                  ItemSeparatorComponent={() => <Divider />}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ flexGrow: 1 }}
                  ListEmptyComponent={
                    <View style={styles.centerContainer}>
                      <Text style={{ color: theme.colors.outline, textAlign: 'center' }}>
                        {searchQuery.length > 1 
                          ? 'Tidak ditemukan.' 
                          : 'Ketik untuk mencari...'}
                      </Text>
                    </View>
                  }
                />
              )}
            </View>
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={closeModal}>Batal</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    flex: 2, 
    marginRight: 8,
  },
  mainInput: {
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
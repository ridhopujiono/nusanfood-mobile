// src/screens/CreateRecipeScreen.tsx
import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useTheme,
  TextInput as PaperTextInput,
  Button,
  IconButton,
  Text,
  Divider,
  Surface,
  TouchableRipple,
} from 'react-native-paper';
import Modal from 'react-native-modal';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {
  launchImageLibrary,
  launchCamera,
  ImageLibraryOptions,
  CameraOptions,
  Asset,
} from 'react-native-image-picker';

const { width } = Dimensions.get('window');

type Step = 1 | 2 | 3 | 4 | 5;

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface RecipeStep {
  instruction: string;
}

interface RecipeData {
  image: string;
  title: string;
  description: string;
  cookingTime: string;
  servings: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
}

type RootStackParamList = {
  Home: undefined;
  CreateRecipe: undefined;
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreateRecipe'
>;

export default function CreateRecipeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [recipeData, setRecipeData] = useState<RecipeData>({
    image: '',
    title: '',
    description: '',
    cookingTime: '',
    servings: '',
    ingredients: [{ name: '', quantity: '', unit: 'g' }],
    steps: [{ instruction: '' }],
  });

  // bottom sheet state
  const [pickerVisible, setPickerVisible] = useState(false);

  // helper: request permissions on Android
  async function requestAndroidImagePermission(): Promise<boolean> {
    try {
      if (Platform.Version >= 33) {
        // Android 13+
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Permission to access images',
            message: 'We need access to your images to upload recipe photos.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Permission to access storage',
            message: 'We need access to your storage to choose pictures.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('requestAndroidImagePermission error', err);
      return false;
    }
  }

  async function requestAndroidCameraPermission(): Promise<boolean> {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permission to use camera',
          message: 'We need access to your camera to take photos.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('requestAndroidCameraPermission error', err);
      return false;
    }
  }

  // pick from gallery
  const pickFromGallery = async () => {
    setPickerVisible(false);
    // Android permission
    if (Platform.OS === 'android') {
      const ok = await requestAndroidImagePermission();
      if (!ok) {
        Alert.alert(
          'Permission denied',
          'Cannot access gallery without permission.',
        );
        return;
      }
    }

    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
      includeBase64: false,
    };

    try {
      const res = await launchImageLibrary(options);
      console.log('launchImageLibrary result', res);
      if (res.didCancel) return;
      if (res.errorCode) {
        Alert.alert('Error', res.errorMessage || 'Unable to pick image');
        return;
      }
      const asset: Asset | undefined = res.assets && res.assets[0];
      console.log('picked asset', asset);
      if (asset && asset.uri) {
        setRecipeData(s => ({ ...s, image: asset.uri! }));
      }
    } catch (err) {
      console.warn('pickFromGallery error', err);
      Alert.alert('Error', 'Could not open image library');
    }
  };

  // take a photo from camera
  const takePhoto = async () => {
    setPickerVisible(false);
    if (Platform.OS === 'android') {
      const ok = await requestAndroidCameraPermission();
      if (!ok) {
        Alert.alert(
          'Permission denied',
          'Cannot use camera without permission.',
        );
        return;
      }
    }

    const options: CameraOptions = {
      mediaType: 'photo',
      saveToPhotos: true,
      includeBase64: false,
    };

    try {
      const res = await launchCamera(options);
      console.log('launchCamera result', res);
      if (res.didCancel) return;
      if (res.errorCode) {
        Alert.alert('Error', res.errorMessage || 'Unable to take photo');
        return;
      }
      const asset: Asset | undefined = res.assets && res.assets[0];
      console.log('captured asset', asset);
      if (asset && asset.uri) {
        setRecipeData(s => ({ ...s, image: asset.uri! }));
      }
    } catch (err) {
      console.warn('takePhoto error', err);
      Alert.alert('Error', 'Could not open camera');
    }
  };

  // existing form helpers (ingredients/steps)
  const addIngredient = () =>
    setRecipeData(s => ({
      ...s,
      ingredients: [...s.ingredients, { name: '', quantity: '', unit: 'g' }],
    }));

  const removeIngredient = (index: number) =>
    setRecipeData(s => ({
      ...s,
      ingredients: s.ingredients.filter((_, i) => i !== index),
    }));

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string,
  ) =>
    setRecipeData(s => {
      const newIngredients = [...s.ingredients];
      newIngredients[index] = { ...newIngredients[index], [field]: value };
      return { ...s, ingredients: newIngredients };
    });

  const addStep = () =>
    setRecipeData(s => ({ ...s, steps: [...s.steps, { instruction: '' }] }));

  const removeStep = (index: number) =>
    setRecipeData(s => ({
      ...s,
      steps: s.steps.filter((_, i) => i !== index),
    }));

  const updateStep = (index: number, value: string) =>
    setRecipeData(s => {
      const newSteps = [...s.steps];
      newSteps[index] = { instruction: value };
      return { ...s, steps: newSteps };
    });

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(c => (c + 1) as Step);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(c => (c - 1) as Step);
    else navigation.goBack();
  };

  const handlePublish = () => {
    console.log('Publishing recipe:', recipeData);
    Alert.alert('Published', 'Recipe published (mock)');
    navigation.goBack();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return recipeData.image !== '';
      case 2:
        return (
          recipeData.title.trim() !== '' &&
          recipeData.cookingTime.trim() !== '' &&
          recipeData.servings.trim() !== ''
        );
      case 3:
        return recipeData.ingredients.some(ing => ing.name.trim() !== '');
      case 4:
        return recipeData.steps.some(step => step.instruction.trim() !== '');
      default:
        return true;
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Create Recipe (${currentStep}/5)`,
      headerTitleStyle: {
        fontWeight: '600',
      },
    });
  }, [navigation, currentStep]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.progressBar}>
        {[1, 2, 3, 4, 5].map(step => (
          <View
            key={step}
            style={[
              styles.progressSegment,
              step <= currentStep && { backgroundColor: theme.colors.primary },
            ]}
          />
        ))}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {currentStep === 1 && (
          <View style={styles.stepContent}>
            <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
              Unggah Foto Resep Anda
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant ?? '#666',
                marginBottom: 12,
              }}
            >
              Pilih foto terbaik makanan yang telah anda buat!.
            </Text>

            <TouchableCard
              onPress={() => setPickerVisible(true)}
              imageUri={recipeData.image}
            />
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.stepContent}>
            <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
              Informasi Resep
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant ?? '#666',
                marginBottom: 12,
              }}
            >
              Beritahu kami tentang resep anda!
            </Text>

            <PaperTextInput
              label="Judul Resep *"
              value={recipeData.title}
              onChangeText={t => setRecipeData(s => ({ ...s, title: t }))}
              style={styles.input}
              mode="outlined"
            />

            <PaperTextInput
              label="Deskripsi"
              value={recipeData.description}
              onChangeText={t => setRecipeData(s => ({ ...s, description: t }))}
              style={[styles.input, styles.textArea]}
              mode="outlined"
              multiline
              numberOfLines={4}
            />

            <View style={styles.row}>
              <PaperTextInput
                label="Durasi Memasak (menit) *"
                value={recipeData.cookingTime}
                onChangeText={t =>
                  setRecipeData(s => ({ ...s, cookingTime: t }))
                }
                style={[styles.input, styles.halfWidth]}
                mode="outlined"
                keyboardType="numeric"
              />
              <PaperTextInput
                label="Jumlah Porsi *"
                value={recipeData.servings}
                onChangeText={t => setRecipeData(s => ({ ...s, servings: t }))}
                style={[styles.input, styles.halfWidth]}
                mode="outlined"
                keyboardType="numeric"
              />
            </View>
          </View>
        )}

        {currentStep === 3 && (
          <View style={styles.stepContent}>
            <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
              Bahan
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant ?? '#666',
                marginBottom: 12,
              }}
            >
              Tambahkan bahan-bahan yang dibutuhkan!
            </Text>

            {recipeData.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientRow}>
                <View style={styles.ingredientInputs}>
                  <PaperTextInput
                    placeholder="Nama Bahan"
                    value={ingredient.name}
                    onChangeText={t => updateIngredient(index, 'name', t)}
                    style={[styles.input, styles.ingredientName]}
                    mode="outlined"
                  />
                  <PaperTextInput
                    placeholder="Jumlah"
                    value={ingredient.quantity}
                    onChangeText={t => updateIngredient(index, 'quantity', t)}
                    style={[styles.input, styles.ingredientQuantity]}
                    mode="outlined"
                    keyboardType="numeric"
                  />
                  <PaperTextInput
                    placeholder="g"
                    value={ingredient.unit}
                    onChangeText={t => updateIngredient(index, 'unit', t)}
                    style={[styles.input, styles.ingredientUnit]}
                    mode="outlined"
                  />
                </View>

                {recipeData.ingredients.length > 1 && (
                  <IconButton
                    icon="close"
                    onPress={() => removeIngredient(index)}
                    iconColor="#ff4444"
                    size={20}
                    style={styles.iconBtn}
                  />
                )}
              </View>
            ))}

            <Button mode="outlined" onPress={addIngredient} icon="plus">
             Bahan Lainya
            </Button>
          </View>
        )}

        {currentStep === 4 && (
          <View style={styles.stepContent}>
            <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
              Langkah Langkah
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant ?? '#666',
                marginBottom: 12,
              }}
            >
              Apa saja langkah-langkah untuk membuat resep ini?
            </Text>

            {recipeData.steps.map((step, index) => (
              <View key={index} style={styles.stepRow}>
                <Surface style={styles.stepNumberBadge}>
                  <Text variant="titleSmall" style={styles.stepNumberText}>
                    {index + 1}
                  </Text>
                </Surface>

                <View style={styles.stepInputContainer}>
                  <PaperTextInput
                    placeholder={`Langkah ${index + 1} ...`}
                    value={step.instruction}
                    onChangeText={t => updateStep(index, t)}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    style={styles.input}
                  />

                  {recipeData.steps.length > 1 && (
                    <IconButton
                      icon="close"
                      iconColor="#ff4444"
                      size={18}
                      onPress={() => removeStep(index)}
                      style={styles.iconBtnAbsolute}
                    />
                  )}
                </View>
              </View>
            ))}

            <Button mode="outlined" onPress={addStep} icon="plus">
              Langkah Lainya
            </Button>
          </View>
        )}

        {currentStep === 5 && (
          <View style={styles.stepContent}>
            <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
              Preview Resep & Publish
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant ?? '#666',
                marginBottom: 12,
              }}
            >
              Apakah resep ini sudah sesuai?
            </Text>

            <Surface style={styles.previewCard}>
              {recipeData.image && (
                <Image
                  source={{ uri: recipeData.image }}
                  style={styles.previewImage}
                  resizeMode="cover"
                  onError={e =>
                    console.warn('preview image error', e.nativeEvent)
                  }
                />
              )}
              <View style={styles.previewContent}>
                <Text variant="titleLarge" style={styles.previewTitle}>
                  {recipeData.title || 'Belum ada judul'}
                </Text>
                <Text variant="labelLarge" style={styles.previewMeta}>
                  {recipeData.cookingTime} menit • {recipeData.servings} porsi
                </Text>
                <Text variant="bodyMedium" style={styles.previewDescription}>
                  {recipeData.description || 'Belum ada deskripsi'}
                </Text>
                <Divider style={{ marginVertical: 8 }} />
                <Text variant="labelLarge">
                  {recipeData.ingredients.filter(i => i.name).length}{' '}
                  Bahan
                </Text>
                <Text variant="labelLarge">
                  {recipeData.steps.filter(s => s.instruction).length} Langkah
                </Text>
              </View>
            </Surface>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 1 && (
          <Button
            mode="outlined"
            onPress={handleBack}
            style={styles.backButton}
          >
            Kembali
          </Button>
        )}

        {currentStep < 5 ? (
          <Button
            mode="contained"
            onPress={handleNext}
            disabled={!canProceed()}
            style={[styles.nextButton, !canProceed() && styles.disabledButton]}
          >
            Selanjutnya
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={handlePublish}
            style={styles.publishButton}
          >
            Publish
          </Button>
        )}
      </View>

      {/* Bottom sheet / action sheet */}
      <Modal
        isVisible={pickerVisible}
        onBackdropPress={() => setPickerVisible(false)}
        onBackButtonPress={() => setPickerVisible(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropTransitionOutTiming={0}
        coverScreen={true}
        avoidKeyboard={true}
        propagateSwipe={true}
      >
        <View style={styles.bottomSheet}>
          <Button
            mode="text"
            icon="camera"
            onPress={takePhoto}
            contentStyle={styles.modalButtonContent}
            style={styles.modalButton}
            labelStyle={styles.modalLabel}
          >
            Kamera
          </Button>

          <Button
            mode="text"
            icon="image"
            onPress={pickFromGallery}
            contentStyle={styles.modalButtonContent}
            style={styles.modalButton}
            labelStyle={styles.modalLabel}
          >
            Pilih Gambar
          </Button>

          <Button
            mode="text"
            onPress={() => setPickerVisible(false)}
            contentStyle={styles.modalButtonContent}
            style={styles.modalCancel}
            labelStyle={styles.modalCancelLabel}
          >
            Kembali
          </Button>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/**
 * TouchableCard: uses TouchableOpacity so Image can have explicit size.
 */
function TouchableCard({
  onPress,
  imageUri,
}: {
  onPress: () => void;
  imageUri?: string;
}) {
  const H = width - 40;

  return (
    <TouchableOpacity
      onPress={() => {
        console.log('>>> upload area pressed');
        onPress();
      }}
      activeOpacity={0.85}
      style={[styles.imageUploadBox, { height: H, borderRadius: 8 }]}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.uploadedImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.uploadPlaceholder}>
          <IconButton icon="camera" size={36} iconColor="#999" />
          <Text style={styles.uploadText}>Tap to upload photo</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  progressBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginHorizontal: 4,
  },
  content: { flex: 1 },
  stepContent: { padding: 20 },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  stepDescription: { fontSize: 15, color: '#666', marginBottom: 12 },
  // <-- borderRadius default changed to 8
  imageUploadBox: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: { fontSize: 16, fontWeight: '600', color: '#999', marginTop: 12 },
  uploadedImage: { width: '100%', height: '100%' },
  input: { marginBottom: 12, paddingTop: 10 },
  textArea: { minHeight: 100 },
  row: { flexDirection: 'row', gap: 12 },
  halfWidth: { flex: 1 },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ingredientInputs: { flex: 1, flexDirection: 'row' },
  ingredientName: { flex: 2, marginRight: 8 },
  ingredientQuantity: { flex: 1, marginRight: 8 },
  ingredientUnit: { width: 80 },
  iconBtn: { margin: 0 },
  iconBtnAbsolute: { position: 'absolute', top: 8, right: 8 },
  stepRow: { flexDirection: 'row', marginBottom: 12, gap: 12 },
  stepNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: { color: '#fff' },
  stepInputContainer: { flex: 1 },
  previewCard: { borderRadius: 8, overflow: 'hidden', marginTop: 8 },
  previewImage: { width: '100%', height: 220 },
  previewContent: { padding: 16 },
  previewTitle: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  previewMeta: { color: '#666', marginBottom: 8 },
  previewDescription: { color: '#333', marginBottom: 8 },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: { flex: 1, borderRadius: 8 },
  nextButton: { flex: 2, borderRadius: 8 },
  publishButton: { flex: 2, borderRadius: 8 },
  disabledButton: { backgroundColor: '#e0e0e0' },

  /* modal styles */
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  bottomSheet: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    // force to bottom and above nav bar
    paddingBottom: Platform.OS === 'android' ? 24 : 12,
    // add elevation/zIndex to ensure on top
    elevation: 20,
    zIndex: 9999,
  },

  modalButton: {
    justifyContent: 'flex-start',
    paddingVertical: 6,
  },
  modalButtonContent: {
    height: 48,
  },
  modalLabel: {
    fontSize: 16,
    textAlign: 'left',
  },
  modalCancel: {
    marginTop: 8,
    paddingVertical: 10,
  },
  modalCancelLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

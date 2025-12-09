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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Appbar,
  useTheme,
  TextInput as PaperTextInput,
  Button,
  IconButton,
  Text,
  Divider,
  Surface,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {
  launchImageLibrary,
  ImageLibraryOptions,
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

  const pickImage = async () => {
    try {
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        selectionLimit: 1,
        includeBase64: false,
      };

      const res = await launchImageLibrary(options);

      if (res.didCancel) return;
      if (res.errorCode) {
        Alert.alert('Error', res.errorMessage || 'Unable to pick image');
        return;
      }
      const asset: Asset | undefined = res.assets && res.assets[0];
      if (asset && asset.uri) {
        setRecipeData(s => ({ ...s, image: asset.uri! }));
      }
    } catch (err) {
      console.warn('pickImage error', err);
      Alert.alert('Error', 'Could not open image library');
    }
  };

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
      headerStyle: {
        backgroundColor: theme.colors.primary, // hijau matang
      },
      headerTintColor: theme.colors.onPrimary, // warna ikon & teks
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
              Upload Recipe Photo
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant ?? '#666',
                marginBottom: 12,
              }}
            >
              Choose a beautiful photo of your finished dish
            </Text>

            <TouchableCard onPress={pickImage} imageUri={recipeData.image} />
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.stepContent}>
            <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
              Recipe Information
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant ?? '#666',
                marginBottom: 12,
              }}
            >
              Tell us about your recipe
            </Text>

            <PaperTextInput
              label="Recipe Title *"
              value={recipeData.title}
              onChangeText={t => setRecipeData(s => ({ ...s, title: t }))}
              style={styles.input}
              mode="outlined"
            />

            <PaperTextInput
              label="Description"
              value={recipeData.description}
              onChangeText={t => setRecipeData(s => ({ ...s, description: t }))}
              style={[styles.input, styles.textArea]}
              mode="outlined"
              multiline
              numberOfLines={4}
            />

            <View style={styles.row}>
              <PaperTextInput
                label="Cooking Time (min) *"
                value={recipeData.cookingTime}
                onChangeText={t =>
                  setRecipeData(s => ({ ...s, cookingTime: t }))
                }
                style={[styles.input, styles.halfWidth]}
                mode="outlined"
                keyboardType="numeric"
              />
              <PaperTextInput
                label="Servings *"
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
              Ingredients
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant ?? '#666',
                marginBottom: 12,
              }}
            >
              Add ingredients with quantities
            </Text>

            {recipeData.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientRow}>
                <View style={styles.ingredientInputs}>
                  <PaperTextInput
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChangeText={t => updateIngredient(index, 'name', t)}
                    style={[styles.input, styles.ingredientName]}
                    mode="outlined"
                  />
                  <PaperTextInput
                    placeholder="Qty"
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
              Add Ingredient
            </Button>
          </View>
        )}

        {currentStep === 4 && (
          <View style={styles.stepContent}>
            <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
              Cooking Steps
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant ?? '#666',
                marginBottom: 12,
              }}
            >
              Describe the preparation steps
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
                    placeholder={`Step ${index + 1} instruction`}
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
              Add Step
            </Button>
          </View>
        )}

        {currentStep === 5 && (
          <View style={styles.stepContent}>
            <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
              Preview & Publish
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant ?? '#666',
                marginBottom: 12,
              }}
            >
              Review your recipe before publishing
            </Text>

            <Surface style={styles.previewCard}>
              {recipeData.image && (
                <Image
                  source={{ uri: recipeData.image }}
                  style={styles.previewImage}
                />
              )}
              <View style={styles.previewContent}>
                <Text variant="titleLarge" style={styles.previewTitle}>
                  {recipeData.title || 'Untitled Recipe'}
                </Text>
                <Text variant="labelLarge" style={styles.previewMeta}>
                  {recipeData.cookingTime} min • {recipeData.servings} servings
                </Text>
                <Text variant="bodyMedium" style={styles.previewDescription}>
                  {recipeData.description || 'No description'}
                </Text>
                <Divider style={{ marginVertical: 8 }} />
                <Text variant="labelLarge">
                  {recipeData.ingredients.filter(i => i.name).length}{' '}
                  Ingredients
                </Text>
                <Text variant="labelLarge">
                  {recipeData.steps.filter(s => s.instruction).length} Steps
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
            Back
          </Button>
        )}

        {currentStep < 5 ? (
          <Button
            mode="contained"
            onPress={handleNext}
            disabled={!canProceed()}
            style={[styles.nextButton, !canProceed() && styles.disabledButton]}
          >
            Next
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={handlePublish}
            style={styles.publishButton}
          >
            Publish Recipe
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}

/**
 * Small helper component for image upload area using Paper surface for consistent look
 */
function TouchableCard({
  onPress,
  imageUri,
}: {
  onPress: () => void;
  imageUri?: string;
}) {
  return (
    <Button
      mode="outlined"
      onPress={onPress}
      style={styles.imageUploadBox}
      contentStyle={{ height: width - 40 }}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
      ) : (
        <View style={styles.uploadPlaceholder}>
          <IconButton icon="camera" size={36} iconColor="#999" />
          <Text style={styles.uploadText}>Tap to upload photo</Text>
        </View>
      )}
    </Button>
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
  imageUploadBox: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: { fontSize: 16, fontWeight: '600', color: '#999', marginTop: 12 },
  uploadedImage: { width: '100%', height: '100%' },
  input: { marginBottom: 12 },
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
  stepRow: { flexDirection: 'row', marginBottom: 12 },
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
  previewCard: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
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
  backButton: { flex: 1 },
  nextButton: { flex: 2 },
  publishButton: { flex: 2 },
  disabledButton: { backgroundColor: '#e0e0e0' },
});

import { useState, useCallback } from "react";

export const useFeatures = (initialFeatures = []) => {
  const [features, setFeatures] = useState(initialFeatures);
  const [featureInput, setFeatureInput] = useState("");
  const [errors, setErrors] = useState({});

  const addFeature = useCallback(() => {
    const normalizedFeature = featureInput.trim().toLowerCase();
    if (normalizedFeature) {
      const normalizedFeatures = features.map((f) => f.toLowerCase());
      if (normalizedFeatures.includes(normalizedFeature)) {
        setErrors((prev) => ({ ...prev, features: "Feature already exists" }));
      } else {
        setFeatures((prev) => [...prev, featureInput.trim()]);
        setFeatureInput("");
        setErrors((prev) => ({ ...prev, features: null }));
      }
    }
  }, [featureInput, features]);

  const removeFeature = useCallback((index) => {
    setFeatures((prev) => {
      const updatedFeatures = [...prev];
      updatedFeatures.splice(index, 1);
      return updatedFeatures;
    });
  }, []);

  return {
    features,
    featureInput,
    setFeatureInput,
    addFeature,
    removeFeature,
    errors,
    setErrors,
  };
};
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Load cleaned dataset
df = pd.read_csv("dataset/processed/cleaned_dataset.csv")

# Features and labels
# Remove empty rows
df = df.dropna(subset=["clean_text"])

# Features and labels
# Remove empty rows
df = df.dropna(subset=["clean_text"])

# Features and labels
# Remove empty rows
df = df.dropna(subset=["clean_text"])

# Features and labels
X = df["clean_text"].astype(str)
y = df["label"]
# Convert text into numbers using TF-IDF
vectorizer = TfidfVectorizer(max_features=5000)

X_vectorized = vectorizer.fit_transform(X)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X_vectorized,
    y,
    test_size=0.2,
    random_state=42
)

# Train model
model = LogisticRegression()

model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# Accuracy
accuracy = accuracy_score(y_test, y_pred)

print(f"✅ Model Accuracy: {accuracy * 100:.2f}%")

# Detailed report
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

# Save model
joblib.dump(model, "model.pkl")

# Save vectorizer
joblib.dump(vectorizer, "vectorizer.pkl")

print("\n✅ Model Saved Successfully!")
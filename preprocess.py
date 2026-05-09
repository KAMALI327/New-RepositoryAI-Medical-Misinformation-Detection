import pandas as pd
import re
import nltk
from nltk.corpus import stopwords

# Download stopwords
nltk.download('stopwords')

# Load dataset
df = pd.read_csv("dataset/processed/final_dataset.csv")

# Stopwords
stop_words = set(stopwords.words('english'))

# Text cleaning function
def clean_text(text):
    text = str(text).lower()

    # Remove URLs
    text = re.sub(r"http\S+", "", text)

    # Remove special characters
    text = re.sub(r"[^a-zA-Z\s]", "", text)

    # Remove stopwords
    words = text.split()
    words = [word for word in words if word not in stop_words]

    return " ".join(words)

# Apply cleaning
df["clean_text"] = df["text"].apply(clean_text)

# Save cleaned dataset
df.to_csv("dataset/processed/cleaned_dataset.csv", index=False)

print("✅ Text Preprocessing Completed!")
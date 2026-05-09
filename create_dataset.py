import pandas as pd

# Load fake dataset
fake_df = pd.read_csv("dataset/coaid/NewsFakeCOVID-19.csv")

# Load real dataset
real_df = pd.read_csv("dataset/coaid/NewsRealCOVID-19.csv")

# Add labels
fake_df["label"] = 0
real_df["label"] = 1

# Select important columns
fake_df = fake_df[["title", "label"]]
real_df = real_df[["title", "label"]]

# Rename columns
fake_df.columns = ["text", "label"]
real_df.columns = ["text", "label"]

# Merge datasets
final_df = pd.concat([fake_df, real_df])

# Shuffle rows
final_df = final_df.sample(frac=1)

# Save final dataset
final_df.to_csv("dataset/processed/final_dataset.csv", index=False)

print("✅ Dataset Created Successfully!")
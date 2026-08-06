import pandas as pd
import glob
# import os # Not strictly needed for this specific task

# List all CSV files only
csv_files = glob.glob('*.csv')

# --- MODERNIZED APPENDING (Recommended) ---
# 1. Read all files into a list of DataFrames
list_of_dfs = [pd.read_csv(file) for file in csv_files]

# 2. Concatenate all DataFrames in the list at once
# If the list is empty, it handles it gracefully (results in an empty DataFrame)
if list_of_dfs:
    df_append = pd.concat(list_of_dfs, ignore_index=True)
else:
    df_append = pd.DataFrame() # Create an empty DataFrame if no files found
# --- END MODERNIZATION ---

# Define the output file name (make sure to put in the correct directory)
fname = "all_results.csv"

# Save the final combined DataFrame
# It's good practice to create the directory if it doesn't exist
# os.makedirs(os.path.dirname(fname), exist_ok=True)
df_append.to_csv(fname, mode='w', index=False, header=True)
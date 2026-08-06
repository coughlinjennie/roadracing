from selenium import webdriver
from selenium.webdriver import Chrome
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd

options = webdriver.ChromeOptions()
options.add_argument('headless')
options.page_load_strategy='none'
chrome_path = ChromeDriverManager().install()
chrome_service = Service(chrome_path)
driver = Chrome(options=options, service=chrome_service)
driver.implicitly_wait(5)


# Update the URL with the event code for the race
url = f'https://results.nyrr.org/event/23BKH/finishers#opf=10915&page=1'
driver.get(url)
content = driver.find_elements(By.CSS_SELECTOR, "div[ng-repeat*='eventFinisher in eventFinishers']")

# New method: Collect all finishers' data as dictionaries in a list
data_list = [] 

# content holds the entire list of divs; finisher represents an individual div
for finisher in content:
    newFinisher = {}
    
    # --- Name ---
    name = finisher.find_elements(By.CSS_SELECTOR, "div[class*='name']")
    newFinisher["Name"] = name[0].text if name else ""

    # --- Gender and Age ---
    genderage = finisher.find_elements(By.CSS_SELECTOR, "span[ng-if*='eventFinisher.gender']")
    if genderage:
        text = genderage[0].text
        # Check if the first character is a valid gender
        if text and text[0] in "MWX":
            newFinisher["Gender"] = text[0]
            # The [1:] slicer gets all of the characters after the first (the age)
            newFinisher["Age"] = text[1:].strip()
        else:
            newFinisher["Gender"] = ""
            newFinisher["Age"] = text.strip() # If not M/W/X, the whole string might be age or blank
    else:
        newFinisher["Gender"] = ""
        newFinisher["Age"] = ""

    # --- Country and State ---
    iaaf = finisher.find_elements(By.CSS_SELECTOR, "span[ng-if*='eventFinisher.iaaf']")
    newFinisher["Country"] = iaaf[0].text if iaaf else ""
    
    # State is typically only available for US runners.
    state = finisher.find_elements(By.CSS_SELECTOR, "span[ng-if*='eventFinisher.stateProvince']")
    # Only assign State if the element exists and the Country is USA (optional check, but safer)
    if state and newFinisher["Country"] == 'USA':
        newFinisher["State"] = state[0].text
    else:
        newFinisher["State"] = ""
        
    # --- Time and Overall Place ---
    # This could return up to four items.
    results = finisher.find_elements(By.CSS_SELECTOR, "span[class*='result']")
    newFinisher["Time"] = "" # Initialize to ensure keys exist
    newFinisher["Overall"] = ""

    for result in results:
        if "Time" in result.text:
            newFinisher["Time"] = result.text.removeprefix("Time").strip()
        
        if "Place" in result.text:
            # Remove "Place", then remove commas, then strip whitespace
            newFinisher["Overall"] = result.text.removeprefix("Place").replace(',', '').strip()


    # Instead of concatenating a DataFrame, append the dictionary to the list
    data_list.append(newFinisher)

# Create the DataFrame once outside the loop for efficiency
rows = pd.DataFrame(data_list)

#Update the folder to the correct one for the event
fname = f"23BKH/215.csv"
rows.to_csv(fname, mode='w', index=False, header=True)
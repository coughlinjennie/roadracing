# Scraping NYRR Race Results Data

## Set Up

The Scrape folder has all the scripts needed to scrape individual race results from https://results.nyrr.org/home 
Each page of race results has 51 finishers. The race page will state how many finishers there are. Within the Scripts folder are scripts for each results page, up to 28K finishers. 

## Scraping a Race's Results

For the race you want to scrape, get the race code from the URL of the results page. Example: https://results.nyrr.org/event/26SLSM/finishers uses 26SLSM as the race code. 
Open however many of the Scripts files you need in a text editor. In lines 18 and 83, replace the code with the one for the race you're scraping. Multi-file find and replace is your friend here. Save and close them. 
Create a folder in your destination named with the race code. 
Put the run_scripts.sh file in your destination folder. Note out the lines at the bottom you don't need to run. 
Run the shell script. This will create a CSV for each results page in the destination folder. 
Once that's done, remove the shell script and drop in the nyyappend.py script. 
Run that, which will create a single csv file with all the results for that race. 

If you want to append them to the data included here, you'll need to open the CSV file and make some changes first. I used Google Sheets, so will include those instructions, but you can use whatever tool you prefer. 

## Data Processing

Format the finishing time as duration in seconds
Check for missing data
Create a pace column by dividing the finishing time by the distance
Create an AgeGroup field using this formula:
=if(C2<20,"U20",if(C2<25,"20-24",if(C2<30,"25-29",if(C2<35,"30-34",if(C2<40,"35-39",if(C2<45,"40-44",if(C2<50,"45-49",if(C2<55,"50-54",if(C2<60,"55-59",if(C2<65,"60-64",if(C2<70,"65-69",if(C2<75,"70-74",if(C2<80,"75-79","80+")))))))))))))
Concatenate an Age/Gender field
Add Year, Race, Distance fields
Create a RaceID field that's the first two digits of the year + the Race field
Concatenate RunnerID from Finish + RaceID
If appending to the master dataset from this repository, remove the name field before appending. 

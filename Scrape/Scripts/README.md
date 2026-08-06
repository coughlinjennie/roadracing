# Guide to the Analysis

NYRRclean.Rmd is an R notebook walking through the steps I took to clean the data compiled from the NYRR race results site 
- One race got was imported with names attached and was a 5K misclassified as a half, so I removed it, then removed the the Name field
- I also dropped a handful of results with blank name and age fields, which are typically celebrities or other high-profile runners where they don't want their names to be searchable in race results. Since they lack the age and gender fields, they wouldn't be useful anyway. 
- In my initial exploratory data analysis, there was one extreme outlier where the pace was more than 3 hours/mile and I removed that. 
- Finally, I realized that some of the half results were missing and because of time constraints, scaled back my analysis to exclude the half distance and removed those results from the dataset. 
- I then exported the remaining 459,812 records to a CSV file that is in the Data folder and was used for all analysis in the NYRR.Rmd notebook. 

NYRR.Rmd walks through all the analysis I did for the project. 
import json
import requests
from bs4 import BeautifulSoup as soup
import sys

companyName = sys.argv[1]
symbol = sys.argv[2]

try:
    parsedCompanyName = companyName.replace(",", "").replace(".", "").replace(" ", "+")

    url = "https://www.google.com/search?q=" + parsedCompanyName + "&source=lnms&tbm=nws"
    response = requests.get(url)

    html = soup(response.text, "html.parser")

    listOfSearchResults = html.findAll("div", class_="g")

    arrayOfDicts = []
    for result in listOfSearchResults:
        dictToAppend = {}
        dictToAppend.update({"headline" : result.find("h3").text})
        dictToAppend.update({"headline_url" : "google.com" + result.find("h3").find("a")["href"]})
        dictToAppend.update({"source_and_date" : result.find("span", class_="f").text})
        dictToAppend.update({"content" : result.find("div", class_="st").text})
        arrayOfDicts.append(dictToAppend)

    with open("./news/googleSearch_" + symbol + ".json", 'w') as json_file:
        json.dump(arrayOfDicts, json_file)

    print("./news/googleSearch_" + symbol + ".json")

except:
    print("something went wrong")

sys.stdout.flush()


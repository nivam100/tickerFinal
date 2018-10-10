from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup as soup
import requests
import re
import pandas as pd
import json
import datetime
import csv
import os
import sys
from threading import Thread
import time
import requests
from selenium import webdriver
import json

global dictOfSoups

def getUrlList():
    urls = []
    urls.append("https://www.tradingview.com/markets/stocks-usa/market-movers-gainers/")
    urls.append("https://marketchameleon.com/Reports/PremarketTrading")
    urls.append("https://www.tradingview.com/markets/stocks-usa/market-movers-losers/")
    urls.append("https://www.tradingview.com/markets/stocks-usa/market-movers-gainers/")
    urls.append("https://www.tradingview.com/markets/stocks-usa/market-movers-active/")
    return urls

def appendSoupToDictOfSoups(url):
    if url == "https://marketchameleon.com/Reports/PremarketTrading":
        driver = webdriver.Chrome(executable_path= r"/Users/nybgwrn/Desktop/chromedriver")
        driver.get("https://marketchameleon.com/Reports/PremarketTrading")
        time.sleep(2)
        toInsert = soup(driver.page_source, "html.parser")
        dictOfSoups.update({url : toInsert})
    else:
        url2link = requests.get(url)
        urlContent = soup(url2link.content,"html.parser")
        dictOfSoups.update({url : urlContent})
    

def getTrsForTopGainersMarketCharmilion():
    return dictOfSoups["https://marketchameleon.com/Reports/PremarketTrading"].find("table", id="gainers_tbl").findAll("tr")

def getTrsForTopLosersMarketCharmilion():
    return dictOfSoups["https://marketchameleon.com/Reports/PremarketTrading"].find("table", id="decliners_tbl").findAll("tr")

def getTrsForMostActiveMarketCharmilion():
    return dictOfSoups["https://marketchameleon.com/Reports/PremarketTrading"].find("table", id="most_active_tbl").findAll("tr")

def getTrsTopGainersTradingView(tableType):
    return dictOfSoups["https://www.tradingview.com/markets/stocks-usa/market-movers-" + tableType + "/"].find("table")

def getXAmountOfStocksCharmeleon(numberOfStocks, tableType):
    
    if tableType == "top gainers":
        trs = getTrsForTopGainersMarketCharmilion()
    elif tableType == "top losers":
        trs = getTrsForTopLosersMarketCharmilion()
    elif tableType == "most active":
        trs = getTrsForMostActiveMarketCharmilion()

    
    listOfHotStocks = []
    counter = 0
    counterOfFails = 0
    
    for tr in trs:
        while counter < numberOfStocks:
            try:
                stock = tr.find("td").text.lower()
                if not (stock == "spy" or stock == "qqq" or stock == "uslv" or stock == "uvxy" or stock == "sqqq"):
                    listOfHotStocks.append(tr.find("td").text.lower())
                    counter += 1
            except:
                counterOfFails += 1
                pass
            if counterOfFails > 100:
                break
    return listOfHotStocks

def getXAmountOfStocksTradingView(numberOfStocks, tableType):
    if tableType == "gainers":
        trs = getTrsTopGainersTradingView("gainers").findAll("tr")
    elif tableType == "losers":
        trs = getTrsTopGainersTradingView("losers").findAll("tr")
    elif tableType == "active":
        trs = getTrsTopGainersTradingView("active").findAll("tr")
    
    listOfHotStocks = []
    counter = 0
    counterOfFails = 0
    
    for tr in trs:
        while counter < numberOfStocks:
            try:
                stock = tr.find("a").text.lower()
                if not (stock == "spy" or stock == "qqq" or stock == "uslv" or stock == "uvxy" or stock == "sqqq"):
                    listOfHotStocks.append(tr.find("td").text.lower())
                    counter += 1
            except:
                counterOfFails += 1
                pass
            if counterOfFails > 100:
                break
    return listOfHotStocks

urls = getUrlList()
threadList = []
dictOfSoups = {}
listOfHotStocks = []

for url in urls:
    t = Thread(target = appendSoupToDictOfSoups, args= (url,))
    t.daemon = True
    t.start()
    threadList.append(t)
    
for t in threadList:
    t.join()

topStocks = list(set(getXAmountOfStocksCharmeleon(10, "top gainers") + getXAmountOfStocksCharmeleon(10, "top losers") + getXAmountOfStocksCharmeleon(10, "most active") + getXAmountOfStocksTradingView(10, "gainers") + getXAmountOfStocksTradingView(10, "losers") + getXAmountOfStocksTradingView(10, "active")))

topStocksFinal = []
for stock in topStocks:
    temp = stock.split("\n")
    if len(temp) == 1:
        topStocksFinal.append(temp[0])
    else:
        topStocksFinal.append(temp[1])

with open('hotStocks.json', 'w') as outfile:
    json.dump(topStocksFinal, outfile)

print("created file for hot stocks")
sys.stdout.flush()
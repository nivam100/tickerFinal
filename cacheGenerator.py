#--------------------------------------------------------------------
#                               IMPORTS
#--------------------------------------------------------------------

from urllib.request import urlopen as uReq
from concurrent.futures import ThreadPoolExecutor
from bs4 import BeautifulSoup as soup
import requests
import re
import pandas as pd
import json
import datetime
import csv
import os
import sys
import threading


#--------------------------------------------------------------------
#                              FUNCTIONS
#--------------------------------------------------------------------
    
class fillingsGetter(object):
    
    cik = ""
    start = ""
    end = ""
    trueOrFalse = ""

    isGoingConcern = False
    latestAccumulatedDeficit = False
    companyAddress = False
    totalLiabilities = False
    lastQIncome = False
    lastQRevenue = False
    lastQCash = False
    lastQCurrentAssets = False


    def __init__(self, cik, start, end, trueOrFalse):
        self.cik = cik
        self.start = start
        self.end = end
        self.trueOrFalse = trueOrFalse
        self.createJSON()

    def createJSON(self):
        stockSymbol = ""

        fileTypeToLink = self.getTypeToLink()
        dictForJson = {}
    
        with open('./assets/allStocks.json') as f:
            data = json.load(f)
            shouldContinue = True 
            for stock in data:
                if shouldContinue:
                    if stock["cik"] == self.cik:
                        dictForJson.update({"companyName" : stock["company_name"]})
                        stockSymbol = stock["symbol"]
                        shouldContinue = False
                else:
                    break
    
        if stockSymbol:
            reportNumber = 1

            try:
                for couple in fileTypeToLink:
                    if couple[0].lower() == "8-k" or couple[0].lower() == "8-k/a":
                        du =  self.getUrlOfReport(couple[1], "8-k")
                        urlOfReport = du[0]
                        htmlOfReport = self.cleanHrefToSec(str(self.getHtmlOfReport(urlOfReport)))
                        dictForJson.update({"reportNo" + str(reportNumber) : {"reportType" : couple[0], "url" : urlOfReport, "dateOfReport" : du[1], "content" : self.get8kSummery(urlOfReport), "htmlOfReport" : htmlOfReport}})
                        reportNumber += 1
                    elif couple[0].lower() == "4" or couple[0].lower() == "4/a":
                        urlOfReport = self.getUrlOfReport(couple[1], "4")
                        urlForView = self.getUrlOfReport(couple[1], "8-k")
                        form4dict = self.getForm4(urlOfReport)
                        dateOfReport = form4dict["dateOfReport"]
                        htmlOfReport = self.cleanHrefToSec(str(self.getHtmlOfReport(urlForView[0])))
                        dictForJson.update({"reportNo" + str(reportNumber): {"reportType" : "Form " + couple[0], "url" : urlForView, "content" : form4dict, "dateOfReport" : dateOfReport, "htmlOfReport" : htmlOfReport}})
                        reportNumber += 1
                    elif couple[0].lower() == "10-k" or couple[0].lower() == "10-k/a" or couple[0].lower() == "10-q" or couple[0].lower() == "10-q/a" or couple[0].lower() == "20-f":
                        du = self.getUrlOfReport(couple[1], "10-k/10-q")
                        urlOfReport = du[0]
                        htmlOfReport = self.cleanHrefToSec(str(self.getHtmlOfReport(urlOfReport)))
                        dictForJson.update({"reportNo" + str(reportNumber) :  {"reportType" : couple[0], "url" : urlOfReport, "dateOfReport" : du[1], "content" : self.get10kOr10q(urlOfReport), "htmlOfReport" : htmlOfReport}})
                        reportNumber += 1
                    elif couple[0].lower() == "424b2" or couple[0].lower() == "424b5" or couple[0].lower() == "424b4":
                        du = self.getUrlOfReport(couple[1], "424b")
                        urlOfReport = du[0]
                        htmlOfReport = self.cleanHrefToSec(str(self.getHtmlOfReport(urlOfReport)))
                        dictForJson.update({"reportNo" + str(reportNumber) : {"reportType" : couple[0], "url" : urlOfReport, "dateOfReport" : du[1], "content" : self.get424B2(urlOfReport), "htmlOfReport" : htmlOfReport}})
                        reportNumber += 1
                    elif couple[0].lower() == "def 14a" or couple[0].lower() == "def 14a/a":
                        du = self.getUrlOfReport(couple[1], "def 14a")
                        urlOfReport = du[0]
                        htmlOfReport = self.cleanHrefToSec(str(self.getHtmlOfReport(urlOfReport)))
                        dictForJson.update({"reportNo" + str(reportNumber) : {"reportType" : couple[0], "url" : urlOfReport, "dateOfReport" : du[1], "content" : self.getDef14A(urlOfReport), "htmlOfReport" : htmlOfReport}})
                        reportNumber += 1
                    else:
                        du = self.getUrlOfReport(couple[1], "any")
                        urlOfReport = du[0]
                        htmlOfReport = self.cleanHrefToSec(str(self.getHtmlOfReport(urlOfReport)))
                        if couple[0].lower() == "5" or couple[0].lower() == "3" or couple[0].lower() == "1" or couple[0].lower() == "15" or couple[0].lower() == "18" or couple[0].lower() == "25" or couple[0].lower() == "144" or couple[0].lower() == "c" or couple[0].lower() == "d":
                            dictForJson.update({"reportNo" + str(reportNumber) : {"reportType" : "Form " + str(couple[0]), "url" : urlOfReport, "dateOfReport" : du[1], "htmlOfReport" : htmlOfReport}})
                        else:
                            dictForJson.update({"reportNo" + str(reportNumber) : {"reportType" : str(couple[0]), "url" : urlOfReport, "dateOfReport" : du[1], "htmlOfReport" : htmlOfReport}})
                        reportNumber += 1

                #from finviz
                dictForJson.update({"companyProfile" : self.getCompanyProfile(stockSymbol)})
                dictForJson.update({"stockSymbol" : stockSymbol})

                #from Yahoo
                yahooHtml = self.getYahooStockPage(stockSymbol)
                theFloat = self.getFloat(yahooHtml)

                if theFloat:
                    dictForJson.update({"float" : theFloat})

                instOwn = self.getInstOwn(yahooHtml)

                if instOwn:
                    dictForJson.update({"instOwn" : instOwn})

                shortFloat = self.getShortFloat(yahooHtml)

                if shortFloat:
                    dictForJson.update({"shortFloat" : shortFloat})


                sharesOutstanding = self.getSharesOutstanding(self.cik)

                if sharesOutstanding:
                    dictForJson.update({"sharesOutstanding" : sharesOutstanding})

                if self.trueOrFalse == "y":
                    dictForJson.update({"graphStats" : self.get10kOr10qLists(self.cik)})

                if self.latestAccumulatedDeficit:
                    dictForJson.update({"accumulated deficit" : self.latestAccumulatedDeficit})

                if self.lastQRevenue:
                    dictForJson.update({"last q revenue" : self.lastQRevenue})

                if self.lastQIncome:
                    dictForJson.update({"last q income" : self.lastQIncome})

                if self.lastQCash:
                    dictForJson.update({"last q cash" : self.lastQCash})

                if self.lastQCurrentAssets:
                    dictForJson.update({"last q assets" : self.lastQCurrentAssets})

                if self.totalLiabilities:
                    dictForJson.update({"total liabilities" : self.totalLiabilities})

                dictForJson.update({"going concern" : self.isGoingConcern})

                if self.companyAddress:
                    dictForJson.update({"companyAddress" : self.companyAddress})



                forFile = int(self.start) + 10
                #/home/ubuntu/stocks/
                with open("./stocks/" + stockSymbol.lower() + "_" + self.start + "-" + str(forFile) + ".json", 'w') as json_file:
                    json.dump(dictForJson, json_file)

                print("created file for " + stockSymbol)
            except Exception as e: print(e)
        else:
            print("couldnt find " + str(self.cik))

    def cleanHrefToSec(self, string):
        
        array = string.split(" ")
        newArray = []
        for s in array:
            if "href" in s:
                #newArray.append('href="#"')
                pass
            else:
                newArray.append(s)

        stringBuilder = ""
        for s in newArray:
            stringBuilder += " " + s

        return stringBuilder

    def getTypeToLink(self):
    
        url = "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=" + self.cik + "&type=&dateb=&owner=include&start=" + self.start + "&count=" + self.end + "&output=atom"
        uClient = uReq(url)
        page_html = uClient.read()
        xml = soup(page_html, 'xml')
        uClient.close()

        try:
            self.companyAddress = re.sub(r'[ ]+$', "", re.sub(r'^[ ]+', "", xml.find("address", type="business").text.replace("\n", " ")))
        except:
            pass
    
        listOfEntries = xml.findAll("entry")
        fileTypeToLink = []
    
        for entry in listOfEntries:
            localList = []
            fileType = entry.find("category")['term']
            link = entry.find("link")['href']
            localList.append(fileType)
            localList.append(link)
            fileTypeToLink.append(localList)
    
        return fileTypeToLink

    def getUrlOfReport(self, url, typeOfForm):
    
        uClient = uReq(url)
        page_html = uClient.read()
        html = soup(page_html, 'html.parser')
        uClient.close()
        
        if typeOfForm == "8-k" or typeOfForm == "10-k/10-q" or typeOfForm == "424b" or typeOfForm == "def 14a" or typeOfForm == "any":
            return ["https://www.sec.gov" + html.find("table").findAll("a")[0]['href'], html.findAll("div", class_="info")[0].text]
        elif typeOfForm == "4": 
            return "https://www.sec.gov" + html.find("table").findAll("a")[1]['href']
        else:
            return False

    def get8kSummery(self, url):

        uClient = uReq(url)
        page_html = uClient.read()
        xml = soup(page_html, 'html.parser')
        uClient.close()

        string1 = self.getFinalItemIndex(xml, "Item")
        string2 = self.getFinalItemIndex(xml, "ITEM")

        if len(string1) > len(string2):
            xmlNeeded = soup(string1, 'html.parser')
        else: 
            xmlNeeded = soup(string2, 'html.parser')

        finalStrP = self.getFinalStr(xmlNeeded, "p")
        finalStrFont = self.getFinalStr(xmlNeeded, "font")
        finalStrDiv = self.getFinalStr(xmlNeeded, "div")

            
        maxLen = max(len(finalStrP), len(finalStrFont), len(finalStrDiv))
        if len(finalStrP) == maxLen:
            return finalStrP.replace("\xa0", "")
        elif len(finalStrFont) == maxLen:
            return finalStrFont.replace("\xa0", "")
        else:
            return finalStrDiv.replace("\xa0", "")

    def getHtmlOfReport(self, url):
        uClient = uReq(url)
        page_html = uClient.read()
        uClient.close()

        return soup(page_html, 'html.parser')

    def getForm4(self, url):
    
        uClient = uReq(url)
        page_html = uClient.read()
        uClient.close()

        xml = soup(page_html, 'xml')
        
        form4Dict = {}
        
        
        form4Dict.update({"nameOfOwner": self.getTextFromXML("rptOwnerName", xml)})
        form4Dict.update({"position": self.getTextFromXML("officerTitle", xml)})
        form4Dict.update({"dateOfReport" : self.getTextFromXML("periodOfReport", xml)})
        
        nonDerivativeTransactions = xml.findAll("nonDerivativeTransaction")
        index = 1
        for transaction in nonDerivativeTransactions:
            form4InnerDict = {}
            form4InnerDict.update({"classOfStock": self.getTextFromXML("securityTitle", transaction)})
            form4InnerDict.update({"transactionDate": self.getTextFromXML("transactionDate", transaction)})
            form4InnerDict.update({"amount": self.getTextFromXML("transactionShares", transaction)})
            form4InnerDict.update({"price": self.getTextFromXML("transactionPricePerShare", transaction)})
            form4InnerDict.update({"buyOrSell": self.getTextFromXML("transactionAcquiredDisposedCode", transaction)})
            form4InnerDict.update({"ownershipAfterTransaction": self.getTextFromXML("sharesOwnedFollowingTransaction", transaction)})
            form4Dict.update({"transaction" + str(index) : form4InnerDict})
            index += 1
        
        derivativeTransactions = xml.findAll("derivativeTransaction")
       
        for transaction in derivativeTransactions:
            form4InnerDict = {}
            form4InnerDict.update({"classOfStock": self.getTextFromXML("securityTitle", transaction)})
            form4InnerDict.update({"transactionDate": self.getTextFromXML("transactionDate", transaction)})
            form4InnerDict.update({"amount": self.getTextFromXML("transactionShares", transaction)})
            form4InnerDict.update({"price": self.getTextFromXML("transactionPricePerShare", transaction)})
            form4InnerDict.update({"buyOrSell": self.getTextFromXML("transactionAcquiredDisposedCode", transaction)})
            form4InnerDict.update({"ownershipAfterTransaction": self.getTextFromXML("sharesOwnedFollowingTransaction", transaction)})
            form4Dict.update({"transaction" + str(index) : form4InnerDict})
            index += 1
        
        return form4Dict

    def getFinalItemIndex(self, xml, lookFor):
        index = 0
        startIndex = str(xml).find(lookFor, 0)
        endIndex = startIndex
        foundMore = False
        while str(xml).find(lookFor, endIndex + 1) != -1:
            endIndex = str(xml).find(lookFor, endIndex + 1)
            foundMore = True
        if foundMore:
            return str(xml)[startIndex:endIndex]
        else:
            return str(xml)[startIndex:]

    def getFinalStr(self, xmlNeeded, tag):
        finalStr = ""
        for element in xmlNeeded.findAll(tag):
            if element.text != 160:
                finalStr += element.text
        return finalStr

    def getTextFromXML(self, tag, xml):
        try:
            return str(xml.find(tag).text.replace("\n", ""))
        except: 
            return False

    def get10kOr10q(self, url):

        dictToReturn = {}
        uClient = uReq(url)
        page_html = uClient.read()
        uClient.close()

        xml = soup(page_html, 'html.parser')

        inThousands = False
        inMillions = False

        # for balance sheet
        listOfBreakPointsForConsolidatedBalanceSheet = ["assets", "current"]
        listOfWordsToSearchInsideBalanceSheet = ["Current assets:", "Current Assets:", "CURRENT ASSETS:", "Current Assets", "Total current assets", "CURRENT ASSETS"]
        listOfWordsToSearchHeadersBalanceSheet = ["CONSOLIDATED BALANCE SHEETS", "CONSOLIDATED BALANCE SHEET DATA", "CONDENSED CONSOLIDATED BALANCE SHEETS"]
        downGradeStringBalanceSheet = "As Previously Reported"

        #for balancesheet probabilities function
        listOfWordsBalanceSheet = ["Cash and cash equivalents","Total current assets","Total assets","Total current liabilities","Total liabilities and equity","Accounts payable","Current liabilities:","Property and equipment, net","Commitments and contingencies","Current Assets:","Assets","Other assets, net","Accumulated deficit","Total liabilities and shareholders’ equity","Inventories, net","Other current assets","Current portion of long-term debt","Other liabilities and accrued expenses","Accrued liabilities other","Accounts receivable, net","Restricted cash","Liabilities and Equity","Long-term debt, net of current portion","Additional paid-in capital","Deferred revenue","Total liabilities and stockholders' equity:","Accounts receivable","Prepaid expenses","Noncurrent deferred tax asset","Asset retirement obligation","Total equity","Goodwill","Accrued compensation","Property, plant and equipment, net","Other non-current liabilities","Shareholders’ equity:","Retained earnings","Total shareholders’ equity","Prepaid expenses and other current assets","Non-current portion of deferred rent"]
        listOfProbabilitiesBalanceSheet = [0.77, 1, 1, 1, 1, 0.88, 0.77, 0.66, 0.66, 0.55, 0.55, 0.55, 0.55, 0.55, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.33, 0.33, 0.33, 0.33, 0.33, 0.33, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22]

        balanceSheetTable = self.getTableWithProbabilities(xml, listOfWordsBalanceSheet, listOfProbabilitiesBalanceSheet, listOfWordsToSearchHeadersBalanceSheet, False, downGradeStringBalanceSheet)

        if not balanceSheetTable:
            balanceSheetTable = self.getTable(listOfWordsToSearchInsideBalanceSheet, listOfWordsToSearchHeadersBalanceSheet, xml)

        if balanceSheetTable:
            #print(balanceSheetTable)
            inThousands = self.isInThousands(balanceSheetTable)
            if not inThousands:
                inMillions = self.isInMillions(balanceSheetTable)

        dictToReturn.update({"isInThousands" : str(inThousands).lower()})
        dictToReturn.update({"isInMillions" : str(inMillions).lower()})

        
        tableContinuation = self.getTableCont(xml)

        # for statement of operations
        inThousands = False
        inMillions = False

        listOfBreakPointsForOperations = ["revenue", "net operating revenues:", "expenses", "net sales", "cost of sales", "revenues", "net loss", "net revenue", "operating activities:", "costs and expenses:"]
        listOfWordsToSearchInsideOperations = ["Net operating revenues:", "Weighted average shares outstanding:", "Net revenues", "Net Revenues", "Gross Profit", "Gross profit", "EXPENSES", "Net sales", "Operating Revenues", "COSTS AND EXPENSES:", "Revenues:", "Net revenue:", "Costs and expenses:", "Net revenues", "Weighted shares used in the computation of net loss per share:", "Cost of sales", "Gross profit", "Weighted average shares outstanding - diluted", "Weighted average shares outstanding - basic", "Condensed Consolidated Statements of Operations and Comprehensive Loss", "Sales", "Revenues"]
        listOfWordsToSearchHeadersOperations = ["Condensed Consolidated Statements of Operations (Unaudited)", "Consolidated Statements of Loss and Comprehensive Loss", "CONDENSED CONSOLIDATED STATEMENTS OF OPERATIONS (Unaudited)", "Consolidated Statements of Loss and Comprehensive Loss", "CONSOLIDATED STATEMENTS OF OPERATIONS", "CONDENSED CONSOLIDATED STATEMENTS OF OPERATIONS", "Condensed Statements of Operations and Comprehensive Loss", "CONSOLIDATED STATEMENTS OF OPERATIONS", "CONSOLIDATED STATEMENTS OF COMPREHENSIVE INCOME (LOSS)", "CONSOLIDATED STATEMENTS OF COMPREHENSIVE INCOME", "Consolidated Statements of Income and Comprehensive Income", "CONDENSED CONSOLIDATED STATEMENTS OF OPERATIONS AND"]
        downGradeStringOperations = "As Previously Reported"

        #for probabilities function
        listOfWordsOperations = ["basic and diluted net loss per common share","total operating expenses","net loss before income taxes","selling, general and administrative expenses","net revenue:","net revenues:","less net loss attributable to non-controlling interest in subsidiary","Research and development expenses","gross profit","total net operating revenues","interest expense, net","cost of sales","net operating revenues:","other income, net","net loss","shares used in computation of basic and diluted net loss per","net income (loss)","loss from operations","weighted-average common shares outstanding","weighted-average number of common shares outstanding","waste management services","food, beverage and merchandise sales","total golf and related operations","costs and expenses:","depreciation and amortization expense","provision for income taxes","weighted average shares outstanding","gross margin","operating income (loss)","income before provision for income taxes","net loss per share to common stockholders:","income tax expenses","total net revenue","sales and marketing expenses","cost of revenues", "Oil and natural gas", "revenues:", "Net (loss) earnings", "three months ended", "six months ended", "nine months ended", "OTHER INCOME (EXPENSE)", "NET (LOSS) INCOME", "WEIGHTED AVERAGE SHARES:", "Oil, natural gas, and related product sales", "Revenues and other income", "Net income", "income tax provision", "Weighted average common shares outstanding", "revenue", "Research and development expenses", "General and administrative expenses"]
        listOfProbabilitiesOperations = [0.81, 0.72, 0.63, 0.54, 0.54, 0.54, 0.45, 0.45, 0.45, 0.36, 0.36, 0.36, 0.27, 0.27, 0.27, 0.27, 0.27, 0.27, 0.27, 0.27, 0.18, 0.18, 0.18, 0.18,0.18,0.18,0.18,0.18,0.18,0.18,0.18,0.18,0.18,0.18,0.27, 0.25, 0.25, 0.25, 0.20, 0.20, 0.20, 0.31, 0.40, 0.4, 0.4, 0.35, 0.27, 0.18, 0.55, 0.2, 0.35, 0.35]

        operationsTable = self.getTableWithProbabilities(xml, listOfWordsOperations, listOfProbabilitiesOperations, listOfWordsToSearchHeadersOperations, False, downGradeStringOperations)
        if not operationsTable:
            operationsTable = self.getTable(listOfWordsToSearchInsideOperations, listOfWordsToSearchHeadersOperations, xml)
        
        if operationsTable:
            #print(operationsTable)
            inThousands = self.isInThousands(operationsTable)
            if not inThousands:
                inMillions = self.isInMillions(operationsTable)

        #operationsDict = getDict(operationsTable, inThousands, inMillions, listOfBreakPointsForOperations)

        #print("#####################################################################################################################")
        #print("BALANCE SHEET:")
        #print("#####################################################################################################################")
        #print(balanceSheetDict)
        #print("#####################################################################################################################")
        #print("OPERATIONS REPORT:")
        #print("#####################################################################################################################")
        #print(operationsDict)


        #for warrants

        downGradeStringWarrants = "options"
        listOfHeadersWarrants = ["stock warrants", "common stock warrants"]
        listOfWordsInsideWarrantsTable = ["outstanding at", "granted", "forfeited", "exercisable at", "Forfeited or expired" "weighted average exercise price", "exercise price", "expiration date", "number of shares issuable upon exercise of outstanding warrants", "offering", "warrants outstanding", "exercise price ($)", "intrinsic value", "issued", "Exercised", "expired", "warrants", "expires on"]
        listOfProbabilitiesWarrants = [0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8, 0.8, 0.8]

        warrantsTable = self.getTableWithProbabilities(xml, listOfWordsInsideWarrantsTable, listOfProbabilitiesWarrants, listOfHeadersWarrants, True, downGradeStringWarrants)
        
        
        #for cash flow table
        listOfHeadersCashFlow = ["Condensed Consolidated Statements of Cash Flows (Unaudited)", "Condensed Consolidated Statements of Cash Flows", "Consolidated Statements of Cash Flows", "Consolidated Statements of Cash Flows (Unaudited)", "CONSOLIDATED STATEMENTS OF CASH FLOWS", "CONSOLIDATED STATEMENTS OF CASH FLOWS (UNAUDITED)"]
        listOfWordsInsideCashFlowTable = ["Cash flows from operating activities:", "Net loss", "Net income (loss)", "Reconciliation of net loss to cash provided by operating activities:", "Depreciation and amortization expense", "Amortization of debt issuance costs", "Compensation costs - stock options", "Deferred rental income", "Provision for losses on accounts receivable", "Gain from disposal of vehicle", "Change in operating assets and liabilities:", "Unbilled membership dues receivable", "Inventories", "Prepaid expenses", "Refundable income taxes", "Other assets", "Accounts payable", "Accrued payroll and other compensation", "Accrued income taxes", "Other accrued taxes", "Deferred membership dues revenue", "Other liabilities and accrued expenses", "Net cash provided by operating activities", "Cash flows from investing activities:", "Capital expenditures"]
        listOfProbabilitiesCashFlow = [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8]
        listOfBreakPointsForCashFlow = ["Operating Activities", "Net income (loss)", "net income", "Depreciation", "Deferred taxes", "Cash flows from operating activities:", "Inventories", "inventory", "deffered"]
        
        cashFlowTable = self.getTableWithProbabilities(xml, listOfWordsInsideCashFlowTable, listOfProbabilitiesCashFlow, listOfHeadersCashFlow, False, "thisIsSomeWordsTheWeWontFind")
            
        #print("#####################################################################################################################")
        #print("WARRANTS:")
        #print("#####################################################################################################################")
        #print(warrantsTable)
        #dictToReturn.update({"balanceSheet" : balanceSheetDict})
        #listToReturn.append(balanceSheetDict)
        #listToReturn.append(str(balanceSheetTable))
        dictToReturn.update({"balanceSheetTableCode" : str(balanceSheetTable)})
        #listToReturn.append(operationsDict)
        #dictToReturn.update({"operations" : operationsDict})
        #listToReturn.append(str(operationsTable))
        dictToReturn.update({"operationsTableCode" : str(operationsTable)})
        #listToReturn.append(str(warrantsTable))
        dictToReturn.update({"warrantsTableCode" : str(warrantsTable)})
        dictToReturn.update({"cashFlowTable" : str(cashFlowTable)})
        
        return dictToReturn


    def getTableWithProbabilitiesOffering(self, xml, listOfWords, listOfProbabilities, listOfWordsToSearchHeadersOperations, isForWarrants, downGradeString):
        listOfTables = xml.findAll("table")
        maxTableGrade = -1
        chosenTable = ""

        for table in listOfTables:
            listToIterate = listOfWords[:]
            currentGrade = 0
            tds = table.findAll("td")
            for td in tds:
                theWord = re.sub(r'[\xa0]', "", re.sub(r'[ ]$', "", re.sub(r'^[ ]', "", td.text.replace("\n", "").lower())))
                for i in range(0, len(listToIterate)):
                    if (listToIterate[i].lower() in theWord.lower()) and len(theWord) > 4:
                        #print("<p>graded " + theWord + " ----> " + listToIterate[i] + ", and the grade is: " + str(listOfProbabilities[i]) + "</p>")
                        currentGrade += listOfProbabilities[i]   
                        listToIterate[i] = "-1-1-1-1-1-1-1--1-1-1-1"
            
            #for debugging the grading system:
            
            #print("<p>################################################################################</p>")
            #print("<p>GRADE: " + str(currentGrade) + "</p>")
            #print("<p>################################################################################</p>")
            #print("The table is:")
            #print(table)
            #print("<p>################################################################################</p>")
            
            if currentGrade > maxTableGrade:
                maxTableGrade = currentGrade
                chosenTable = table
        if isForWarrants:    
            if maxTableGrade > 1:
                return chosenTable
            else: 
                return False
        else:
            #print("The winning grade is: " + str(maxTableGrade))
            return chosenTable


    def getTable(self, listOfWordsToSearchInside, listOfWordsToSearchHeaders, xml):
    
        theTable = self.getTableFromTheHeader(xml, listOfWordsToSearchHeaders)
        
        if not theTable:
            
            theTable = self.getTableFromTheInside(xml, listOfWordsToSearchInside)
        
        if theTable: 
            return theTable
        else:
            return False

    def getTableFromTheHeader(self, xml, listOfWordsToSearchHeaders):
        for word in listOfWordsToSearchHeaders:
            tempTable = xml.find("p", string=word) or xml.find("font", string=word) or xml.find("td", string=word) or xml.find("div", string=word)
            if tempTable:
                return tempTable.findNext("table")
        
        return False


    def getTableFromTheInside(self, xml, listOfWordsToSearchInside):
        for word in listOfWordsToSearchInside:
            tempTable = xml.findAll("td", string=word) or xml.findAll("p", string=word) or xml.findAll("font", string=word) or xml.findAll("div", string=word)
            if tempTable:
                return tempTable[0].findParents("table")[0]

        return False

    def isInThousands(self, table):
        #case that thousands is inside the table
        counterForMarcher = 0
        wrapperDiv = table.parent
        if "thousands" in str(wrapperDiv):
            return True
        
        wasException = False
        
        #case that thousands is in one of the previous elements
        while counterForMarcher < 15:
            wasException = False
            try:
                wrapperDiv = wrapperDiv.previous_sibling
            except:
                wasException = True
            if not wasException and "thousands" in str(wrapperDiv).lower() and not "millions" in str(wrapperDiv).lower():
                return True
            else:
                counterForMarcher += 1

        wrapperDiv = table.parent.parent
        counterForMarcher = 0
        wasException = False

        while counterForMarcher < 15:
            wasException = False
            try:
                wrapperDiv = wrapperDiv.previous_sibling
            except:
                wasException = True
                
            if not wasException and "thousands" in str(wrapperDiv).lower() and not "millions" in str(wrapperDiv).lower():
                return True
            else:
                counterForMarcher += 1
        return False

    def isInMillions(self, table):
        
        wrapperDiv = table.parent
        if "millions" in str(wrapperDiv):
            return True
            
        counterForMarcher = 0
        wasException = False

        while counterForMarcher < 15:
            wasException = False
            try:
                wrapperDiv = wrapperDiv.previous_sibling
            except:
                wasException = True

            if not wasException and "millions" in str(wrapperDiv).lower():
                return True
            else:
                counterForMarcher += 1
            # 2 parents test
        wrapperDiv = table.parent.parent
        counterForMarcher = 0
        wasException = False

        while counterForMarcher < 15:
            wasException = False
            try:
                wrapperDiv = wrapperDiv.previous_sibling
            except:
                wasException = True
            if "millions" in str(wrapperDiv).lower():
                return True
            else:
                counterForMarcher += 1
        return False

    def getTableWithProbabilities(self, xml, listOfWords, listOfProbabilities, listOfWordsToSearchHeadersOperations, isForWarrants, downGradeString):
        listOfTables = xml.findAll("table")
        maxTableGrade = -1
        chosenTable = ""

        for table in listOfTables:
            listToIterate = listOfWords[:]
            currentGrade = 0
            tds = table.findAll("td")
            for td in tds:
                theWord = re.sub(r'[\xa0]', "", re.sub(r'[ ]$', "", re.sub(r'^[ ]', "", td.text.replace("\n", "").lower())))
                for i in range(0, len(listToIterate)):
                    if (listToIterate[i].lower() in theWord.lower()) and len(theWord) > 4:
                        #print("<p>graded " + theWord + " ----> " + listToIterate[i] + ", and the grade is: " + str(listOfProbabilities[i]) + "</p>")
                        currentGrade += listOfProbabilities[i]   
                        listToIterate[i] = "-1-1-1-1-1-1-1--1-1-1-1"
                if downGradeString.lower() in theWord:
                    currentGrade -= 0.8
            tableSiblings = self.getListOfPrevSibling(table)
            for sibling in tableSiblings:
                onlyOnce = True
                for word in listOfWordsToSearchHeadersOperations:
                    try:
                        if (word.lower() in sibling.text.lower()) and onlyOnce and (len(sibling.text.lower()) > 6):
                            currentGrade += 0.8
                            #print("<p>graded " + sibling.text.lower() + " ----> " + word.lower() + ", and the grade is 0.8")
                            onlyOnce = False
                    except:
                        pass
            
            #for debugging the grading system:
            
            #print("<p>################################################################################</p>")
            #print("<p>GRADE: " + str(currentGrade) + "</p>")
            #print("<p>################################################################################</p>")
            #print("The table is:")
            #print(table)
            #print("<p>################################################################################</p>")
            
            if currentGrade > maxTableGrade:
                maxTableGrade = currentGrade
                chosenTable = table
        if isForWarrants:    
            if maxTableGrade > 2:
                return chosenTable
            else: 
                return False
        else: 
            return chosenTable



    def getListOfPrevSibling(self, table):
        listOfSiblings = []
        index = 0
        marcher = table.parent
        if marcher: 
            marcher = marcher.previous_sibling
        if marcher:
            while index < 30:
                listOfSiblings.append(marcher)
                if marcher:
                    marcher = marcher.previous_sibling
                index += 1
        return listOfSiblings


    def get424B2(self, url):
        uClient = uReq(url)
        page_html = uClient.read()
        xml = soup(page_html, 'html.parser')
        uClient.close()
        logoLocation = self.getLogoLocation(url, xml)

        listOfBs = self.getNumberOfSharesOfferedList(xml, "b")
        if len(listOfBs) == 0:
            listOfBs = self.getNumberOfSharesOfferedList(xml, "p")
        
        listOfWordsOffering = ["Public offering price", "Underwriting discount", "per class A unit", "per class b unit", "per unit", "Placement agent fee", "Offering price", "Placement agent’s fees", "Proceeds" , "Per Ordinary Share", "Subscription price"]
        listOfProbabilitiesOffering = [0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8, 0.8]
        table = self.getTableWithProbabilitiesOffering(xml, listOfWordsOffering, listOfProbabilitiesOffering, ["someRabdomNoise"], True, "someRandomNoise")

        offeringDict = {}
        offeringDict.update({"logoAddress" : logoLocation})
        offeringDict.update({"sharesOffered" : str(listOfBs)})
        if table: 
            offeringDict.update({"tableCode" : str(table)})
        offeringDict.update({"html": str(xml.find("div"))})
        return offeringDict

    def getLogoLocation(self, url, xml):

        logo = xml.findAll("img")[0]['src']
        return url[:url.rfind('/')] + "/" + logo

    def getNumberOfSharesOfferedList(self, xml, tagName):
        listOfBs = []
        firstAdd = False
        for text in xml.findAll(tagName):
            firstBreakPoint = True
            secondBreakPoint = True
            currentGradeOfBold = 0
            for word in text.text.split():
                if word.lower().replace(",", "").replace("$", "").isdigit() and "," in word:
                    if firstBreakPoint:
                        currentGradeOfBold += 1
                        firstBreakPoint = False
                if "stock" in word.lower() or "preffered" in word.lower() or "warrants" in word.lower() or "common" in word.lower() or "shares" in word.lower() or "unit" in word.lower() or "units" in word.lower() or "$" in word.lower():
                    if secondBreakPoint:
                        currentGradeOfBold += 1
                        secondBreakPoint = False
            if currentGradeOfBold > 1:
                firstAdd = True
                listOfBs.append(text.text.replace("\n", " ").replace("\xa0", " "))
            else:
                if firstAdd:
                    break
        return listOfBs


    def getDef14A(self, url):
        dictToReturn = {}
        uClient = uReq(url)
        page_html = uClient.read()
        uClient.close()

        xml = soup(page_html, 'html.parser')


        listOfHeadersToSearchControl = ["VOTING SECURITIES AND PRINCIPAL HOLDERS THEREOF", "STOCK OWNERSHIP OF MANAGEMENT", "SECURITY OWNERSHIP OF CERTAIN BENEFICIAL OWNERS AND MANAGEMENT", "PRINCIPAL SHAREHOLDERS", "SECURITY OWNERSHIP OF CERTAIN BENEFICIAL OWNERS", "SECURITY OWNERSHIP OF MANAGEMENT"]
        listOfTableWordsToSearchControl = ["5% or Greater Stockholders", "Name of Beneficial Owner", "All current officers and directors as a group", "Amount and Nature of Beneficial Ownership", "Percent of Class", "number of shares", "Percent of shares", "5% Stockholders", "Directors and Named Executive Officers", "Name of Beneficial Owner", "Senior Management and Directors", "All senior management and directors as a group", "5% or More Shareholders", "Name and Address", "Number of Shares Owned", "Percent of Shares outstanding", "Name of Beneficial Owner", "Named Executive Officers and Directors", "All Executive Officers and Directors as a group", "All directors and executive officers as a group", "Amount and Nature of Beneficial Ownership", "Name and Address of Beneficial Owner", "Percentage", "All directors and officers as a group", "Amount and Nature of Beneficial Ownership of Common Stock", "ercent of Common Stock", ]
        listOfProbabilitiesControl = [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8 , 0.8, 0.8, 0.8, 0.8, 0.8]
        listOfBreakPointsControl = ["Directors and Executive Officers:"]
        downGradeStringOperations = "As Previously Reported"

        ownershipTable = self.getTableWithProbabilitiesDef14A(xml, listOfTableWordsToSearchControl, listOfProbabilitiesControl, listOfHeadersToSearchControl, True, downGradeStringOperations)
        #listToReturn.append(str(ownershipTable))
        if ownershipTable:
            dictToReturn.update({"ownershipTableCode" : str(ownershipTable)})
        ownershipDict = False
        
        if ownershipTable:
            ownershipDict = self.getDictFromDEF14A(ownershipTable)
        
        if ownershipDict:
            dictToReturn.update({"content" : ownershipDict})
        
        return dictToReturn

    def getTableWithProbabilitiesDef14A(self, xml, listOfWords, listOfProbabilities, listOfWordsToSearchHeadersOperations, isForWarrants, downGradeString):
        listOfTables = xml.findAll("table")
        maxTableGrade = -1
        chosenTable = ""

        for table in listOfTables:
            listToIterate = listOfWords[:]
            currentGrade = 0
            tds = table.findAll("td")
            for td in tds:
                theWord = re.sub(r'[\xa0]', "", re.sub(r'[ ]$', "", re.sub(r'^[ ]', "", td.text.replace("\n", "").lower())))
                for i in range(0, len(listToIterate)):
                    if (listToIterate[i].lower() in theWord.lower()) and len(theWord) > 4:
                        #print("<p>graded " + theWord + " ----> " + listToIterate[i] + ", and the grade is: " + str(listOfProbabilities[i]) + "</p>")
                        currentGrade += listOfProbabilities[i]   
                        listToIterate[i] = "-1-1-1-1-1-1-1--1-1-1-1"
                if downGradeString.lower() in theWord:
                    currentGrade -= 0.8
            tableSiblings = self.getListOfPrevSibling(table)
            for sibling in tableSiblings:
                onlyOnce = True
                for word in listOfWordsToSearchHeadersOperations:
                    try:
                        if (word.lower() in sibling.text.lower()) and onlyOnce and (len(sibling.text.lower()) > 6):
                            currentGrade += 0.8
                            #print("<p>graded " + sibling.text.lower() + " ----> " + word.lower() + ", and the grade is 0.8")
                            onlyOnce = False
                    except:
                        pass
            
            #for debugging the grading system:
            
            #print("<p>################################################################################</p>")
            #print("<p>GRADE: " + str(currentGrade) + "</p>")
            #print("<p>################################################################################</p>")
            #print("The table is:")
            #print(table)
            #print("<p>################################################################################</p>")
            
            if currentGrade > maxTableGrade:
                maxTableGrade = currentGrade
                chosenTable = table
        if isForWarrants:    
            if maxTableGrade > 1.5:
                return chosenTable
            else:
                return False
        else:
            return chosenTable


    def getCompanyProfile(self, stockSymbol):
        url = 'https://finviz.com/quote.ashx?t=' + stockSymbol
        uClient = uReq(url)
        page_html = uClient.read()
        uClient.close()
        xml = soup(page_html, 'html.parser')
        
        return xml.find("td", class_="fullview-profile").text

    def getYahooStockPage(self, stockSymbol):
        url = "https://finance.yahoo.com/quote/" + stockSymbol + "/key-statistics?p=" + stockSymbol
        uClient = uReq(url)
        page_html = uClient.read()
        uClient.close()
        
        return soup(page_html, 'html.parser')

    def getFloat(self, html):
    
        allTds = html.findAll("td")
        theFloat = False
        for td in allTds:
            if td.text.replace(" ", "").lower() == "float":
                try:
                    theFloat = td.next_sibling.text
                except:
                    pass
                
        return theFloat


    def getInstOwn(self, html):
        allTds = html.findAll("td")
        heldByInstitutions = False
        for td in allTds:
            if "% Held by Institutions".lower() in td.text.lower():
                heldByInstitutions = td.next_sibling.text
        return heldByInstitutions

    def getShortFloat(self, html):
    
        allTds = html.findAll("td")
        shortFloat = False
        for td in allTds:
            if "Short % of Float".lower() in td.text.lower():
                shortFloat = td.next_sibling.text
                
        return shortFloat


    def getSharesOutstanding(self, stockSymbol):
    
        url = "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=" + stockSymbol + "&type=&dateb=&owner=exclude&start=0&count=40&output=atom"
        uClient = uReq(url)
        page_html = uClient.read()
        uClient.close()
        
        html = soup(page_html, 'html.parser')
        
        entries = html.findAll("entry")
        shares_outstanding_final = False

        for entry in entries:        
            if entry.find("category")["term"].lower() == "10-k" or entry.find("category")["term"].lower() == "10-q" or entry.find("category")["term"].lower() == "20-f":
                firstUrl = entry.find("link")["href"]
                uClientFirstUrl = uReq(firstUrl)
                page_html_firstUrl = uClientFirstUrl.read()
                uClientFirstUrl.close()
                htmlFirstUrl = soup(page_html_firstUrl, 'html.parser')
                    
                urlOfXml = "https://www.sec.gov" + htmlFirstUrl.findAll("table")[1].find("a")["href"]
                uClientXml = uReq(urlOfXml)
                page_xml = uClientXml.read()
                uClientXml.close()
                
                xml = soup(page_xml, 'xml')
                sharesOutstanding_list = xml.findAll("dei:EntityCommonStockSharesOutstanding")
                shares_outstanding_final = sharesOutstanding_list[0].text
                return shares_outstanding_final
        
        return shares_outstanding_final


    def get10kOr10qLists(self, stockSymbol):
        firstTimeInBalanceSheet= True
        firstTimeInOperations = True
        url = "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=" + stockSymbol + "&type=&dateb=&owner=exclude&start=0&count=80&output=atom"
        uClient = uReq(url)
        page_html = uClient.read()
        uClient.close()
        
        html = soup(page_html, 'html.parser')
        
        entries = html.findAll("entry")
        dictOfDicts = {}
        dictOfCash = {}
        dictOfAssets = {}
        dictOfNetIncome = {}
        dictOfRevenue = {}
        for entry in entries:        
            if entry.find("category")["term"].lower() == "10-k" or entry.find("category")["term"].lower() == "10-q" or entry.find("category")["term"].lower() == "20-f":
                firstUrl = entry.find("link")["href"]
                #thread
                uClientFirstUrl = uReq(firstUrl)
                page_html_firstUrl = uClientFirstUrl.read()
                uClientFirstUrl.close()
                htmlFirstUrl = soup(page_html_firstUrl, 'html.parser')
                
                dateOfReport = htmlFirstUrl.findAll("div", class_="info")[0].text
                qurterAndYear = self.getQurterAndYear(dateOfReport)
                    
                urlOfXml = "https://www.sec.gov" + htmlFirstUrl.findAll("table")[0].find("a")["href"]
                
                uClientReport = uReq(urlOfXml)
                page_html_report = uClientReport.read()
                uClientReport.close()
                htmlReport = soup(page_html_report, 'html.parser')

                if firstTimeInBalanceSheet:
                    foundGoingConcern = htmlReport.text.find("going concern")
                    if foundGoingConcern != -1:
                        self.isGoingConcern = True
            
                # get balance sheet table
                balanceSheetTable = self.getBalanceSheetTable(htmlReport)
                # get dict from balance sheet table
                balanceSheetDict = self.getBalanceSheetDict(balanceSheetTable, htmlReport)
                # get operations table
                operationsTable = self.getStatementOfOperationsTable(htmlReport)
                # get dict from operations table
                inThousands = False
                inMillions = False
                if operationsTable:
                    inThousands = self.isInThousands(operationsTable)
                    if not inThousands:
                        inMillions = self.isInMillions(operationsTable)
            
                listOfBreakPointsForOperations = ["revenue", "net operating revenues:", "expenses", "net sales", "cost of sales", "revenues", "net loss", "net revenue", "operating activities:", "costs and expenses:"]
                operationsDict = self.getDict(operationsTable, inThousands, inMillions, listOfBreakPointsForOperations)
                if balanceSheetDict:
                    currentCash = self.getLatestStatFromDict(balanceSheetDict, "cash")
                    currentAssets = self.getLatestStatFromDict(balanceSheetDict, "assets")
                    dictOfCash.update({qurterAndYear : currentCash})
                    dictOfAssets.update({qurterAndYear : currentAssets})
                    if firstTimeInBalanceSheet:
                        self.latestAccumulatedDeficit = self.getLatestStatFromDict(balanceSheetDict, "accumulated deficit")
                        self.totalLiabilities = self.getLatestStatFromDict(balanceSheetDict, "total liabilities")
                        self.lastQCash = currentCash
                        self.lastQCurrentAssets = currentAssets
                        firstTimeInBalanceSheet = False
            
                if operationsDict:
                    currentIncome = self.getLatestStatFromDict(operationsDict, "net income")
                    currentRevenue = self.getLatestStatFromDict(operationsDict, "revenue")
                    dictOfNetIncome.update({qurterAndYear : currentIncome})
                    dictOfRevenue.update({qurterAndYear : currentRevenue})
                    if firstTimeInOperations:
                        self.lastQIncome = currentIncome
                        self.lastQRevenue = currentRevenue
                        firstTimeInOperations = False
        
            
        
        dictOfDicts.update({"cash" : dictOfCash})
        dictOfDicts.update({"assets" : dictOfAssets})
        dictOfDicts.update({"net income" : dictOfNetIncome})
        dictOfDicts.update({"revenue" : dictOfRevenue})
        
        return dictOfDicts

    def getQurterAndYear(self, date):
        dateArray = date.split("-")
        q = ""
        year = dateArray[0]
        month = dateArray[1]
        month = int(month.replace("0", ""))
        if month > 0 and month < 4:
            q = "Q1"
        elif month > 3 and month < 7:
            q = "Q2"
        elif month > 6 and month < 10:
            q = "Q3" 
        elif month > 9 and month < 13:
            q = "Q4"
        return q + " " + year

    def getBalanceSheetTable(self, xml):

        # for balance sheet
        
        listOfWordsToSearchInsideBalanceSheet = ["Current assets:", "Current Assets:", "CURRENT ASSETS:", "Current Assets", "Total current assets", "CURRENT ASSETS"]
        listOfWordsToSearchHeadersBalanceSheet = ["CONSOLIDATED BALANCE SHEETS", "CONSOLIDATED BALANCE SHEET DATA", "CONDENSED CONSOLIDATED BALANCE SHEETS"]
        downGradeStringBalanceSheet = "As Previously Reported"

        #for balancesheet probabilities function
        listOfWordsBalanceSheet = ["Cash and cash equivalents","Total current assets","Total assets","Total current liabilities","Total liabilities and equity","Accounts payable","Current liabilities:","Property and equipment, net","Commitments and contingencies","Current Assets:","Assets","Other assets, net","Accumulated deficit","Total liabilities and shareholders’ equity","Inventories, net","Other current assets","Current portion of long-term debt","Other liabilities and accrued expenses","Accrued liabilities other","Accounts receivable, net","Restricted cash","Liabilities and Equity","Long-term debt, net of current portion","Additional paid-in capital","Deferred revenue","Total liabilities and stockholders' equity:","Accounts receivable","Prepaid expenses","Noncurrent deferred tax asset","Asset retirement obligation","Total equity","Goodwill","Accrued compensation","Property, plant and equipment, net","Other non-current liabilities","Shareholders’ equity:","Retained earnings","Total shareholders’ equity","Prepaid expenses and other current assets","Non-current portion of deferred rent"]
        listOfProbabilitiesBalanceSheet = [0.77, 1, 1, 1, 1, 0.88, 0.77, 0.66, 0.66, 0.55, 0.55, 0.55, 0.55, 0.55, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.33, 0.33, 0.33, 0.33, 0.33, 0.33, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22]

        balanceSheetTable = self.getTableWithProbabilities(xml, listOfWordsBalanceSheet, listOfProbabilitiesBalanceSheet, listOfWordsToSearchHeadersBalanceSheet, False, downGradeStringBalanceSheet)

        if not balanceSheetTable:
            balanceSheetTable = self.getTable(listOfWordsToSearchInsideBalanceSheet, listOfWordsToSearchHeadersBalanceSheet, xml)
            
        return balanceSheetTable

    def getBalanceSheetDict(self, balanceSheetTable, xml):
        inThousands = False
        inMillions = False
        
        if balanceSheetTable:
            #print(balanceSheetTable)
            inThousands = self.isInThousands(balanceSheetTable)
            if not inThousands:
                inMillions = self.isInMillions(balanceSheetTable)
        
        listOfBreakPointsForConsolidatedBalanceSheet = ["assets", "current"]
        balanceSheetDict = self.getDict(balanceSheetTable, inThousands, inMillions, listOfBreakPointsForConsolidatedBalanceSheet)
        tableContinuation = self.getTableCont(xml)
        continuationDict = {}

        if tableContinuation:
            continuationDict = self.getDict(tableContinuation, inThousands, inMillions, listOfBreakPointsForConsolidatedBalanceSheet)
        return self.appendDicts(balanceSheetDict, continuationDict)

    def getTableCont(self, xml):
        tempTable = xml.findAll("td", string="CONSOLIDATED BALANCE SHEETS - CONTINUED") or xml.findAll("p", string="CONSOLIDATED BALANCE SHEETS - CONTINUED") or xml.findAll("font", string="CONSOLIDATED BALANCE SHEETS - CONTINUED") or xml.findAll("b", string="CONSOLIDATED BALANCE SHEETS - CONTINUED")
        if tempTable:
            return tempTable[0].findParents("table")[0]
        else:
            return False

    def getDict(self, table, inThousands, inMillions, listOfBreakPoints):
    
        if table:
            dates = self.beutifyDates(self.getDatesList(table, listOfBreakPoints))
            whereIsTheDate = self.getAssetsIndex(table, listOfBreakPoints)

            indexOfDates = 0
            dataDict = {}
            counterOfTdsPassed = 0

            #convert the table to dictionery 
            for tr in table.findAll('tr'):
                tds = tr.findAll('td')
                keys = []
                shouldContinue = True
                shouldEnter = False
                for element in tds:
                    try:
                        theElement = element.p.text
                        shouldEnter = True
                    except:
                        pass

                    try:
                        theElement = element.text
                        shouldEnter = True
                    except:
                        pass
                    if (shouldEnter and len(str(theElement)) > 5 and whereIsTheDate < 1) or (shouldEnter and theElement.replace(",", "").isdigit() and whereIsTheDate < 1) or (shouldEnter and "cash" in str(theElement).lower() and whereIsTheDate < 1) or (shouldEnter and theElement.replace("(", "").replace(")", "").isdigit() and whereIsTheDate < 1) or (shouldEnter and theElement == "-" and whereIsTheDate < 1):
        
                        shouldContinue = True
                        #this is for the '-' case
                        if theElement == "-":
                            indexOfDates += 1
                            shouldContinue = False

                        if shouldContinue:    
                            if counterOfTdsPassed == 0:
                                for x in range (0,len(dates)):
                                    try:
                                        keys.append(theElement.lower() + "_" + re.sub(r'[\s]$|^[\s]', '', dates[x]))
                                    except: 
                                        pass
                                counterOfTdsPassed += 1
                            else:
                                if theElement != '$':
                                    try:
                                        valueToAdd = re.sub(r'[)]', '', re.sub(r'[(]', '-',  re.sub(r'[\n]', '', theElement))).replace(" ", "").replace("\xa0", "")

                                        if (inThousands and ("par value" not in keys[indexOfDates]) and valueToAdd.replace(",", "").isdigit()) or inMillions and ("par value" in keys[indexOfDates]) and valueToAdd.replace(",", "").isdigit() or (inThousands and valueToAdd.replace("-", "").replace(",", "").isdigit()):
                                            valueToAdd = valueToAdd + ",000"       
                                        if inMillions and ("par value" not in keys[indexOfDates]) and valueToAdd.replace(",", "").isdigit() or inMillions and valueToAdd.replace("-", "").replace(",", "").isdigit():
                                            valueToAdd = valueToAdd + ",000,000"
                                        dataDict.update({   re.sub(r'^[\s]+', '',  re.sub(r'[\s]+', ' ',  re.sub(r'[\s]+', ' ',  re.sub(r'[\x92]+', '',  re.sub(r'\n', '', re.sub(r'\xa0', '',  keys[indexOfDates])))))) :  valueToAdd.replace("\xa0", "")})
                                    except:
                                        pass
                                    indexOfDates += 1

                    whereIsTheDate -= 1
                    shouldEnter = False

                indexOfDates = 0
                counterOfTdsPassed = 0

            return dataDict
        else:
            return False


    def beutifyDates(self, dates):
        newDates = []

        for date in dates:
            listOfStrings = date.split(" ")
            stringToAdd = ""
            for string in listOfStrings:
                if not string == '':
                    stringToAdd += string
            date = re.sub(r'[\n]', ' ', stringToAdd)
            date = re.sub(r'[,]', ' ', date)
            date = re.sub(r'\xa0', '', date)
            newDates.append(date)


        newDates = list(filter(lambda a: a != ' \xa0', newDates))
        newDates = list(filter(lambda a: a != '\xa0', newDates))
        newDates = list(filter(lambda a: a != '\xa0\xa0', newDates))
        newDates = list(filter(lambda a: a != ' \xa0\xa0 ', newDates))
        newDates = list(filter(lambda a: a != ' \xa0 ', newDates))
        
        return newDates

    def getDatesList(self, table, listOfBreakPoints):

        months = []
        years = []
        rangeEnded = []
        foundBreakPoint = False

        for tr in table.findAll('tr'):
            if foundBreakPoint:
                break
            
            tds = tr.findAll('td')
            for element in tds:
                for breakPoint in listOfBreakPoints:
                    if breakPoint in element.text.lower().replace("\xa0", "").replace("\n", ""):
                        foundBreakPoint = True
                if foundBreakPoint:
                    break
                if self.isYear(element.text.replace("\xa0", "").replace("\n", "").replace("AsAdjusted", "")) and len(element.text.replace("\xa0", "").replace("\n", "").replace("AsAdjusted", "")) < 30:
                    years.append(element.text.replace("\xa0", "").replace("\n", "").replace("AsAdjusted", ""))
                elif self.isMonth(element.text.replace("\xa0", "").replace("\n", "").replace("AsAdjusted", "")) and len(element.text.replace("\xa0", "").replace("\n", "").replace("AsAdjusted", "")) < 30:
                    months.append(element.text.replace("\xa0", "").replace("\n", "").replace("AsAdjusted", ""))
                elif "three months ended" in element.text.lower().replace("\xa0", "").replace("\n", "").replace("AsAdjusted", "") and len(element.text.replace("\xa0", "").replace("\n", "").replace("AsAdjusted", "")) < 30:
                    rangeEnded.append(element.text.replace("\xa0", "").replace("\n", "").replace("AsAdjusted", ""))
                elif "six months ended" in element.text.lower().replace("\xa0", "").replace("\n", "").replace("AsAdjusted", "") and len(element.text.replace("\xa0", "").replace("\n", "").replace("AsAdjusted", "")) < 30:
                    rangeEnded.append(element.text.replace("\xa0", "").replace("\n", "").replace("AsAdjusted", ""))
                elif "nine months ended" in element.text.lower().replace("\xa0", "").replace("\n", "").replace("AsAdjusted", "") and len(element.text.replace("\xa0", "").replace("\n", "").replace("AsAdjusted", "")) < 30:
                    rangeEnded.append(element.text.replace("\xa0", "").replace("\n", "").replace("AsAdjusted", ""))
                    
                    
        if len(months) == len(rangeEnded) and len(rangeEnded) != 0:
            for i in range(0, len(months)):
                months[i] = rangeEnded[i] + "_" + months[i]
        elif len(years) == len(rangeEnded) and len(rangeEnded) != 0:
            for i in range(0, len(years)):
                years[i] = rangeEnded[i] + "_" + years[i]
        elif len(years) > len(rangeEnded) and len(rangeEnded) != 0:
            
            div = len(years) / len(rangeEnded)
            counter = 0
            index = 0
            while counter < len(years):
                years[counter] = rangeEnded[index] + "_" + years[counter]
                counter += 1
                if counter == div:
                    index += 1
            
        return self.fromMonthYearsToFinalDates(months, years)

    def isYear(self, string):
        now = datetime.datetime.now()
        years = [str(now.year), str(now.year - 1), str(now.year - 2), str(now.year - 3), str(now.year - 4), str(now.year - 5), str(now.year - 6), str(now.year - 7), str(now.year - 8), str(now.year - 9), str(now.year - 10)]
        for year in years:
            if year in string:
                return True
        return False

    def isMonth(self, string):
        months = ["January", "Jan", "February", "Feb", "March", "Mar", "April", "Apr", "May", "June", "Jun", "July", "Jul", "August", "Aug", "September", "Sep", "October", "Oct", "November", "Nov", "December", "Dec"]
        for month in months:
            if month.lower() in string.lower():
                return True
        return False

    def fromMonthYearsToFinalDates(self, months, years):
        finalDates = []
        lengthOfMonthsList = len(months)
        lengthOfYearsList = len(years)
        if lengthOfYearsList > lengthOfMonthsList and lengthOfMonthsList != 0:
            div = lengthOfYearsList / lengthOfMonthsList
            counter = 0
            index = 0
            while counter < lengthOfYearsList:
                finalDates.append(months[index] + years[counter])
                counter += 1
                if counter == div:
                    index += 1
            return finalDates
        elif lengthOfYearsList == lengthOfMonthsList:
            for i in range(0, lengthOfMonthsList):
                finalDates.append(months[i] + years[i])
            return finalDates
        elif lengthOfYearsList == 0 and lengthOfMonthsList != 0:
            return months
        elif lengthOfMonthsList == 0 and lengthOfYearsList != 0:
            return years
        else: 
            return []

    def getAssetsIndex(self, table, listOfBreakPoints):
        assetsIndex = 0
        foundBreakPoint = False
        for tr in table.findAll('tr'):
            if foundBreakPoint:
                break
            tds = tr.findAll('td')
            for element in tds:
                for breakPoint in listOfBreakPoints:
                    if breakPoint in element.text.lower():
                        foundBreakPoint = True
                if foundBreakPoint:
                    break
                else:
                    assetsIndex += 1
        return assetsIndex

    def getStatementOfOperationsTable(self, xml):
    
        listOfWordsToSearchInsideOperations = ["Net operating revenues:", "Weighted average shares outstanding:", "Net revenues", "Net Revenues", "Gross Profit", "Gross profit", "EXPENSES", "Net sales", "Operating Revenues", "COSTS AND EXPENSES:", "Revenues:", "Net revenue:", "Costs and expenses:", "Net revenues", "Weighted shares used in the computation of net loss per share:", "Cost of sales", "Gross profit", "Weighted average shares outstanding - diluted", "Weighted average shares outstanding - basic", "Condensed Consolidated Statements of Operations and Comprehensive Loss", "Sales", "Revenues"]
        listOfWordsToSearchHeadersOperations = ["Condensed Consolidated Statements of Operations (Unaudited)", "Consolidated Statements of Loss and Comprehensive Loss", "CONDENSED CONSOLIDATED STATEMENTS OF OPERATIONS (Unaudited)", "Consolidated Statements of Loss and Comprehensive Loss", "CONSOLIDATED STATEMENTS OF OPERATIONS", "CONDENSED CONSOLIDATED STATEMENTS OF OPERATIONS", "Condensed Statements of Operations and Comprehensive Loss", "CONSOLIDATED STATEMENTS OF OPERATIONS", "CONSOLIDATED STATEMENTS OF COMPREHENSIVE INCOME (LOSS)", "CONSOLIDATED STATEMENTS OF COMPREHENSIVE INCOME", "Consolidated Statements of Income and Comprehensive Income", "CONDENSED CONSOLIDATED STATEMENTS OF OPERATIONS AND"]
        downGradeStringOperations = "As Previously Reported"

        #for probabilities function
        listOfWordsOperations = ["basic and diluted net loss per common share","total operating expenses","net loss before income taxes","selling, general and administrative expenses","net revenue:","net revenues:","less net loss attributable to non-controlling interest in subsidiary","Research and development expenses","gross profit","total net operating revenues","interest expense, net","cost of sales","net operating revenues:","other income, net","net loss","shares used in computation of basic and diluted net loss per","net income (loss)","loss from operations","weighted-average common shares outstanding","weighted-average number of common shares outstanding","waste management services","food, beverage and merchandise sales","total golf and related operations","costs and expenses:","depreciation and amortization expense","provision for income taxes","weighted average shares outstanding","gross margin","operating income (loss)","income before provision for income taxes","net loss per share to common stockholders:","income tax expenses","total net revenue","sales and marketing expenses","cost of revenues", "Oil and natural gas", "revenues:", "Net (loss) earnings", "three months ended", "six months ended", "nine months ended", "OTHER INCOME (EXPENSE)", "NET (LOSS) INCOME", "WEIGHTED AVERAGE SHARES:", "Oil, natural gas, and related product sales", "Revenues and other income", "Net income", "income tax provision", "Weighted average common shares outstanding", "revenue", "Research and development expenses", "General and administrative expenses"]
        listOfProbabilitiesOperations = [0.81, 0.72, 0.63, 0.54, 0.54, 0.54, 0.45, 0.45, 0.45, 0.36, 0.36, 0.36, 0.27, 0.27, 0.27, 0.27, 0.27, 0.27, 0.27, 0.27, 0.18, 0.18, 0.18, 0.18,0.18,0.18,0.18,0.18,0.18,0.18,0.18,0.18,0.18,0.18,0.27, 0.25, 0.25, 0.25, 0.20, 0.20, 0.20, 0.31, 0.40, 0.4, 0.4, 0.35, 0.27, 0.18, 0.55, 0.2, 0.35, 0.35]

        operationsTable = self.getTableWithProbabilities(xml, listOfWordsOperations, listOfProbabilitiesOperations, listOfWordsToSearchHeadersOperations, False, downGradeStringOperations)
        if not operationsTable:
            operationsTable = self.getTable(listOfWordsToSearchInsideOperations, listOfWordsToSearchHeadersOperations,xml)
            
        return operationsTable

    def getLatestStatFromDict(self, dictionery, stat):
        dictOfCandidates = {}
        if dictionery:
            for key, value in dictionery.items():
                compare = key.split("_")[0].lower()
                if stat == "cash":
                    if compare.lower() == "cash" or compare.lower() == "cash and cash equivalents" or compare.replace(" ", "").lower() == "cash and cash equivalents".replace(" ", ""):
                        dictOfCandidates.update({key : value})
                    elif "cash and cash equivalents" in compare.lower() or "cash and cash equivalents".replace(" ", "") in compare.replace(" ", "").lower():
                        dictOfCandidates.update({key : value})
                    elif "cash" in compare.lower():
                        dictOfCandidates.update({key : value})
                elif stat == "accumulated deficit":
                    if compare.lower() == "accumulated deficit" or compare.replace(" ", "").lower() == "accumulated deficit".replace(" ", ""):
                        dictOfCandidates.update({key : value})
                    elif "accumulated deficit" in compare.lower() or "accumulated deficit".replace(" ", "") in compare.replace(" ", "").lower():
                        dictOfCandidates.update({key : value})
                elif stat == "assets":
                    if compare.lower() == "total assets" or compare.replace(" ", "").lower() == "total assets".replace(" ", "").lower():
                        dictOfCandidates.update({key : value})
                elif stat == "net income":
                    if compare.lower() == "net income (loss)" or compare.replace(" ", "").lower() == "net income (loss)".replace(" ", "").lower() or compare.lower() == "net loss" or compare.replace(" ", "").lower() == "net loss".replace(" ", "") or compare.lower() == "net income" or compare.replace(" ", "").lower() == "net income".replace(" ", "") or compare.lower() == "net loss (earnings)" or compare.replace(" ", "").lower() == "net loss (earnings)".replace(" ", "") or compare.lower() == "net (loss) income" or compare.replace(" ", "") == "net (loss) income".replace(" ", "") or compare.replace(" ", "") == "net loss and comprehensive loss".replace(" ", "") or compare.replace(" ", "") == "net loss and comprehensive loss".replace(" ", "") or compare.replace(" ", "") == "net (loss) earnings".replace(" ", "") or compare == "net (loss) earnings" or compare == "net earnings (loss)" or compare.replace(" ", "") == "net earnings (loss)".replace(" ", ""):
                        dictOfCandidates.update({key : value})
                elif stat == "revenue":
                    if compare.lower() == "net revenues" or compare.replace(" ", "").lower() == "net revenues".replace(" ", "") or compare.lower() == "total net operating revenues" or compare.replace(" ", "").lower() == "total net operating revenues".replace(" ", "") or compare.lower().replace(" ", "") == "total revenue".replace(" ", "") or compare.replace(" ", "").lower() == "total operating expenses".replace(" ", "") or compare.lower() == "sales" or compare.lower() == "revenues" or compare.lower() == "total net revenue" or compare.replace(" ", "").lower() == "total net revenue".replace(" ", "") or compare.replace(" ", "").lower() == "net sales".replace(" ", ""):
                        dictOfCandidates.update({key : value})

                elif stat == "total liabilities":
                    if compare.lower() == "total liabilities" or compare.replace(" ", "").lower() == "total liabilities".replace(" ", ""):
                        dictOfCandidates.update({key : value})

        return self.getLatestStat(dictOfCandidates)

    def getLatestStat(self, dictOfStats):
        monthsDict = {"January" : 1, "February" : 2, "March" : 3, "April" : 4, "May" : 5, "June" : 6, "July" : 7, "August" : 8, "September" : 9, "October" : 10, "November" : 11, "December" : 12}
        maxValue = ""
        maxDateAsList = []
        for key, value in dictOfStats.items():
            #remove all six months ended and check only three months ended
            if "SixMonthsEnded".lower() not in key.lower().replace(" ", "") and "26WeeksEnded".lower() not in key.lower().replace(" ", ""):
                month = ""
                day = ""
                year = ""
                date = ""
                testList = key.split("_")
                if len(testList) == 3:
                    date = key.split("_")[2]
                else:
                    date = key.split("_")[1] # now it's June30 2018
                for InnerKey in monthsDict:
                    if InnerKey in date:
                        month = monthsDict[InnerKey]
                
                newDateString = re.sub(r'^[ ]', "", date)
                dateAndYearList = newDateString.split(" ")
                try:
                    year = ''.join(i for i in dateAndYearList[1] if i.isdigit())
                except:
                    year = '0'
                
                try:
                    day = ''.join(i for i in dateAndYearList[0] if i.isdigit())
                except:
                    day = '0'
                    
                if month == "":
                    month = '0'
                    
                dateAsList = [year, month, day]
                if len(maxDateAsList) != 0:
                    biggest = self.getLatestDate(dateAsList, maxDateAsList)
                    if biggest == dateAsList:
                        maxDateAsList =  dateAsList
                        maxValue = value
                else:
                    maxDateAsList = dateAsList
                    maxValue = value
        
        return maxValue

    def getLatestDate(self, dateAsListOne, dateAsListTwo):
        for i in range(0, len(dateAsListOne)):
            if str(dateAsListOne[i]) > str(dateAsListTwo[i]):
                return dateAsListOne
            elif str(dateAsListOne[i]) < str(dateAsListTwo[i]):
                return dateAsListTwo

    def getDictFromDEF14A(self, table):
        dictToReturn = {}
        
        trs = table.findAll("tr")
        
        for tr in trs:
            
            tdsCounter = 0
            foundKey = True
            key = ""
            value = ""
            try:
                tds = tr.findAll("td")
                shouldBreak = False
                prevtd = ""
        
                for td in tds:
                    #print("working on " + td.text)
                    if len(td.text) > 5 and tdsCounter < 2 and foundKey:
                        #print("giving key to " + td.text)
                        key = td.text
                        foundKey = False
                    elif "%" in td.text:
                        if not td.text.replace("%", "").replace(".", "").replace("\n", "").replace("\xa0", "").isdigit():
                            value = prevtd.replace("\n", "").replace("\xa0", "")
                            if key != "":
                                valueToAdd = re.sub(r'[)]', '', re.sub(r'[(]', '-', str(value) + "%")).replace(" ", "")
                                dictToReturn.update({ re.sub(r'^[\s]+', '', re.sub(r'[\s]+', ' ',  re.sub(r'[\s]+', ' ',  re.sub(r'[\x92]+', '',  re.sub(r'\n', '', re.sub(r'\xa0', '', key)))))) : valueToAdd})
                                shouldBreak = True
                        else: 
                            value = td.text.replace("\n", "").replace("\xa0", "")
                            if key != "":
                                valueToAdd = re.sub(r'[)]', '',  re.sub(r'[(]', '-', str(value))).replace(" ", "")
                                dictToReturn.update({ re.sub(r'^[\s]+', '',  re.sub(r'[\s]+', ' ', re.sub(r'[\s]+', ' ', re.sub(r'[\x92]+', '',  re.sub(r'\n', '', re.sub(r'\xa0', '', key)))))) :   valueToAdd})
                                shouldBreak = True
                    else: 
                        prevtd = td.text
                    if shouldBreak:
                        break
                    tdsCounter += 1
            except: 
                pass
        return dictToReturn

    def appendDicts(self, firstDict, secondDict):
        for key, value in secondDict.items():
            firstDict.update({key : value})
        return firstDict

    def getForm4Url(self, url):
        uClient = uReq(url)
        page_html = uClient.read()
        uClient.close()
        xml = soup(page_html, 'xml')

        return "https://www.sec.gov" + xml.find("table").findAll("a")[0]['href']


class updatesChecker(object):
    executor = ThreadPoolExecutor(max_workers=4)
    lastReport = {}

    def __init__(self, lastReport):
        self.lastReport = lastReport
    
    def getUpdatesList(self):
    
        arrayOfCiksToUpdate = []
        firstEncounter = {}
        isFirst = True

        url = "https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&CIK=&type=&company=&dateb=&owner=include&start=0&count=40&output=atom"
        uClient = uReq(url)
        page_html = uClient.read()
        xml = soup(page_html, 'xml')
        uClient.close()

        entriesArray = xml.findAll('entry')

        theLastReport = self.lastReport

        for entry in entriesArray:
            currentReport = {}
            title = entry.find('title').text
            spllitedTitleByMinus = title.split(" - ")
            cik =  re.sub(r'[)]', "", re.sub(r'[(]', "", re.search(r'[(]\d+[)]', spllitedTitleByMinus[1]).group(0)))
            lastUpdated = entry.find("updated").text
            currentReport.update({"lastUpdated" : lastUpdated})
            currentReport.update({"cik" : cik})

            if isFirst:
                self.lastReport = currentReport
                isFirst = False

            if theLastReport["lastUpdated"] != lastUpdated or theLastReport["cik"] != cik:
                arrayOfCiksToUpdate.append(cik)
            else:
                return arrayOfCiksToUpdate
                
    def checkUpdates(self):
        threading.Timer(20.0, self.checkUpdates).start()
        array = self.getUpdatesList()
        print("the new array is: " + str(array))
        if len(array) != 0:
            for cik in array:
                self.executor.submit(self.executeCacheGenerator, cik)
                

    def executeCacheGenerator(self, cik):

        chaceGenerator_0_10 = make_cache_generator(cik, "0", "10", "y")
        chaceGenerator_10_20 = make_cache_generator(cik, "10", "10", "n")
        chaceGenerator_20_30 = make_cache_generator(cik, "20", "10", "n")
        chaceGenerator_30_40 = make_cache_generator(cik, "30", "10", "n")
        chaceGenerator_40_50 = make_cache_generator(cik, "40", "10", "n")
        chaceGenerator_50_60 = make_cache_generator(cik, "50", "10", "n")
        chaceGenerator_60_70 = make_cache_generator(cik, "60", "10", "n")

    
def make_update_checker(lastReport):
    updateChecker = updatesChecker(lastReport)
    return updateChecker

def make_cache_generator(cik, start, end, trueOrFalse):
    cacheGenerator = fillingsGetter(cik, start, end, trueOrFalse)
    return cacheGenerator


def generateCache(cik):
    chaceGenerator_0_10 = make_cache_generator(cik, "0", "10", "y")
    chaceGenerator_10_20 = make_cache_generator(cik, "10", "10", "n")
    chaceGenerator_20_30 = make_cache_generator(cik, "20", "10", "n")
    chaceGenerator_30_40 = make_cache_generator(cik, "30", "10", "n")
    chaceGenerator_40_50 = make_cache_generator(cik, "40", "10", "n")
    chaceGenerator_50_60 = make_cache_generator(cik, "50", "10", "n")
    chaceGenerator_60_70 = make_cache_generator(cik, "60", "10", "n")
    


#--------------------------------------------------------------------
#                               MAIN
#--------------------------------------------------------------------

executor = ThreadPoolExecutor(max_workers=4)
futures = []

with open('./assets/allStocks.json') as f:

    data = json.load(f)
    for stock in data:
        cik = stock['cik']
        if cik.lower() != "null" and cik:
            a = executor.submit(generateCache, cik)
            futures.append(a)


    
var indexOfEnglishNumbers = 0;
var currentStock = "";
var isFirstTime = true;
isLoadMore = false;
var globalStart = 0;
var firstSearch = document.getElementById("firstSearch");
var result = document.getElementById("result");
var searchTopHidden = document.getElementById("search-top-hidden");
var searchPopup = document.getElementById("search-popup");
var nav = document.getElementsByTagName("nav");
var counterForModals = 0;



var dictOfReportExplanations = {}
dictOfReportExplanations.tenK = "A Form 10-K is an annual report that gives a comprehensive summary of a company's financial performance. The 10-K includes information such as company history, organizational structure, executive compensation, equity, subsidiaries, an audited financial statements, among other information."
dictOfReportExplanations.tenQ = "Form 10-Q is a quarterly report that contains similar information to the annual form 10-K however the information is generally less detailed, and the financial statements are generally unaudited."
dictOfReportExplanations.eightK = "Form 8-K is a very broad form used to notify investors in public companies of specified events that may be important to shareholders or the SEC."
dictOfReportExplanations.form4 = "Form 4 is a SEC filing that relates to insider trading. Every director, officer or owner of more than 10% of a class of equity securities must file with the United States Securities and Exchange Commission a statement of ownership regarding such security."
dictOfReportExplanations.SD = "Disclosure is the act of releasing all relevant information on a company that may influence an investment decision."
dictOfReportExplanations.f1 = "Form F-1 is registration statement for certain foreign private issuers."
dictOfReportExplanations.SC13D = "Schedule 13D is a form that the U.S. Securities and Exchange Commission requires some shareholders to file within 10 days of purchasing a stock."
dictOfReportExplanations.SC13G = "Schedule 13G is an alternative SEC filing for the 13D and is considered a more passive version of the 13D and has fewer reporting requirements than the 13D."
dictOfReportExplanations.sixK = "Form 6K is an SEC filing used by certain foreign private issuers to provide information that is: Required to be made public in the country of its domicile,  Filed with and made public by a foreign stock exchange on which its securities are traded,  Distributed to security holders."
dictOfReportExplanations.four24B5 = "Form 424B5 is the prospectus form that companies must file to disclose information referred to in forms 424B2 (filed in connection with a primary offering of securities) and 424B3 (filed if major changes have occurred to the prospectus). SEC Form 424B5 outlines updated prospectus information, facts or events from previously-filed forms."
dictOfReportExplanations.four24B4 = "Form 424B4 is the prospectus form that a company must file to disclose information they refer to in SEC Forms 424B1 and 424B3."
dictOfReportExplanations.CORRESP = ""
dictOfReportExplanations.EFFECT = ""

dictOfReportExplanations.F3 = "Registration statement for securities of certain foreign private issuers"
dictOfReportExplanations.C = ""
dictOfReportExplanations.X17F1A = "Missing/Lost/Stolen/Counterfeit Securities Report"
dictOfReportExplanations.X17A19 = "Report of Change in Membership Status"
dictOfReportExplanations.WBAPP = "Application for Award for Original Information Submitted Pursuant to Section 21F of the Securities Exchange Act of 1934"
dictOfReportExplanations.TH = "Notification of Reliance on Temporary Hardship Exemption"
dictOfReportExplanations.TCR = "Tip, Complaint, or Referral "
dictOfReportExplanations.TAW = "Notice of withdrawal from registration as transfer agent "
dictOfReportExplanations.TA1 = "Uniform form for registration as a transfer agent and for amendment to registration"
dictOfReportExplanations.TA2 = "Form for reporting activities of transfer agents"
dictOfReportExplanations.T6 = "Application under Section 310(a)(1) of the Trust Indenture Act of 1939 for determination of eligibility of a foreign personal to act as institutional trustee"
dictOfReportExplanations.T4 = "Application for exemption filed pursuant to Section 304(c) of the Trust Indenture Act of 1939"
dictOfReportExplanations.T3 = "For applications for qualification of indentures under the Trust Indenture Act of 1939"
dictOfReportExplanations.T2 = "Statement of eligibility under the Trust Indenture Act of 1939 of an individual designated to act as trustee "
dictOfReportExplanations.T1 = "Statement of eligibility and qualification under the Trust Indenture Act of 1939 of corporations designated to act as trustees"
dictOfReportExplanations.SIP = "Application or amendment to application for registration as securities infomation processor"
dictOfReportExplanations.SF3 = "Registration Statement Under the Securities Act of 1933"
dictOfReportExplanations.SF1 = "Registration Statement Under the Securities Act of 1933"
dictOfReportExplanations.SE = "Submission of Paper Format Exhibits by Electronic Filers"
dictOfReportExplanations.SDR = "Application or Amendment to Application for Registration or Withdrawal from Registration As Security-Based Swap Data Repository Under the Securities Exchange Act of 1934"
dictOfReportExplanations.SCI = "Systems Compliance and Integrity"
dictOfReportExplanations.SBSEW = "Request for Withdrawal from Registration as a Security-based Swap Dealer or Major Security-based Swap Participant"
dictOfReportExplanations.SBSEC = "Certifications for Registration of Security-based Swap Dealers and Major Security-based Swap Participants "
dictOfReportExplanations.SBSEBD = "Application for Registration of Security-based Swap Dealers and Major Security-based Swap Participants that are Registered Broker-dealers"
dictOfReportExplanations.SBSEA = "Application for Registration of Security-based Swap Dealers and Major Security-based Swap Participants that are Registered or Registering with the Commodity Futures Trading Commission as a Swap Dealer"
dictOfReportExplanations.SBSE = "Application for Registration of Security-based Swap Dealers and Major Security-based Swap Participants "
dictOfReportExplanations.S20 = "Registration statement under the Securities Act of 1933"
dictOfReportExplanations.S11 = "Registration of securities of certain real estate companies"
dictOfReportExplanations.S6 = "Registration under 1933 act of securities of unit investment trusts registered on form N-8B-2"
dictOfReportExplanations.S4 = "Registration statement under Securities Act of 1933 "
dictOfReportExplanations.S3 = "Registration statement under Securities Act of 1933 "
dictOfReportExplanations.R31 = "Form for Reporting Covered Sales and Covered Round Turn Transactions Under Section 31 of the Securities Exchange Act of 1934"
dictOfReportExplanations.PILOT = "Initial operation report, amendment to initial operation report and quarterly report for pilot trading systems operated by self-regulatory organizations"
dictOfReportExplanations.PF = "Reporting Form for Investment Advisers to Private Funds and Certain Commodity Pool Operators and Commodity Trading Advisors"
dictOfReportExplanations.NRSRO = "Application for Registration as a Nationally Recognized Statistical Rating Organization (NRSRO) "
dictOfReportExplanations.NSAR = "Semi-annual report of registered investment companies"
dictOfReportExplanations.NQ = "Quarterly Schedule of Portfolio Holdings of Registered Management Investment Company"
dictOfReportExplanations.NPX = "Annual Report of Proxy Voting Record of Registered Management Investment Company"
dictOfReportExplanations.NPORT = "Monthly Portfolio Investments Report"
dictOfReportExplanations.NMFP = "Monthly Schedule of Portfolio Holdings of Money Market Funds"
dictOfReportExplanations.NLIQUID = "Current Report Open-End Management Investment Company Liquidity"
dictOfReportExplanations.NCSR = "Certified shareholder report of registered management investment companies"
dictOfReportExplanations.NCR = "Current Report, Money Market Fund Material Events "
dictOfReportExplanations.NCEN = "Annual Report for Registered Investment Companies "
dictOfReportExplanations.N54C = "Notification of withdrawal of election to be subject to Sections 55-65 of the Investment Company Act of 1940"
dictOfReportExplanations.N54A = "Notification of election to be subject to Sections 55-65 of the Investment Company Act of 1940"
dictOfReportExplanations.N27D1 = "Accounting of Segregated Trust Account"
dictOfReportExplanations.N23C3 = "Notification of repurchase offer"
dictOfReportExplanations.N18F1 = "Notification of election pursuant to Rule 18f-1 under the Investment Company Act of 1940"
dictOfReportExplanations.N17F2 = "Certificate of accounting of securities and similar investments in the custody of management investment companies"
dictOfReportExplanations.N17F1 = "Certificate of accounting of securities and similar investments of a management investment company in the custody of members of national securities exchanges"
dictOfReportExplanations.N17D1 = "Report filed by small business investment company (SBIC)"
dictOfReportExplanations.N14 = "Form for the registration of securities issued in business combination transactions by investment companies and business development companies "
dictOfReportExplanations.N8F = "Application for deregistration of certain registered investment companies"
dictOfReportExplanations.N8B4 = "Registration statement of face-amount certificate companies"
dictOfReportExplanations.N8B2 = "Registration statement of unit investment trusts which are currently issuing securities"
dictOfReportExplanations.N8A = "Notification of registration filed pursuant to Section 8(a) of Investment Company Act of 1940"
dictOfReportExplanations.N6F = "Notice of intent to elect to be subject to Sections 55-65 of the Investment Company Act of 1940"
dictOfReportExplanations.N6EI1 = "Notification of claim of exemption pursuant to Rule 6e-2 or 6e-3(T) under the Investment Company Act of 1940"
dictOfReportExplanations.N6 = "Registration statement for separate accounts organized as unit investment trusts that offer variable life insurance policies"
dictOfReportExplanations.N5 = "Registration statement of small business investment company"
dictOfReportExplanations.N4 = "Registration statement of separate accounts organized as unit investment trusts"
dictOfReportExplanations.N3 = "Registration statement of separate accounts organized as management investment companies"
dictOfReportExplanations.N2 = "Registration statement for closed-end management investment companies"
dictOfReportExplanations.N1A = "Registration form for open-end management investment companies"
dictOfReportExplanations.MSDW = "Notice of withdrawal from registration as a municipal securities dealer"
dictOfReportExplanations.MSD = "Application for registration as a municipal securities dealer or amendment to such application"
dictOfReportExplanations.MAW = "Notice of Withdrawal from Registration as a Municipal Advisor"
dictOfReportExplanations.MANR = "Designation of U.S. Agent for Service of Process for Non-Residents"
dictOfReportExplanations.MAI = "Information Regarding Natural Persons who Engage in Municipal Advisory Activities"
dictOfReportExplanations.MA = "Application for Municipal Advisor Registration; Annual Update of Municipal Advisor Registration; and Amendment of a Prior Application for Registration "
dictOfReportExplanations.ID = "Uniform application for access codes to file on EDGAR"
dictOfReportExplanations.FX = "Appointment of agent for service of process and undertaking"
dictOfReportExplanations.FN = "Appointment of agent for service of process by foreign banks and foreign insurance companies"
dictOfReportExplanations.F80 = "Registration statement for securities of certain Canadian issuers to be issued in exchange offers or a business combination"
dictOfReportExplanations.F10 = "Registration statement for securities of certain Canadian issuers"
dictOfReportExplanations.F8 = "Registration statement under the Securities Act of 1933 for securities of certain Canadian issuers to be issued in exchange offers or a business combination "
dictOfReportExplanations.F7 = "Registration statement under the Securities Act of 1933 for securities of certain Canadian issuers offered for cash upon the exercise of rights granted to existing security holders"
dictOfReportExplanations.F6 = "Registration statement under the Securities Act of 1933 for depositary shares evidenced by American depositary receipts"
dictOfReportExplanations.F4 = "Registration statement for securities of certain foreign private issuers issued in certain business combination transactions"
dictOfReportExplanations.CUSTODY = "Form Custody for Broker-Dealers"
dictOfReportExplanations.CFPORTAL = "Application or Amendment to Application for Registration or Withdrawal from Registration as Funding Portal Under the Securities Exchange Act of 1934"
dictOfReportExplanations.CB = "Tender offer/rights offering notification form"
dictOfReportExplanations.CA1 = "Registration or exemption from registration as a clearing agency and for amendment to registration "
dictOfReportExplanations.BDW = "Uniform request for broker-dealer withdrawal"
dictOfReportExplanations.BDN = "Notice of registration as a broker-dealer for the purpose of trading security futures products pursuant to Section 15(b)(11) of the Securities Exchange Act of 1934"
dictOfReportExplanations.BD = "Uniform application for broker-dealer registration "
dictOfReportExplanations.ATSR = "Quarterly report of alternative trading systems activities"
dictOfReportExplanations.ATS = "Initial operation report, amendment to initial operation report and cessation of operations report for alternative trading systems"
dictOfReportExplanations.ADVW = "Notice of withdrawal from registration as investment adviser"
dictOfReportExplanations.ADVNR = "Appointment of agent for service of process by non-resident general partner and non-resident managing agent of an investment adviser"
dictOfReportExplanations.ADVH = "Application for a temporary or continuing hardship exemption"
dictOfReportExplanations.ADVE = "Certificate of accounting of client securities and funds in the possession or custody of an investment adviser "
dictOfReportExplanations.ADV = "Uniform Application for Investment Adviser Registration and Report by Exempt Reporting Advisers"
dictOfReportExplanations.ABSEE = "Form for Submission of Electronic Exhibits for Asset-Backed Securities"
dictOfReportExplanations.ABS15G = "Asset-Backed Securitizer Report"
dictOfReportExplanations.ABSDD15E = "Certification of Provider of Third-Party Due Diligence Services for Asset-Backed Securities"
dictOfReportExplanations.one44 = "Notice of proposed sale of securities pursuant to Rule 144"
dictOfReportExplanations.fourtyF = "Registration statement pursuant to Section 12 or annual report pursuant to Section 13(a) or 15(d)"
dictOfReportExplanations.twenty5 = "Notification of the removal from listing and registration of matured, redeemed or retired securities"
dictOfReportExplanations.twenty4F2 = "Annual notice of securities sold pursuant to Rule 24-f2 "
dictOfReportExplanations.nineteenB4E = "Information required of a self-regulatory organization listing and trading a new derivative securities product pursuant to Rule 19b-4(e) under the Securities Exchange Act of 1934"
dictOfReportExplanations.nineteenB7 = "Proposed rule change by self-regulatory organization "
dictOfReportExplanations.nineteenB4 = "Proposed rule change by self-regulatory organization "
dictOfReportExplanations.eighteenK = "Annual report for foreign governments and political subdivisions thereof"
dictOfReportExplanations.eighteen = "Application for registration pursuant to Section 12(b) & (c) of the Securities Exchange Act of 1934"
dictOfReportExplanations.seventeenH = "Risk Assessment for Brokers & Dealers"
dictOfReportExplanations.fifteenF = "Certification of a foreign private issuer’s termination of registration of a class of securities under Section 12(g) or its termination of the duty to file reports under Section 13(a) or Section 15(d)"
dictOfReportExplanations.fifteen = "Certification and notice of termination of registration under Section 12(g) or suspension of duty to file reports under Sections 13 and 15(d)"
dictOfReportExplanations.thirteenH = "Information Required of Large Traders Pursuant To Section 13(h) of the Securities Exchange Act of 1934 "
dictOfReportExplanations.thirteenF = "Information required of institutional investment managers pursuant to Section 13(f)"
dictOfReportExplanations.twelveB25 = "Notification of late filing"
dictOfReportExplanations.elevenK = "Annual reports of employee stock purchase, savings and similar plans pursuant to Section 15(d)"
dictOfReportExplanations.tenM = "Irrevocable Appointment of Agent for Service of Process, Pleadings and Other Papers by Non-Resident General Partner of Broker or Dealer"
dictOfReportExplanations.tenD = "Asset-Backed Issuer Distribution Report Pursuant to Section 13 or 15(d) of the Securities Exchange Act of 1934"
dictOfReportExplanations.ten = "General form for registration of securities pursuant to Section 12(b) or (g)"
dictOfReportExplanations.nineM = "Irrevocable Appointment of Agent for Service of Process, Pleadings and Other Papers by Partnership Non-Resident Broker or Dealer"
dictOfReportExplanations.eightA = "Registration of certain classes of securities pursuant to Section 12(b) or (g)"
dictOfReportExplanations.eightM = "Irrevocable Appointment of Agent for Service of Process, Pleadings and Other Papers by Corporate Non-Resident Broker or Dealer"
dictOfReportExplanations.sevenM = "Irrevocable Appointment of Agent for Service of Process, Pleadings and Other Papers by Individual Non-Resident Broker or Dealer"
dictOfReportExplanations.towE = "Report of sales pursuant to Rule 609 of Regulation E "
dictOfReportExplanations.oneZ = "Exit Report Under Regulation A"
dictOfReportExplanations.oneU = "Current Report Pursuant to Regulation A"
dictOfReportExplanations.oneSA = "Semiannual Report or Special Financial Report Pursuant to Regulation A"
dictOfReportExplanations.oneN = "Form and amendments for notice of registration as a national securities exchange for the sole purpose of trading security futures products"
dictOfReportExplanations.oneK = "Annual Reports and Special Financial Reports"
dictOfReportExplanations.oneE = "Notification under Regulation E"
dictOfReportExplanations.one = "Application for registration or exemption from registration as a national securities exchange"
dictOfReportExplanations.oneA = "Regulation A Offering Statement"


dictOfReportExplanations.DEF14A = "Form DEF 14A is a filing with the SEC that must be filed by or on behalf of a registrant when a shareholder vote is required."
dictOfReportExplanations.eightA12B = "A filing with the SEC that is required when a corporation wishes to issue certain classes of securities, including rights to buy such securities at a future date."
dictOfReportExplanations.S1 = "Form S-1 is the initial registration form for new securities required by the Securities and Exchange Commission (SEC) for public companies. The S-1 contains the basic business and financial information on an issuer with respect to a specific securities offering. Investors may use the prospectus to consider the merits of an offering and make educated investment decisions."
dictOfReportExplanations.form5 = "Form 5 is an SEC filing submitted to the Securities and Exchange Commission on an annual basis by company officers, directors, or beneficial (10%) owners, which summarizes their insider trading activities."
dictOfReportExplanations.form3 = "Form 3 is an SEC filing to indicate a preliminary insider transaction by an officer, director, or beneficial (10%) owner of the company's securities. These are typically seen after a company IPOs when insiders make their first transactions."
dictOfReportExplanations.S8 = "Form S-8 allows public companies to register securities it offers as part of an employee benefit plan."
dictOfReportExplanations.twenty20FR12G = "A filing with the SEC which is required when a non-U.S. company wishes to issue securities for purchase on U.S. exchanges."
dictOfReportExplanations.twenty20FR12B = "Form 20FR12B is a filing with the SEC used to register the securities, debt or equity, of a foreign company that wishes to trade on U.S. exchanges."
dictOfReportExplanations.twentyF = "Form 20-F is a form issued by the SEC that must be submitted by all 'foreign private issuers' with listed equity shares on exchanges in the United States."
dictOfReportExplanations.D = "Used to file a notice of an exempt offering of securities under Regulation D of the U.S. Securities and Exchange Commission. Commission rules require the notice to be filed by companies and funds that have sold securities without registration under the Securities Act of 1933 in an offering based on a claim of exemption."


//Chart.js variable




function updateChart(dataOfStock){
  // myLineChart.data.labels.pop();
  // myLineChart.data.datasets.forEach((dataset) => {
  //       dataset.data.pop();
  //   });
var oldCanvas = document.getElementById("myChart");
if(oldCanvas){
  oldCanvas.remove();
}  
var oldChart = document.getElementsByClassName("chartjs-size-monitor")[0];
if(oldChart){
  oldChart.remove();
}

  var canvas = document.createElement("canvas");
canvas.setAttribute("id", "myChart");
document.getElementById("chartContainer").appendChild(canvas);

var ctx = document.getElementById('myChart').getContext('2d');
var myLineChart = new Chart(ctx, {
  // The type of chart we want to create
  type: 'line',
  // The data for our dataset
  data: {
      labels: [],
      datasets: [{
        label: "Cash and Cash Equivalent",
        backgroundColor: '#b5bedc',
        borderColor: '#b5bedc',
        data: [],
        fill: false, 
        },
        {
          label: "Assets",
          backgroundColor: '#b9d9e6',
          borderColor: '#b9d9e6',
          data: [],
          hidden: true,
          fill: false,
        },
        {
          label: "Net Profit/ Loss",
          backgroundColor: '#659ddb',
          borderColor: '#659ddb',
          data: [],
          fill: false,
        },
        {
          label: "Revenue",
          backgroundColor: '#d39995',
          borderColor: '#d39995',
          data: [],
          fill: false,
        }
        ]
    },

    // Configuration options go here
    options: {

        

        scales: {
        yAxes: [{
           ticks: {
    beginAtZero:true,
    userCallback: function(value, index, values) {
        value = value.toString();
        // if (dataOfStock["graphStats"]["assets"] !=) {}
        var counter0 = 0;
        for(x in dataOfStock["graphStats"]["assets"]){
          if(x){
            counter0++;
          }
        }
        var counter1 = 0;
        for(x in dataOfStock["graphStats"]["assets"]){
          if(x){
            counter1++;
          }
        }
        var counter2 = 0;
        for(x in dataOfStock["graphStats"]["assets"]){
          if(x){
            counter2++;
          }
        }
        var counter3 = 0;
        for(x in dataOfStock["graphStats"]["assets"]){
          if(x){
            counter3++;
          }
        }
        if(counter0 != 0 && counter1 != 0 && counter2 != 0 && counter3 != 0){
          document.getElementById("noDataChat").style.display = "none";
          value = value/1000000;
          value = value/1000;
        if (value % 1 != 0) {
          value = value*1000;
          return value + "(M)";
        }
        if(value === 0){
          return value;
        } else {
          return value + "(B)";
        }
      } else {
          document.getElementById("noDataChat").style.display = "block";
      }
        
        
    }
},
        gridLines: {
                    display: true,
                }, 

        }],
        xAxes: [{ 
        gridLines: {
                    display: true,
                },
          ticks: {
                  fontColor: "#7f7f7f", // this here
                },
        }]
      }
        }
});

  listOfQs = [];
  //get the following array: arrayOfTags =  ["cash", "assets", "net income", "revenue"]
  var arrayOfTags = [];
  for (x in dataOfStock["graphStats"]){
    arrayOfTags.push(x);
  }
  for(var i = 0; i < arrayOfTags.length; i++){
    for(y in dataOfStock["graphStats"][arrayOfTags[i]]){
      listOfQs.push(y.split(" ")[1] + " " + y.split(" ")[0]);
    }
  }
  //remove duplicates:
  uniqListOfQs = listOfQs.filter(function(item, pos) {
    return listOfQs.indexOf(item) == pos;
  })
  //sort by quarters 
  uniqListOfQs.sort();
  //return from "2017 Q3" to "Q3 2017"
  for(var i = 0; i < uniqListOfQs.length; i++){
    uniqListOfQs[i] = uniqListOfQs[i].split(" ")[1] + " " + uniqListOfQs[i].split(" ")[0];
  }

  myLineChart.data.labels = uniqListOfQs;

  for(var i = 0; i < arrayOfTags.length; i++){
    for(var j = 0; j < uniqListOfQs.length; j++){
      //get stat of tag in quarter
      stat = dataOfStock["graphStats"][arrayOfTags[i]][uniqListOfQs[j]];
      if(stat){
        myLineChart.data.datasets[i].data[j] = parseInt(stat.replace(/,/g, '').replace('$', ''), 10);;  
      }
      
    }
  }

  // var labelsArray = [];
  // var dataArray = [];
  // for(var i = 0; i < arrayOfData.length; i++){
  //   tempArray = dataOfStock["graphStats"][arrayOfData[i]];
  //   tempArrayData = []
  //   tempLabelArray = []
  //   for(y in tempArray){
  //     labelsArray.push(y);
  //     tempLabelArray.push(y)
  //     tempArrayData.push(tempArray[y]);
  //   }
  //   dataArray.push(tempArrayData.reverse());
  //   dataArray.push(tempLabelArray.reverse());
  // }

  // //remove duplicates
  // labelsArray = labelsArray.filter(function(item, pos) {
  //   return labelsArray.indexOf(item) == pos;
  // }).reverse();

  // myLineChart.data.labels = labelsArray;
  
  // cashArray = dataArray[0].map(function(item){
  //                                 return parseInt(item.replace(/,/g, ''), 10);
  //                             });
  // for(var i = 0; i < cashArray.length; i++){
  //   myLineChart.data.datasets[0].data[i] = cashArray[i];
  // }

  // assetsArray = dataArray[2].map(function(item){
  //                                 return parseInt(item.replace(/,/g, ''), 10);
  //                             });
  // for(var i = 0; i < assetsArray.length; i++){
  //   myLineChart.data.datasets[1].data[i] = assetsArray[i];
  // }

  // netIncomeArray = dataArray[4].map(function(item){
  //                                 return parseInt(item.replace(/,/g, ''), 10);
  //                             });
  // for(var i = 0; i < netIncomeArray.length; i++){
  //   myLineChart.data.datasets[2].data[i] = netIncomeArray[i];
  // }

  // revenueArray = dataArray[6].map(function(item){
  //                                 return parseInt(item.replace(/,/g, ''), 10);
  //                             });
  // for(var i = 0; i < revenueArray.length; i++){
  //   myLineChart.data.datasets[3].data[i] = revenueArray[i];
  // }

  myLineChart.update();
  

}

function wrongSymbolPressed(){
  document.getElementById("wrongSymbol").style.display = "none";
  document.getElementById("wrongSymbolPopup").style.display = "none";
}
function navColor() {
   $('.navbar').fadeTo(450,1, function() {
      $(this).css("backgroundColor", "black");
      $(this).css("boxShadow", "0 0 30px #333");
      $('.navSocial').css("color", "white");
    });
}

//main screen search - first
$(".search-btn").click(function(){
  if ($(".search-bar").val().length != 0) {
    document.getElementById("loadingMain").style.display = "block";
    searchFetch(document.getElementsByClassName("search-bar")[0].value.toLowerCase(), false); 
  } else {
      document.getElementById("noDataMain").style.display = "block";
      setTimeout(noDataMainFunc, 2000);
  }
})

//Press Enter In Search Bar in main - first
$(".search-bar").keypress(function(event){
  //changed here
  var englishAlphabetAndWhiteSpace = /[A-Za-z]/g;
  var key = String.fromCharCode(event.which);
  if (event.keyCode == 37 || event.keyCode == 39 || englishAlphabetAndWhiteSpace.test(key)) {
        return true;
    }
  if (!(event.keyCode == 37 || event.keyCode == 39 || event.which===13 || englishAlphabetAndWhiteSpace.test(key))) {
      document.getElementById("wrongSymbol").style.display = "block";
      setTimeout(wrongSymbolPressed, 2000);
      //add here that if the symbol is not correct from the file of stocks
    }
  if(event.which===13) {
        if ($(".search-bar").val().length != 0) {
          document.getElementById("loadingMain").style.display = "block";
          searchFetch(document.getElementsByClassName("search-bar")[0].value.toLowerCase(), false);
        } else {
            document.getElementById("noDataMain").style.display = "block";
            setTimeout(noDataMainFunc, 2000);
        }
    }
  return false;  
});
$('.search-bar, #search-input-popup, .search-bar-top').on("paste", function (e) {
    e.preventDefault();
});

function search(isLoadMore){ 
        $("#firstSearch").fadeOut(500,function(){       
          $("#result, #search-top-hidden").fadeIn(500);        
          if(!isLoadMore){
            $('html, body').animate({ scrollTop: 0 }, 'fast');         
          }
        });
}

//when clicked esc in general on the screen - you can add whatever you want to close
var KEYCODE_ESC = 27;
$(document).keyup(function(e) {
  if (e.keyCode == KEYCODE_ESC) $('.fa-times').click();
});
//top search - no pop up
$(".search-btn-top").click(function(){
    // secondSearch();
    $("#search-input-popup").val("");
    $(this).focusout();
    searchTop();
});
$(".search-bar-top").keypress(function(event){
  return false; 
});

//top search - no pop up
function secondSearch(){
        //initialize the search
        searchFetch($(".search-bar-top ").val().toLowerCase(), false);
        $('html, body').animate({ scrollTop: 0 }, 'fast');
        $(".search-bar-top").focusout();
}

//top search - pop up
$(".fa-search").click(function(){
  if ($("#search-input-popup").val().length != 0) {
    document.getElementById("loadingPopup").style.display = "block";
    searchFetch($("#search-input-popup").val().toLowerCase(), false);
    $(".search-bar-top").val($("#search-input-popup").val()); 
  } else {
        document.getElementById("noDataPopup").style.display = "block";
        setTimeout(noDataPopupFunc, 2300);
  }
})


//top search - pop up press enter
$("#search-input-popup").keypress(function(event){
  var englishAlphabetAndWhiteSpace = /[A-Za-z]/g;
  var key = String.fromCharCode(event.which);
  if (event.keyCode == 37 || event.keyCode == 39 || englishAlphabetAndWhiteSpace.test(key)) {
        return true;
    }
  if (!(event.keyCode == 37 || event.keyCode == 39 || event.which===13 || englishAlphabetAndWhiteSpace.test(key))) {
      document.getElementById("wrongSymbolPopup").style.display = "block";
      setTimeout(wrongSymbolPressed, 2000);
      //add here that if the symbol is not correct from the file of stocks
    }
  if(event.which===13) {
    if ($("#search-input-popup").val().length != 0) {
      document.getElementById("loadingPopup").style.display = "block";
      searchFetch($("#search-input-popup").val().toLowerCase(), false);
      $(".search-bar-top").val($("#search-input-popup").val());
      // $(this).focusout();
    } else {
        document.getElementById("noDataPopup").style.display = "block";
        setTimeout(noDataPopupFunc, 2300); 
    }
  }
  return false; 
});


$(".search-bar-top").click(function(){
    $("#search-input-popup").val("");
    $(this).focusout();
    searchTop();
})

function searchTop() {
  $("#search-popup-show").fadeIn(200);
  $("#search-input-popup").focus();
  document.getElementById("loadingPopup").style.display = "none";
  $('html, body').animate({ scrollTop: 0 }, 'fast');

  
}
// When clicking on the search icon
$(".fa-times").click(function(){
    $("#search-popup-show").fadeOut(1);
//add here that only if the symbol is correct
    $("#search-input-popup").val($("#search-input-popup").val());

})

//click on load more

function onLoadMoreClick(){
  isLoadMore = true;
  document.getElementById("loadingLoadMore").style.display = "block";
  console.log("im here");
  searchFetch(currentStock, isLoadMore);
  isLoadMore = false;
}

function noDataMainFunc() {
  document.getElementById("noDataMain").style.display = "none";
}
function noDataLoadMoreFunc() {
  document.getElementById("noDataLoadMore").style.display = "none";
}
function noDataPopupFunc() {
  document.getElementById("noDataPopup").style.display = "none";
} 


function searchFetch(stockSymbol, isLoadMore){
  isFirstTime = true;
  if(isLoadMore){
    globalStart += 10;
  } else {
    currentStock = stockSymbol;
    globalStart = 0;
  }
  fetch("/search/" + stockSymbol + "/" + globalStart + "/" + "10", {
    cache: 'no-cache', 
    credentials: 'same-origin',
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    method: 'GET',
    mode: 'cors', 
    redirect: 'follow',
    referrer: 'no-referrer',
    })
    .then(function(res){
      return res.text();
    })
    .then(function(data){
      if (data == 'null'){
        return data;
      } else {
        var dataOfStock = JSON.parse(data);
        //search google for news
        fetch("/news/" + dataOfStock["companyName"].replace(",", "").replace(".", "") + "/" + dataOfStock["stockSymbol"], {
          cache: 'no-cache', 
          credentials: 'same-origin',
          headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
          },
          method: 'GET',
          mode: 'cors', 
          redirect: 'follow',
          referrer: 'no-referrer',
          })
        .then(function(res){
          return res.text();
        })
        .then(function(newsData){
          var newsData = JSON.parse(newsData);
          var cardContainer = document.getElementsByClassName("card bg-light mb-3")[0];
          cardContainer.innerHTML = "";
          for(var i = 0; i < newsData.length; i++){
            var divNews = document.createElement("div");
            divNews.setAttribute("class", "card-body");

            cardContainer.appendChild(divNews);

            var h5NewsA = document.createElement("a");
            h5NewsA.setAttribute("class", "card-title");
            h5NewsA.setAttribute("href", "https://www." + newsData[i]["headline_url"]);
            h5NewsA.setAttribute("target", "_blank");
            h5NewsA.innerHTML = newsData[i]["headline"];
            divNews.appendChild(h5NewsA);

            var dateAndSource = document.createElement("p");
            dateAndSource.setAttribute("class", "card-text");
            dateAndSource.innerHTML = newsData[i]["source_and_date"];

            divNews.appendChild(dateAndSource);

            var pNews = document.createElement("p");
            pNews.setAttribute("class", "card-text");
            pNews.innerHTML = newsData[i]["content"];

            divNews.appendChild(pNews);
          }
        });
        ticker = dataOfStock["stockSymbol"];
        console.log(dataOfStock);
        if(!isLoadMore){
          updateChart(dataOfStock);
          createStatsTable(dataOfStock);
          document.getElementsByClassName("stockName")[0].innerHTML = ticker.toUpperCase();
          if(dataOfStock["going concern"] == false){
            document.getElementById("concernDiv").style.display = "none";
          } else {
            document.getElementById("concernDiv").style.display = "block";
          }
        }
        
        //console.log(typeof(dataOfStock["graphStats"]));
        var numberOfReports = getNumberOfReports(dataOfStock);

        var buttonToRemove = document.getElementById("loadMoreButton");
        var loadingLoadMoreH3ToRemove = document.getElementById("loadingLoadMore");
        var noDataLoadMoreToRemove = document.getElementById("noDataLoadMore");
        if(buttonToRemove){
          buttonToRemove.remove();
          loadingLoadMoreH3ToRemove.remove();
          noDataLoadMoreToRemove.remove();
        }

        if(!isLoadMore){
          indexOfEnglishNumbers = 0;
          document.getElementsByClassName("scrollDiv")[0].remove();
          newUl = document.createElement("div");
          newUl.setAttribute("class", "scrollDiv");

          ulParent = document.getElementsByClassName("ul")[0];
          ulParent.appendChild(newUl);
        }
      
        createStockSummery(dataOfStock);
        for(var i = 1; i <= numberOfReports; i++){
          createNewCard(dataOfStock["reportNo" + i], i, numberOfReports, isLoadMore);
        }

        $(".fa-plus").click(function(){
          this.style.display = "none";
          document.getElementsByClassName("fa-minus")[this.id].style.display = "block";
        });
        $(".fa-minus").click(function(){
          this.style.display = "none";
          document.getElementsByClassName("fa-plus")[this.id].style.display = "block";
        });
      }
      if(isLoadMore){
        saveBtn();
      }
      return;

    })

    .then(function(data){
      if(data != "null"){
        search(isLoadMore);
        $("#search-popup-show").fadeOut(1);
        getStockData();
        navColor();
      } else {
        //couldnt find data about the stock
          if (isLoadMore) {
            //load more, screen
            document.getElementById("noDataLoadMore").style.display = "block";
            setTimeout(noDataLoadMoreFunc, 2300);
            document.getElementById("loadingLoadMore").style.display = "none";
          } else {
              if (document.getElementById("search-popup-show").style.display == "block") {
                //popup screen
                document.getElementById("noDataPopup").style.display = "block";
                setTimeout(noDataPopupFunc, 2300);
                document.getElementById("loadingPopup").style.display = "none";
              } else {
                //Main screen
                document.getElementById("noDataMain").style.display = "block";
                setTimeout(noDataMainFunc, 2000);
                document.getElementById("loadingMain").style.display = "none";
              }
          }
        console.log("there is no data to show");
      }
      
    })
   

}

function getNumberOfReports(dataOfStock){
  var i = 1;
  while(dataOfStock["reportNo" + i] != null){
    i++;
  }
  return i - 1;
}

function createNewCard(reports, i, size, isLoadMore){
  
  //dealing with border for the load more case
  if(isLoadMore){
    var ListOfElements = document.getElementsByClassName("lastAccordion");
    if(ListOfElements.length == 1){
      var element = ListOfElements[0];
      var newNode = document.createElement("div");
      newNode.setAttribute("class", "border2");
      element.parentNode.insertBefore(newNode, element.nextSibling);
      // element.removeAttribute("class");
      element.classList.remove("lastAccordion");
    }
  }

  reportType = reports["reportType"];

  accordionDiv = document.createElement("div");
  accordionDiv.setAttribute("id", "accordion");
  if(i == size){
    accordionDiv.setAttribute("class", "lastAccordion");
  }

  document.getElementsByClassName("scrollDiv")[0].appendChild(accordionDiv);

  cardDiv = document.createElement("div");
  cardDiv.setAttribute("class", "card");

  accordionDiv.appendChild(cardDiv);

  cardHeaderDiv = document.createElement("div");
  cardHeaderDiv.setAttribute("class", "card-header");
  cardHeaderDiv.setAttribute("id", "heading" + indexOfEnglishNumbers);

  cardDiv.appendChild(cardHeaderDiv);

  h5 = document.createElement("h5");
  h5.setAttribute("class", "mb-0");

  cardHeaderDiv.appendChild(h5);

  li = document.createElement("li");
  li.setAttribute("class", "li");

  h5.appendChild(li);

  iQuestion = document.createElement("i");
  iQuestion.setAttribute("class", "fas fa-question tooltip1");

  spanInsideiQuestion = document.createElement("span");
  spanInsideiQuestion.setAttribute("class", "tooltiptext1");
   if(reportType.toLowerCase() == "10-k" || reportType.toLowerCase() == "10-k/a" ){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["tenK"];  
   } else if(reportType.toLowerCase() == "10-q" || reportType.toLowerCase() == "10-q/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["tenQ"]; 
   } else if(reportType.toLowerCase() == "8-k" || reportType.toLowerCase() == "8-k/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["eightK"]; 
   } else if(reportType.toLowerCase() == "form 4" || reportType.toLowerCase() == "form 4/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["form4"]; 
   } else if(reportType.toLowerCase() == "sd" || reportType.toLowerCase() == "sd/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["SD"]; 
   } else if(reportType.toLowerCase() == "f-1" || reportType.toLowerCase() == "f-1/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["f1"]; 
   } else if(reportType.toLowerCase() == "sc 13d" || reportType.toLowerCase() == "sc 13d/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["SC13D"]; 
   } else if(reportType.toLowerCase() == "sc 13g" || reportType.toLowerCase() == "sc 13g/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["SC13G"]; 
   } else if(reportType.toLowerCase() == "6-k" || reportType.toLowerCase() == "6-k/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["sixK"]; 
   } else if(reportType.toLowerCase() == "424b5" || reportType.toLowerCase() == "424b5/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["four24B5"]; 
   } else if(reportType.toLowerCase() == "corresp" || reportType.toLowerCase() == "corresp/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["CORRESP"]; 
   } else if(reportType.toLowerCase() == "effect" || reportType.toLowerCase() == "effect/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["EFFECT"]; 
   } else if(reportType.toLowerCase() == "f-3" || reportType.toLowerCase() == "f-3/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["F3"]; 
   } else if(reportType.toLowerCase() == "20-f" || reportType.toLowerCase() == "20-f/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["twentyF"]; 
   } else if(reportType.toLowerCase() == "20fr12b" || reportType.toLowerCase() == "20fr12b/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["twenty20FR12B"]; 
   } else if(reportType.toLowerCase() == "20fr12g" || reportType.toLowerCase() == "20fr12g/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["twenty20FR12G"]; 
   } else if(reportType.toLowerCase() == "s-8" || reportType.toLowerCase() == "s-8/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["S8"]; 
   } else if(reportType.toLowerCase() == "form 3" || reportType.toLowerCase() == "form 3/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["form3"]; 
   } else if(reportType.toLowerCase() == "form 5" || reportType.toLowerCase() == "form 5/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["form5"]; 
   } else if(reportType.toLowerCase() == "s-1" || reportType.toLowerCase() == "s-1/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["S1"]; 
   } else if(reportType.toLowerCase() == "8-a12b" || reportType.toLowerCase() == "8-a12b/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["eightA12B"]; 
   } else if(reportType.toLowerCase() == "def 14a" || reportType.toLowerCase() == "def 14a/a"){
      spanInsideiQuestion.innerHTML = dictOfReportExplanations["DEF14A"]; 
   } else if(reportType.toLowerCase() == "d" || reportType.toLowerCase() == "d/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["D"];
   } else if(reportType.toLowerCase() == "f-3" || reportType.toLowerCase() == "f3/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["F3"];
   } else if(reportType.toLowerCase() == "x-17f-1a" || reportType.toLowerCase() == "x-17f-1a/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["X17F1A"];
   } else if(reportType.toLowerCase() == "x-17a-19" || reportType.toLowerCase() == "x-17a-19/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["X17A19"];
   } else if(reportType.toLowerCase() == "wb-app" || reportType.toLowerCase() == "wb-app/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["WBAPP"];
   } else if(reportType.toLowerCase() == "th" || reportType.toLowerCase() == "th/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["TH"];
   } else if(reportType.toLowerCase() == "tcr" || reportType.toLowerCase() == "tcr/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["TCR"];
   } else if(reportType.toLowerCase() == "ta-w" || reportType.toLowerCase() == "ta-w/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["TAW"];
   } else if(reportType.toLowerCase() == "ta-1" || reportType.toLowerCase() == "ta-1/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["TA1"];
   } else if(reportType.toLowerCase() == "ta-2" || reportType.toLowerCase() == "ta-2/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["TA2"];
   } else if(reportType.toLowerCase() == "t-6" || reportType.toLowerCase() == "t-6/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["T6"];
   } else if(reportType.toLowerCase() == "t-4" || reportType.toLowerCase() == "t-4/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["T4"];
   } else if(reportType.toLowerCase() == "t-3" || reportType.toLowerCase() == "t-3/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["T3"];
   } else if(reportType.toLowerCase() == "t-2" || reportType.toLowerCase() == "t-2/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["T2"];
   } else if(reportType.toLowerCase() == "t-1" || reportType.toLowerCase() == "t-1/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["T1"];
   } else if(reportType.toLowerCase() == "sip" || reportType.toLowerCase() == "sip/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["SIP"];
   } else if(reportType.toLowerCase() == "sf-3" || reportType.toLowerCase() == "sf-3/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["SF3"];
   } else if(reportType.toLowerCase() == "sf-1" || reportType.toLowerCase() == "sf-1/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["SF1"];
   } else if(reportType.toLowerCase() == "se" || reportType.toLowerCase() == "se/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["SE"];
   } else if(reportType.toLowerCase() == "sdr" || reportType.toLowerCase() == "sdr/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["SDR"];
   } else if(reportType.toLowerCase() == "sci" || reportType.toLowerCase() == "sci/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["SCI"];
   } else if(reportType.toLowerCase() == "sbse-w" || reportType.toLowerCase() == "sbse-w/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["SBSEW"];
   } else if(reportType.toLowerCase() == "sbse-c" || reportType.toLowerCase() == "sbse-c/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["SBSEC"];
   } else if(reportType.toLowerCase() == "sbse-bd" || reportType.toLowerCase() == "sbse-bd/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["SBSEBD"];
   } else if(reportType.toLowerCase() == "sbse-a" || reportType.toLowerCase() == "sbse-a/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["SBSEA"];
   } else if(reportType.toLowerCase() == "sbse" || reportType.toLowerCase() == "sbse/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["SBSE"];
   } else if(reportType.toLowerCase() == "s-20" || reportType.toLowerCase() == "s-20/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["S20"];
   } else if(reportType.toLowerCase() == "s-11" || reportType.toLowerCase() == "s-11/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["S11"];
   } else if(reportType.toLowerCase() == "s-6" || reportType.toLowerCase() == "s-6/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["S6"];
   } else if(reportType.toLowerCase() == "s-4" || reportType.toLowerCase() == "s-4/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["S4"];
   } else if(reportType.toLowerCase() == "s-3" || reportType.toLowerCase() == "s-3/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["S3"];
   } else if(reportType.toLowerCase() == "r31" || reportType.toLowerCase() == "r31/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["R31"];
   } else if(reportType.toLowerCase() == "pilot" || reportType.toLowerCase() == "pilot/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["PILOT"];
   } else if(reportType.toLowerCase() == "pf" || reportType.toLowerCase() == "pf/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["PF"];
   } else if(reportType.toLowerCase() == "nrsro" || reportType.toLowerCase() == "nrsro/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["NRSRO"];
   } else if(reportType.toLowerCase() == "n-sar" || reportType.toLowerCase() == "n-sar/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["NSAR"];
   } else if(reportType.toLowerCase() == "n-q" || reportType.toLowerCase() == "n-q/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["NQ"];
   } else if(reportType.toLowerCase() == "n-px" || reportType.toLowerCase() == "n-px/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["NPX"];
   } else if(reportType.toLowerCase() == "n-port" || reportType.toLowerCase() == "n-port/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["NPORT"];
   } else if(reportType.toLowerCase() == "n-mfp" || reportType.toLowerCase() == "n-mfp/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["NMFP"];
   } else if(reportType.toLowerCase() == "n-liquid" || reportType.toLowerCase() == "n-liquid/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["NLIQUID"];
   } else if(reportType.toLowerCase() == "n-csr" || reportType.toLowerCase() == "n-csr/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["NCSR"];
   } else if(reportType.toLowerCase() == "n-cr" || reportType.toLowerCase() == "n-cr/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["NCR"];
   } else if(reportType.toLowerCase() == "n-cen" || reportType.toLowerCase() == "n-cen/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["NCEN"];
   } else if(reportType.toLowerCase() == "n-54c" || reportType.toLowerCase() == "n-54c/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["N54C"];
   } else if(reportType.toLowerCase() == "n-54a" || reportType.toLowerCase() == "n-54a/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["N54A"];
   } else if(reportType.toLowerCase() == "n-27d-1" || reportType.toLowerCase() == "n-27d-1/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["N27D1"];
   } else if(reportType.toLowerCase() == "n-23c-3" || reportType.toLowerCase() == "n-23c-3/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["N23C3"];
   } else if(reportType.toLowerCase() == "n-18f-1" || reportType.toLowerCase() == "n-18f-1/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["N18F1"];
   } else if(reportType.toLowerCase() == "n-17f-2" || reportType.toLowerCase() == "n-17f-2/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["N17F2"];
   } else if(reportType.toLowerCase() == "n-17f-1" || reportType.toLowerCase() == "n-17f-1/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["N17F1"];
   } else if(reportType.toLowerCase() == "n-17d-1" || reportType.toLowerCase() == "n-17d-1/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["N17D1"];
   } else if(reportType.toLowerCase() == "n-14" || reportType.toLowerCase() == "n-14/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["N14"];
   } else if(reportType.toLowerCase() == "n-8f" || reportType.toLowerCase() == "n-8f/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["N8F"];
   } else if(reportType.toLowerCase() == "n-8b-4" || reportType.toLowerCase() == "n-8b-4/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["N8B4"];
   } else if(reportType.toLowerCase() == "n-8b-2" || reportType.toLowerCase() == "n-8b-2/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["N8B2"];
   } else if(reportType.toLowerCase() == "n-8a" || reportType.toLowerCase() == "n-8a/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["N8A"];
   } else if(reportType.toLowerCase() == "n-6f" || reportType.toLowerCase() == "n-6f/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["N6F"];
   } else if(reportType.toLowerCase() == "n-6" || reportType.toLowerCase() == "n-6/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["N6"];
   } else if(reportType.toLowerCase() == "n-5" || reportType.toLowerCase() == "n-5/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["N5"];
   } else if(reportType.toLowerCase() == "n-4" || reportType.toLowerCase() == "n-4/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["N4"];
   } else if(reportType.toLowerCase() == "n-3" || reportType.toLowerCase() == "n-3/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["N3"];
   } else if(reportType.toLowerCase() == "n-2" || reportType.toLowerCase() == "n-2/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["N2"];
   } else if(reportType.toLowerCase() == "n-1a" || reportType.toLowerCase() == "n-1a/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["N1A"];
   } else if(reportType.toLowerCase() == "msdw" || reportType.toLowerCase() == "msdw/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["MSDW"];
   } else if(reportType.toLowerCase() == "msd" || reportType.toLowerCase() == "msd/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["MSD"];
   } else if(reportType.toLowerCase() == "ma-w" || reportType.toLowerCase() == "ma-w/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["MAW"];
   } else if(reportType.toLowerCase() == "ma-nr" || reportType.toLowerCase() == "ma-nr/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["MANR"];
   } else if(reportType.toLowerCase() == "ma-i" || reportType.toLowerCase() == "ma-i/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["MAI"];
   } else if(reportType.toLowerCase() == "ma" || reportType.toLowerCase() == "ma/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["MA"];
   } else if(reportType.toLowerCase() == "id" || reportType.toLowerCase() == "id/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["ID"];
   } else if(reportType.toLowerCase() == "f-x" || reportType.toLowerCase() == "f-x/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["FX"];
   } else if(reportType.toLowerCase() == "f-n" || reportType.toLowerCase() == "f-n/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["FN"];
   } else if(reportType.toLowerCase() == "f-80" || reportType.toLowerCase() == "f-80/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["F80"];
   } else if(reportType.toLowerCase() == "f-10" || reportType.toLowerCase() == "f-10/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["F10"];
   } else if(reportType.toLowerCase() == "f-8" || reportType.toLowerCase() == "f-8/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["F8"];
   } else if(reportType.toLowerCase() == "f-7" || reportType.toLowerCase() == "f-7/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["F7"];
   } else if(reportType.toLowerCase() == "f-6" || reportType.toLowerCase() == "f-6/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["F6"];
   } else if(reportType.toLowerCase() == "f-4" || reportType.toLowerCase() == "f-4/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["F4"];
   } else if(reportType.toLowerCase() == "custody" || reportType.toLowerCase() == "custody/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["CUSTODY"];
   } else if(reportType.toLowerCase() == "cfportal" || reportType.toLowerCase() == "cfportal/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["CFPORTAL"];
   } else if(reportType.toLowerCase() == "cb" || reportType.toLowerCase() == "cb/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["CB"];
   } else if(reportType.toLowerCase() == "ca-1" || reportType.toLowerCase() == "ca-1/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["CA1"];
   } else if(reportType.toLowerCase() == "bdw" || reportType.toLowerCase() == "bdw/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["BDW"];
   } else if(reportType.toLowerCase() == "bd-n" || reportType.toLowerCase() == "bd-n/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["BDN"];
   } else if(reportType.toLowerCase() == "bd" || reportType.toLowerCase() == "bd/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["BD"];
   } else if(reportType.toLowerCase() == "ats-r" || reportType.toLowerCase() == "ats-r/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["ATSR"];
   } else if(reportType.toLowerCase() == "ats" || reportType.toLowerCase() == "ats/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["ATS"];
   } else if(reportType.toLowerCase() == "adv-w" || reportType.toLowerCase() == "adv-w/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["ADVW"];
   } else if(reportType.toLowerCase() == "adv-nr" || reportType.toLowerCase() == "adv-nr/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["ADVNR"];
   } else if(reportType.toLowerCase() == "adv-h" || reportType.toLowerCase() == "adv-h/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["ADVH"];
   } else if(reportType.toLowerCase() == "adv-e" || reportType.toLowerCase() == "adv-e/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["ADVE"];
   } else if(reportType.toLowerCase() == "adv" || reportType.toLowerCase() == "adv/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["ADV"];
   } else if(reportType.toLowerCase() == "abs-ee" || reportType.toLowerCase() == "abs-ee/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["ABSEE"];
   } else if(reportType.toLowerCase() == "abs-15g" || reportType.toLowerCase() == "abs-15g/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["ABS15G"];
   } else if(reportType.toLowerCase() == "abs dd-15e" || reportType.toLowerCase() == "abs dd-15e/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["ABSDD15E"];
   } else if(reportType.toLowerCase() == "144" || reportType.toLowerCase() == "144/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["one44"];
   } else if(reportType.toLowerCase() == "40-f" || reportType.toLowerCase() == "40-f/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["fourtyF"];
   } else if(reportType.toLowerCase() == "25" || reportType.toLowerCase() == "25/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["twenty5"];
   } else if(reportType.toLowerCase() == "24f-2" || reportType.toLowerCase() == "24f-2/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["twenty4F2"];
   } else if(reportType.toLowerCase() == "19b-4(e)" || reportType.toLowerCase() == "19b-4(e)/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["nineteenB4E"];
   } else if(reportType.toLowerCase() == "19b-7" || reportType.toLowerCase() == "19b-7/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["nineteenB7"];
   } else if(reportType.toLowerCase() == "19b-4" || reportType.toLowerCase() == "19b-4/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["nineteenB4"];
   } else if(reportType.toLowerCase() == "18-k" || reportType.toLowerCase() == "18-k/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["eighteenK"];
   } else if(reportType.toLowerCase() == "18" || reportType.toLowerCase() == "18/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["eighteen"];
   } else if(reportType.toLowerCase() == "17-h" || reportType.toLowerCase() == "17-h/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["seventeenH"];
   } else if(reportType.toLowerCase() == "15f" || reportType.toLowerCase() == "15f/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["fifteenF"];
   } else if(reportType.toLowerCase() == "15f" || reportType.toLowerCase() == "15f/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["fifteenF"];
   } else if(reportType.toLowerCase() == "15" || reportType.toLowerCase() == "15/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["fifteen"];
   } else if(reportType.toLowerCase() == "13h" || reportType.toLowerCase() == "13h/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["thirteenH"];
   } else if(reportType.toLowerCase() == "13f" || reportType.toLowerCase() == "13f/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["thirteenF"];
   } else if(reportType.toLowerCase() == "12b-25" || reportType.toLowerCase() == "12b-25/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["twelveB25"];
   } else if(reportType.toLowerCase() == "11-k" || reportType.toLowerCase() == "11-k/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["elevenK"];
   } else if(reportType.toLowerCase() == "11-m" || reportType.toLowerCase() == "11-m/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["tenM"];
   } else if(reportType.toLowerCase() == "10-d" || reportType.toLowerCase() == "10-d/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["tenD"];
   } else if(reportType.toLowerCase() == "10" || reportType.toLowerCase() == "10/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["ten"];
   } else if(reportType.toLowerCase() == "9-m" || reportType.toLowerCase() == "9-m/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["nineM"];
   } else if(reportType.toLowerCase() == "8-a" || reportType.toLowerCase() == "8-a/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["eightA"];
   } else if(reportType.toLowerCase() == "8-m" || reportType.toLowerCase() == "8-m/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["eightM"];
   } else if(reportType.toLowerCase() == "7-m" || reportType.toLowerCase() == "7-m/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["sevenM"];
   } else if(reportType.toLowerCase() == "2-e" || reportType.toLowerCase() == "2-e/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["towE"];
   } else if(reportType.toLowerCase() == "1-z" || reportType.toLowerCase() == "1-z/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["oneZ"];
   } else if(reportType.toLowerCase() == "1-u" || reportType.toLowerCase() == "1-u/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["oneU"];
   } else if(reportType.toLowerCase() == "1-sa" || reportType.toLowerCase() == "1-sa/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["oneSA"];
   } else if(reportType.toLowerCase() == "1-n" || reportType.toLowerCase() == "1-n/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["oneN"];
   } else if(reportType.toLowerCase() == "1-k" || reportType.toLowerCase() == "1-k/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["oneK"];
   } else if(reportType.toLowerCase() == "1-e" || reportType.toLowerCase() == "1-e/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["oneE"];
   } else if(reportType.toLowerCase() == "form 1" || reportType.toLowerCase() == "form 1/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["one"];
   } else if(reportType.toLowerCase() == "1-a" || reportType.toLowerCase() == "1-a/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["oneA"];
   } else if(reportType.toLowerCase() == "424b4" || reportType.toLowerCase() == "424b4/a"){
    spanInsideiQuestion.innerHTML = dictOfReportExplanations["four24B4"];
   }
  



  iQuestion.appendChild(spanInsideiQuestion);

  spanReportName = document.createElement("span");
  spanReportName.setAttribute("class", "firstli")
  spanReportName.innerHTML = reportType;  
  
  

  spanPlusIcon = document.createElement("span");
  spanPlusIcon.setAttribute("data-toggle", "collapse");
  spanPlusIcon.setAttribute("data-target", "#collapse" + indexOfEnglishNumbers);
  spanPlusIcon.setAttribute("aria-expanded", "false");
  spanPlusIcon.setAttribute("aria-controls", "collapse" + indexOfEnglishNumbers);

  iPlus = document.createElement("i");
  iPlus.setAttribute("class", "fas fa-plus");
  iPlus.setAttribute("id", indexOfEnglishNumbers);

  iMinus = document.createElement("i");
  iMinus.setAttribute("class", "fas fa-minus ");
  iMinus.setAttribute("id", indexOfEnglishNumbers);
  

  spanPlusIcon.appendChild(iPlus);
  spanPlusIcon.appendChild(iMinus);

  divCollapse = document.createElement("div");
  divCollapse.setAttribute("id", "collapse" + indexOfEnglishNumbers);
  divCollapse.setAttribute("class", "collapse");
  if (indexOfEnglishNumbers == 0 && reportType.toLowerCase() != "8-k" ) {
    divCollapse.setAttribute("class", "show");
    iPlus.style.display = "none";
    iMinus.style.display = "block";
  }
  divCollapse.setAttribute("aria-labelledby", "heading" + indexOfEnglishNumbers);
  // divCollapse.setAttribute("data-parent", "#accordion");

  li.appendChild(spanReportName);
  li.appendChild(iQuestion);
  var dateSpan = document.createElement("span");
  dateSpan.setAttribute("class", "dateOfReport");
  dateSpan.innerHTML = getDate(reports["dateOfReport"]);
  // li.appendChild(dateSpan);
  li.appendChild(spanPlusIcon);
  li.appendChild(dateSpan);
  li.appendChild(divCollapse);


  hr = document.createElement("hr");
  divCardBody = document.createElement("div");
  divCardBody.setAttribute("class", "card-body");



  divCollapse.appendChild(hr);

  if(reportType.toLowerCase() == "10-k" || reportType.toLowerCase() == "10-q" || reportType.toLowerCase() == "20-f"){
    if(isFirstTime){
      try{
        if(!isLoadMore){
          warrantsTable = reports["content"]["warrantsTableCode"];
          document.getElementById("warrantsTable").innerHTML = "";
          if(warrantsTable != "False"){
            document.getElementById("warrantsTable").setAttribute("style", "display: block");
            document.getElementById("warrantsTable").insertAdjacentHTML('beforeend', warrantsTable);  
            document.getElementById("warrantsTable").firstChild.setAttribute("id", "theWarrantsTable");
            isFirstTime = false;
            var warrantsTableDiv = document.getElementById("warrantsTableDiv");
            $("#h5Warrant").remove();
            var h5Warrants = document.createElement("h5");
            h5Warrants.setAttribute("id", "h5Warrant");
            h5Warrants.innerHTML = "Warrants";
            document.getElementById("warrantsTableDiv").insertBefore(h5Warrants, document.getElementById("warrantsTableDiv").firstChild);
            document.getElementById("warrantsTableDiv").setAttribute("style", "display: block");
            $(".scrollDiv").css("max-height", "1322px");
            $("#scrollNews").css("max-height", "1380px");
          } else {
            document.getElementById("warrantsTableDiv").setAttribute("style", "display: none");
            document.getElementById("warrantsTable").setAttribute("style", "display: none");
            $("#h5Warrant").remove();
            $(".scrollDiv").css("max-height", "908px");
            $("#scrollNews").css("max-height", "1000px");
          }
        
        } else {
            document.getElementById("warrantsTableDiv").setAttribute("style", "display: none");
            document.getElementById("warrantsTable").setAttribute("style", "display: none");
            $("#h5Warrant").remove();
            $(".scrollDiv").css("max-height", "908px");
            $("#scrollNews").css("max-height", "1000px");
        } 
      } catch(err){
      }
    }
    var mesure = "";
    try{
    	if(reports["content"]["isInThousands"] == "true"){
    		mesure = " (in thousands)";
    	} else if(reports["content"]["isInMillions"] == "true"){
    		mesure = " (in millions)";
    	}

    } catch(err) {
    	//do nothing
    }
    
    //new code for popup 
    createPopUpLink(divCardBody, "Balance Sheet", reportType + " Balance Sheet" + mesure, reports["content"]["balanceSheetTableCode"]);
    counterForModals++;
    createPopUpLink(divCardBody, "Statement Of Operations", reportType + " Statement Of Operations" + mesure, reports["content"]["operationsTableCode"]);
    counterForModals++;
    createPopUpLink(divCardBody, "Cash Flow", reportType + " Cash Flow" + mesure, reports["content"]["cashFlowTable"]);
    counterForModals++;

    stringOfReport = reports["htmlOfReport"];
    stringOfReport = stringOfReport.replace(/width:8.5in/g, '');

    createPopUpLink(divCardBody, "See Full Report", reportType, stringOfReport);
    counterForModals++;


  } else if(reportType.toLowerCase() == "form 4" || reportType.toLowerCase() == "form 4/a"){
    //name of owner
    ownerP = document.createElement("p");
    ownerP.setAttribute("id", "ownerP");
    ownerP.innerHTML = reports["content"]["nameOfOwner"];

    divCardBody.appendChild(ownerP);
    var positionP;
    if(reports["content"]["position"] != false){
      positionP = document.createElement("p");
      positionP.setAttribute("id", "positionP");
      positionP.innerHTML = reports["content"]["position"];
      divCardBody.appendChild(positionP);
    }
    
    
    var index = 1;
    while(reports["content"]["transaction" + index]){
      var transaction = "";
      var buyOrSell = reports["content"]["transaction" + index]["buyOrSell"];
      if(buyOrSell == "D"){
        transaction = "<span style='color: red'>sold</span>"; 
      } else {
        transaction = "<span style='color: green'>bought</span>";
      }

      var form4P = document.createElement("p");
      form4P.innerHTML = "<li style= 'list-style: disc;'>" + transaction + " " + reports["content"]["transaction" + index]["amount"] + " shares at $" + reports["content"]["transaction" + index]["price"] + " on " + reports["content"]["transaction" + index]["transactionDate"] + "</li>"; 
      
      divCardBody.appendChild(form4P);
      index++;
    }

    createPopUpLink(divCardBody, "See Full Report", reportType, reports["htmlOfReport"]);
    counterForModals++;

    //amount
    
    //url
    

  } else if(reportType.toLowerCase() == "8-k" || reportType.toLowerCase() == "8-k/a"){
    //content of messege
    var contentP = document.createElement("p");
    contentP.innerHTML = reports["content"];

    divCardBody.appendChild(contentP);

    createPopUpLink(divCardBody, "See Full Report", reportType, reports["htmlOfReport"]);
    counterForModals++;
    
  } else if(reportType.toLowerCase() == "424b2" || reportType.toLowerCase() == "424b2/a" || reportType.toLowerCase() == "424b5" || reportType.toLowerCase() == "424b5/a" || reportType.toLowerCase() == "424b4" || reportType.toLowerCase() == "424b4/a"){
    
    var arrayOfOfferings = reports["content"]["sharesOffered"];
    arrayOfOfferings = arrayOfOfferings.replace("[", "").replace("]", "").replace("\'", "").replace("\'", "");
    
    var contentP = document.createElement("p");
    contentP.innerHTML = arrayOfOfferings;
    divCardBody.appendChild(contentP);
    
    stringOfReport = reports["htmlOfReport"];
    stringOfReport = stringOfReport.replace(/img.*>/g, "img src=" + reports["content"]["logoAddress"] + ">");

    createPopUpLink(divCardBody, "See Full Report", reportType, stringOfReport);
    counterForModals++;

  } else {
    createPopUpLink(divCardBody, "See Full Report", reportType, reports["htmlOfReport"]);
    counterForModals++;
  }

  divCollapse.appendChild(divCardBody)

  indexOfEnglishNumbers++;

  if(i != size){
    //add vertical line if it's not the last one
    var divBorder = document.createElement("div");
    divBorder.setAttribute("class", "border2");
    document.getElementsByClassName("scrollDiv")[0].appendChild(divBorder);
  } else {
    //here should go h3 loadingLoadMore element
    loadingLoadMoreH3 = document.createElement("h3");
    loadingLoadMoreH3.setAttribute("id", "loadingLoadMore");
    loadingLoadMoreH3.setAttribute("class", "flash");
    loadingLoadMoreH3.innerHTML = "TickerStories";

      loadingDiv = document.createElement("div");
      loadingDiv.setAttribute("class", "loading");
      loadingLoadMoreH3.appendChild(loadingDiv);

    document.getElementsByClassName("ul")[0].appendChild(loadingLoadMoreH3);
    //here is a nodata information
    noDataLoadMore = document.createElement("p");
    noDataLoadMore.setAttribute("id", "noDataLoadMore");
    noDataLoadMore.innerHTML = "There is no more data for this ticker, please try another time";
    document.getElementsByClassName("ul")[0].appendChild(noDataLoadMore);

    loadMoreButton = document.createElement("button");
    loadMoreButton.setAttribute("id", "loadMoreButton");
    loadMoreButton.setAttribute("class", "btn btn-outline-dark btn-sm");
    loadMoreButton.setAttribute("type", "button");
    loadMoreButton.innerHTML = "Load More";
    loadMoreButton.addEventListener("click", onLoadMoreClick, false);
    document.getElementsByClassName("ul")[0].appendChild(loadMoreButton);
  }
}



function createWarrantsTable(dataOfStock, table){
   table.insertAdjacentHTML('beforeend', dataOfStock["content"]["warrantsTableCode"]);
}

function getDate(date){
  datesArray = date.split(" ");
  if(datesArray.length == 2){
    newDatesArray = datesArray[0].split("-");
    return newDatesArray[1] + "/" + newDatesArray[2] + "/" + newDatesArray[0];
  } else {
    dates = date.split("-");
    return dates[1] + "/" + dates[2] + "/" + dates[0];
  }
}

function createPopUpLink(divCardBody, textForP, textOfHeaderPopUp, theReport){

  divUnderDivCardBody = document.createElement("div");


    
    aBrotherDiv = document.createElement("div");
    aBrotherDiv.setAttribute("class", "modal fade");
    aBrotherDiv.setAttribute("id", "exampleModalCenter" + counterForModals);
    aBrotherDiv.setAttribute("tabindex", "-1");
    aBrotherDiv.setAttribute("role", "dialog");
    aBrotherDiv.setAttribute("aria-labelledby", "exampleModalCenterTitle");
    aBrotherDiv.setAttribute("aria-hidden", "true");

    aLunch = document.createElement("a");
    aLunch.innerHTML = textForP;
    aLunch.setAttribute("href", "");
    aLunch.setAttribute("data-toggle", "modal");
    aLunch.setAttribute("data-target", "#exampleModalCenter" + counterForModals);

    divUnderDivCardBody.appendChild(aLunch);
    // divUnderDivCardBody.appendChild(aBrotherDiv);
    document.getElementById("result").appendChild(aBrotherDiv);

      divModalDialog = document.createElement("div");
      divModalDialog.setAttribute("class", "modal-dialog modal-dialog-centered modal-lg");
      divModalDialog.setAttribute("role", "document")

      aBrotherDiv.appendChild(divModalDialog);

        divModalContent = document.createElement("div");
        divModalContent.setAttribute("class", "modal-content");

        divModalDialog.appendChild(divModalContent);


          divModalHeader = document.createElement("div");
          divModalHeader.setAttribute("class", "modal-header");

            h5ModalTitle = document.createElement("h5");
            h5ModalTitle.setAttribute("class", "modal-title");
            h5ModalTitle.setAttribute("id", "exampleModalLongTitle");
            h5ModalTitle.innerHTML = textOfHeaderPopUp;

            divModalHeader.appendChild(h5ModalTitle);

            buttonClose = document.createElement("button");
            buttonClose.setAttribute("type", "button");
            buttonClose.setAttribute("class", "close");
            buttonClose.setAttribute("data-dismiss", "modal");
            buttonClose.setAttribute("aria-label", "Close");

              spanButtonCloseChild = document.createElement("span");
              spanButtonCloseChild.setAttribute("aria-hidden", "true");
              spanButtonCloseChild.innerHTML = "&times;";


            buttonClose.appendChild(spanButtonCloseChild);

          divModalHeader.appendChild(h5ModalTitle);
          divModalHeader.appendChild(buttonClose);

          divModalBody = document.createElement("div");
          divModalBody.setAttribute("class", "modal-body");

          divInside = document.createElement("div");
          divInside.insertAdjacentHTML('beforeend', theReport );
          divModalBody.appendChild(divInside)
          



          divModalFooter = document.createElement("div");
          divModalFooter.setAttribute("class", "modal-footer");

            buttonChildFooter = document.createElement("button");
            buttonChildFooter.setAttribute("type", "button");
            buttonChildFooter.setAttribute("class", "btn btn-secondary");
            buttonChildFooter.setAttribute("data-dismiss", "modal");
            buttonChildFooter.innerHTML = "Close";

          divModalFooter.appendChild(buttonChildFooter);

          divModalContent.appendChild(divModalHeader);
          divModalContent.appendChild(divModalBody);
          divModalContent.appendChild(divModalFooter);
          divCardBody.appendChild(divUnderDivCardBody);

          if(textForP.toLowerCase() == "see full report"){
            aLunch.setAttribute("id", "seeFullReport");
            divUnderDivCardBody.style.marginTop = "20px";
          }

  //End of pop up
}

function createStockSummery(dataOfStock){
  stockSummery = dataOfStock["companyProfile"];
  document.getElementById("stockSymbol").innerHTML = dataOfStock["companyName"];
  getStreetViewImg(dataOfStock["companyAddress"]);
}


/*********Plus & Minus show and hide***********/

/*********Plus & Minus show and hide***********/

var modalPopup = document.getElementById("search-popup-show");
var modalDropdown = document.getElementById("myDropdown");
var focus2 = document.getElementsByTagName("html");

window.onclick = function(event) {
    if (event.target == modalPopup) {
        modalPopup.style.display = "none";
    }
}

/************CHART **************/

//create stats table

function createStatsTable(stockData){

  var tableDiv = document.getElementById("statsTable");
  tableDiv.innerHTML = "";

  var h5 = document.createElement("h5");
  h5.innerHTML = "Key Statistics";

  tableDiv.appendChild(h5);

  var table = document.createElement("table");
  table.setAttribute("class", "table table-hover");

  tableDiv.appendChild(table);

  var tbody = document.createElement("tbody");

  table.appendChild(tbody);

  

  var tr1 = document.createElement("tr");

  tbody.appendChild(tr1);

  var td11 = document.createElement("td");
  td11.innerHTML = "Shares Outstanding";

  var td12 = document.createElement("td");
  try{
      outstanding = stockData["sharesOutstanding"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      td12.innerHTML = outstanding;
    } catch(e) {
      td12.innerHTML = "N/A";
  }

  tr1.appendChild(td11);
  tr1.appendChild(td12);

  var tr2 = document.createElement("tr");

  tbody.appendChild(tr2);

  var td21 = document.createElement("td");
  td21.innerHTML = "Float";

  var td22 = document.createElement("td");
  td22.setAttribute("id", "floatTd");
  td22.innerHTML = stockData["float"];

  tr2.appendChild(td21);
  tr2.appendChild(td22);

  var tr3 = document.createElement("tr");

  tbody.appendChild(tr3);

  var td31 = document.createElement("td");
  td31.innerHTML = "Short Float";

  var td32 = document.createElement("td");
  td32.setAttribute("id", "testtest");
  td32.innerHTML = stockData["shortFloat"];

  tr3.appendChild(td31);
  tr3.appendChild(td32);

  var tr4 = document.createElement("tr");

  tbody.appendChild(tr4);

  var td41 = document.createElement("td");
  td41.innerHTML = "institutional Own";

  var td42 = document.createElement("td");
  td42.innerHTML = stockData["instOwn"];

  tr4.appendChild(td41);
  tr4.appendChild(td42);

  if(stockData["accumulated deficit"]){
    var tr5 = document.createElement("tr");
    tbody.appendChild(tr5);

    var td51 = document.createElement("td");
    td51.innerHTML = "Accumulated Deficit";

    var td52 = document.createElement("td");
    td52.innerHTML = stockData["accumulated deficit"];

    tr5.appendChild(td51);
    tr5.appendChild(td52);

  }

  if(stockData["total liabilities"]){
  	var tr6 = document.createElement("tr");
  	tbody.appendChild(tr6);

  	var td61 = document.createElement("td");
  	td61.innerHTML = "Total Liabilities";

  	var td62 = document.createElement("td");
    td62.innerHTML = stockData["total liabilities"];

    tr6.appendChild(td61);
    tr6.appendChild(td62);

  }

  if(stockData["last q assets"]){
  	var tr7 = document.createElement("tr");
  	tbody.appendChild(tr7);

  	var td71 = document.createElement("td");
  	td71.innerHTML = "Last Q Assets";

  	var td72 = document.createElement("td");
    td72.innerHTML = stockData["last q assets"];

    tr7.appendChild(td71);
    tr7.appendChild(td72);

  }

  if(stockData["last q cash"]){
  	var tr8 = document.createElement("tr");
  	tbody.appendChild(tr8);

  	var td81 = document.createElement("td");
  	td81.innerHTML = "Last Q Cash";

  	var td82 = document.createElement("td");
    td82.innerHTML = stockData["last q cash"];

    tr8.appendChild(td81);
    tr8.appendChild(td82);

  }

  if(stockData["last q income"]){
  	var tr9 = document.createElement("tr");
  	tbody.appendChild(tr9);

  	var td91 = document.createElement("td");
  	td91.innerHTML = "Last Q Income";

  	var td92 = document.createElement("td");
    td92.innerHTML = stockData["last q income"];

    tr9.appendChild(td91);
    tr9.appendChild(td92);

  }

}

/*
var ctx = document.getElementById('myChart').getContext('2d');
var myLineChart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "Cash and Cash Equivalent",
            backgroundColor: '#b5bedc',
            borderColor: '#b5bedc',
            data: [0, 10, 5, 2, 20, 30, 45],
            fill: true,
         
        },
        {
            label: "Assets",
            backgroundColor: '#b9d9e6',
            borderColor: '#b9d9e6',
            data: [5, 14, 7, 1, 25, 10, 45],
            fill: true,
        },
        ]
    },

    // Configuration options go here
    options: {
        scales: {
        yAxes: [{
        gridLines: {
                    display: true,
                }, 
        ticks: {
                  fontColor: "#7f7f7f",
                   // this here
                },
        }],
        xAxes: [{ 
        gridLines: {
                    display: true,
                },
          ticks: {
                  fontColor: "#7f7f7f", // this here
                },
        }]
      }
        }
    });
    */

/************CHART **************/

/************DropDown ***********/
$('#filter').click( function(event){
        //event.stopPropagation();
        $('#myDropdown').fadeToggle(1);
    });

$(document).click( function(){
      if (!$(event.target).closest(".button,.custom-control").length) {
        $('#myDropdown').hide();
      };
});
  


// $("#myDropdown").click( function(event){
//   event.stopPropagation();
//   $('#myDropdown').fadeIn(1);
// });


function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  accordion = document.getElementById("accordion");
  li = accordion.getElementsByClassName("li");

  div = document.getElementById("myDropdown");
  a = div.getElementsByClassName("custom-control");
  for (i = 0; i < a.length; i++) {
    if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}



function checkedBox() {
  div = document.getElementById("myDropdown");
  input = div.getElementsByClassName("custom-control-input");
  // var id = $('#myDropdown .custom-control-input').attr('id');
  label = div.getElementsByClassName("custom-control-label");

  for (i = 0; i < input.length; i++) {
    if (input[i].checked == false) {
      console.log("not checked");
    } else {
      choosen.push(label[i].innerHTML);
      }
  } 
}
function includeExclude() {
  var inex = document.getElementsByClassName("active includeExcludeBtn btn-outline-success").length;
  return inex;
}
function clearBtn() {
  $('.custom-control-input').prop('checked', false);
}

function report() {

  accordion = document.getElementById("accordion");
  li = document.getElementsByClassName("li");
  span = document.getElementsByClassName("firstli");
  border = document.getElementsByClassName("border2");

  for (i = 0; i < li.length; i++) {
      reports.push(span[i].innerHTML);
  }
}

function saveBtn() {
  choosen= [];
  reports = [];
  checkedBox();
  report();
  var x = includeExclude();
  if (x === 1) {
    for(q = 0; q < reports.length; q++){
      if(choosen != 0){
        for(i = 0; i < choosen.length; i++){
          if (choosen[i].toUpperCase().indexOf(reports[q].toUpperCase()) > -1) {
            li[q].style.display = "";
            if (q != (reports.length)-1) {
              border[q].style.display = "";
            }
            i = choosen.length;
          } else {
            li[q].style.display = "none";
            if (q != (reports.length)-1) {
              border[q].style.display = "none"; 
            }           
          }
      }
    } else{
          // for(e = 0; e < reports.length; e++){
            li[q].style.display = "";
            if (q != (reports.length)-1) {
              border[q].style.display = "";
            }
          // }
          }
      
    }    
  } else { 
        for(q = 0; q < reports.length; q++){
      if(choosen != 0){
        for(i = 0; i < choosen.length; i++){
          if (choosen[i].toUpperCase().indexOf(reports[q].toUpperCase()) > -1) {
            li[q].style.display = "none";
            if (q != (reports.length)-1) {
              border[q].style.display = "none";
            }
            i = choosen.length;
          } else {
            li[q].style.display = "";
            if (q != (reports.length)-1) {
              border[q].style.display = ""; 
            }           
          }
      }
    } else{
          // for(e = 0; e < reports.length; e++){
            li[q].style.display = "none";
            if (q != (reports.length)-1) {
              border[q].style.display = "none";
            }
          // }
          }
      
    }

  }
  $('#myDropdown').fadeOut(1);
  }



$(document).ready(function(){  
    $(window).scroll(function(){
      if ($("#result").css("display") == "block") {
        if ($(window).scrollTop() > $(document).height()*0.05 && ($(window).width() > 1167)){
            $(".stockName").fadeIn(200);
        }
        if ($(window).scrollTop() < $(document).height()*0.05 && ($(window).width() > 1167)){
            $(".stockName").fadeOut();
        }
      }
    });
});



$("#aboveChart, .aboveChartHr ").click(function(){
  var pHide = document.getElementsByClassName("pHide");
  var pShow = document.getElementsByClassName("pShow");
  var aboveChart = document.getElementById("aboveChart");
  aboveChart.classList.toggle("pShow");
  aboveChart.classList.toggle("pHide");
  $(".aboveChartHr").toggle();
});

//autocomplete symbols

var allStocks = [];
$.getJSON("http://localhost:8082/assets/allStocks.json", function (data) {
    $.each(data, function (index, value) {
      allStocks.push({
        value: value.symbol
      });
    });
});


$(document).ready(function() {
  $('.search-bar, #search-input-popup').autocomplete({
    source: allStocks,
    minLength: 2,
    delay: 50,
    autoFocus: true }); 
});

$.ui.autocomplete.filter = function (array, term) {
    var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
    return $.grep(array, function (value) {
        return matcher.test(value.label || value.value || value);
    });
};
$(".search-bar, #search-input-popup").autocomplete({
    open: function(event, ui) {
        $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
    }
});
  
//########################################
//get google street view img
//########################################

function getStreetViewImg(address){
  fetch("https://maps.googleapis.com/maps/api/streetview/metadata?size=300x200&location=" + address + "&key=AIzaSyCX7IhAGuNzki8Hug9Zfe2iFqkH3PKnqaM", {
    cache: 'no-cache', 
    credentials: 'same-origin',
    method: 'GET',
    mode: 'cors', 
    redirect: 'follow',
    referrer: 'no-referrer',
    })
  .then(function(res){
      return res.text();
    })
  .then(function(data){
    var google = JSON.parse(data);
    if ( google["status"] != "OK" ) {
      document.getElementById("aboveChart").innerHTML = stockSummery;
    }else {
      document.getElementById("aboveChart").innerHTML = '<img id="imgCompany" src="https://maps.googleapis.com/maps/api/streetview?size=300x200&location=' + address + '&key=AIzaSyCX7IhAGuNzki8Hug9Zfe2iFqkH3PKnqaM">' + stockSummery;
    }
  })
}
//########################################
//get stock current price and change
//########################################

function getStockData(){
  console.log("the ticker is " + ticker);
  fetch("https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + ticker + "&apikey=TRQ5P61JGL5HN7TA", {
    cache: 'no-cache', 
    credentials: 'same-origin',
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    method: 'GET',
    mode: 'cors', 
    redirect: 'follow',
    referrer: 'no-referrer',
    })
    .then(function(res){
      return res.text();
    })
    .then(function(data){
      if (data == '204'){
        console.log("something went wrong!");
      } else {
        var liveDataOfStocks = JSON.parse(data);
        console.log(liveDataOfStocks);
        h5StockPrice = document.getElementsByClassName("aboveChart")[1];
        h5StockPrice.innerHTML = "$" +  (liveDataOfStocks["Global Quote"]["05. price"] * 100) / 100;
        spanForChange = document.createElement("span");
        changeInCents = liveDataOfStocks["Global Quote"]["09. change"];
        changeInPercent = liveDataOfStocks["Global Quote"]["10. change percent"];
        var plusOrMinus = changeInCents[0];
        if(plusOrMinus != "-"){
          spanForChange.setAttribute("style", "color: green");
          plusOrMinus = "+";
        } else {
          spanForChange.setAttribute("style", "color: red");
        }
        spanForChange.innerHTML = " " + plusOrMinus + (Math.round(parseFloat(changeInCents.replace("%", "").replace("-", "")) * 100) / 100) + "(" + plusOrMinus + (Math.round(parseFloat(changeInPercent.replace("%", "").replace("-", "")) * 100) / 100) + "%)";
        h5StockPrice.appendChild(spanForChange);

        h6StockPrice = document.getElementsByClassName("aboveChart")[2];
        h6StockPrice.innerHTML = "&nbsp;(Ticker: " + ticker.toUpperCase() + ")";

        float = getFloat();
        currentVolume = liveDataOfStocks["Global Quote"]["06. volume"];
        document.getElementById("greenBarVolumeFloat1").setAttribute("aria-valuemax", float);
        document.getElementById("greenBarVolumeFloat1").setAttribute("style", "width:" +  (currentVolume/float)*100 + "%; background-color: lightgreen; color: black; font-family: 'Lato', sans-serif;");
        document.getElementById("greenBarVolumeFloat1").innerHTML = Math.round((currentVolume/float)*100) + "%";
        document.getElementById("greenBarVolumeFloat2").setAttribute("aria-valuemax", float);
        document.getElementById("greenBarVolumeFloat2").setAttribute("style", "width:" +  (1-(currentVolume/float))*100 + "%; background-color: #ff7272; color: black; font-family: 'Lato', sans-serif;");
        document.getElementById("greenBarVolumeFloat2").innerHTML = Math.round((1-(currentVolume/float))*100) + "%";

        h6navBar = document.getElementsByClassName("stockName")[1];
        h6navBar.innerHTML = "$" +  (liveDataOfStocks["Global Quote"]["05. price"] * 100) / 100;
        spanForChange2 = document.createElement("span");

        if(plusOrMinus != "-"){
          spanForChange2.setAttribute("style", "color: green");
          plusOrMinus = "+";
        } else {
          spanForChange2.setAttribute("style", "color: red");
        }
        spanForChange2.innerHTML = " " + plusOrMinus + (Math.round(parseFloat(changeInCents.replace("%", "").replace("-", "")) * 100) / 100) + "(" + plusOrMinus + (Math.round(parseFloat(changeInPercent.replace("%", "").replace("-", "")) * 100) / 100) + "%)";
        h6navBar.appendChild(spanForChange2);
      }
    })
}

function getFloat(){
  float = document.getElementById("floatTd").textContent;
  if(float.indexOf("M") != -1){
    float = float.replace(".", "").replace("M", "0000");
  } else if(float.indexOf("B") != -1){
    float = float.replace(".", "").replace("B", "0000000");
  } else if(float.indexOf("k") != -1 || float.indexOf("K") != -1){
    float = float.replace(".", "").replace("K", "0");
    float = float.replace(".", "").replace("k", "0");
  }
  return float;
}

setInterval(function() {
  getStockData();
}, 10*60*1000);


//########################################

history.pushState(null, null, 'http://localhost:8082/');
window.addEventListener('popstate', function(event) {
	window.history.go(0);
	$('html, body').animate({ scrollTop: 0 }, 'fast');
});

$("#emailInput").keypress(function(event){
	if(event.which===13) {
		submitEmail();
	}
})
function submitEmail(){
	let email = document.getElementById("emailInput").value;
	fetch("/subscribe/" + email, {
    cache: 'no-cache', 
    credentials: 'same-origin',
    method: 'GET',
    mode: 'cors', 
    redirect: 'follow',
    referrer: 'no-referrer',
    })
    .then(function(res){
      return res.text();
    })
    .then(function(data){
    	if(data == "200"){
    		var brother = document.getElementById("emailSubscriveForm");
    		var newNode = document.createElement("h2");
    		newNode.setAttribute("id","newNode");
    		newNode.style.textAlign = "center";
    		newNode.style.color = "#6a6b77";
    		newNode.style.marginTop = "30px";
    		newNode.innerHTML = "Thanks for your subscription!";
    		document.getElementById("h2Subscribe").style.display = "none";
    		document.getElementById("emailSubscriveForm").style.display = "none";
    		brother.parentNode.insertBefore(newNode, brother.nextSibling);
    		setTimeout(function() { $('#subscribe').modal('hide'); }, 2000);

    	} else {
    		var brother = document.getElementById("emailSubscriveForm");
    		var newNode = document.createElement("p");
    		newNode.style.textAlign = "center";
    		newNode.style.color = "red";
    		newNode.innerHTML = "Please insert a valid email";
    		brother.parentNode.insertBefore(newNode, brother.nextSibling);
    		setTimeout(function() { newNode.remove(); }, 3000);
    	}
    });

}



// history.pushState(null, null, 'http://localhost:8082/');
// window.addEventListener('popstate', function(event) {
//   history.pushState(null, null, 'http://localhost:8082/');
//   document.getElementById("result").style.display = "none";
//   document.getElementById("loadingMain").style.display = "none";
//   document.getElementById("search-top-hidden").style.display = "none";
//   document.getElementById("stockNameNavDiv").style.display = "none";
//     $(".navbar").css("backgroundColor", "transparent");
//     $(".navbar").css("boxShadow", "none");
//     $(".navSocial").css("color", "black");  
//   if ($(window).width() < 768) {
//     $(".navbar").css("backgroundColor", "black");
//     $(".navbar").css("boxShadow", "none");
//     $(".navSocial").css("color", "white"); 
//   }
//   $('html, body').animate({ scrollTop: 0 }, 'fast');
//   document.getElementById("firstSearch").style.display = "block";
// });

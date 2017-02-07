import Constants from 'components/helpers/Constants'

export default {
getInvests: function() {
  var combiTmp = [];
  axios.get('http://localhost:60964/api/holdings')
  .then(function(res) {
    combiTmp = res.data;
    //get list of symbols and format it correctly for yql
    var mappedSymbols = combiTmp.map(function(el) { return el.symbol; })
    var symbolList = "'" + mappedSymbols.join("','") + "'";
    var selectFields = "Name,Symbol,LastTradePriceOnly,Change,Currency,Volume,Open,DaysHigh,DaysLow,AverageDailyVolume,YearHigh,YearLow,FiftydayMovingAverage,TwoHundreddayMovingAverage";
    var yql = "select " + selectFields + " from yahoo.finance.quotes where symbol in (" + symbolList + ")";
        
    axios.get(Constants.yahooBaseApi + yql + Constants.yahooFormat)
    .then(function(res) {


      var yhData = res.data.query.results.quote;
      //add fields from yahoo data into this.holdings
      combiTmp.forEach(function(item,index) {
    
	    var yhObj = yhData.find(function(obj) {return obj.Symbol === item.symbol});
		    
		item.Name = yhObj.Name;
		item.LastTradePriceOnly = yhObj.LastTradePriceOnly;
		item.Change = yhObj.Change;
		item.Currency = yhObj.Currency;
		item.FiftydayMovingAverage = yhObj.LastTradePriceOnly;
		item.TwoHundreddayMovingAverage = yhObj.LastTradePriceOnly;
		item.YearHigh = yhObj.YearHigh;
		item.YearLow = yhObj.YearLow;
	  // combi.symbol = item.symbol;
	  // combi.holding1 = item.holding1;
	  // combi.purchasePrice = item.purchasePrice;
	  // combi.portfolioName = item.portfolioName;
	  // combi.commission = item.commission;
	  // combi.purchaseDate = item.purchaseDate;
	  // combi.sector = item.sector;
	  // combi.Name = yhObj.Name;
	  // combi.LastTradePriceOnly = yhObj.LastTradePriceOnly;
	  // combi.Change = yhObj.Change;
	  // combi.Currency = yhObj.Currency;
	  // combi.FiftydayMovingAverage = yhObj.LastTradePriceOnly;
	  // combi.TwoHundreddayMovingAverage = yhObj.LastTradePriceOnly;
	  // combi.YearHigh = yhObj.YearHigh;
	  // combi.YearLow = yhObj.YearLow;
	  // combiTmp.push(combi);
      });
    });
  });
  return combiTmp;
}
}
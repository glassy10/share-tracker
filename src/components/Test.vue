<template>
  <div class="test">
    <h2 class="title is-h2">Test component</h2>
    <table class="table">
    <thead>
    <th>Symbol</th>
    <th>Name</th>
    <th>Currency</th>
    <th>holding1</th>
    <th>purchase Price</th>
    <th>Last Trade Price Only</th>
    <th>commission</th>
    <th>portfolio Name</th>
    </thead>
     <tbody>
       <tr v-for="share in shares" ><!--:key="share.id"-->
         <td>{{share.symbol}}</td>
         <td v-if="share.Name">{{share.Name.substring(0, 12)}}</td>
         <td>{{share.Currency}}</td>
         <td>{{share.holding1}}</td>
         <td>{{(share.purchasePrice * 100).toFixed(2)}}</td>
         <td>{{share.LastTradePriceOnly}}</td>
         <td>{{share.commission}}</td>
         <td>{{share.portfolioName}}</td>

       </tr>
     </tbody>
   </table>


 </div>

</template>



<script>

import Constants from 'components/helpers/Constants'

export default {
  name: 'test',
  components: {
    Constants
  },
  data () {
    return {
      shares: [],
    }
  },
  created:
    function() {
      var _this = this;
      var tmpArray;
      axios.get('http://localhost:60964/api/holdings/getholdings')
      .then(function(res) {
        tmpArray = res.data;
        //get list of symbols and format it correctly for yql
        var mappedSymbols = tmpArray.map(function(el) { return el.symbol; })
        var symbolList = "'" + mappedSymbols.join("','") + "'";
        var selectFields = "Name,Symbol,LastTradePriceOnly,Change,Currency,Volume,Open,DaysHigh,DaysLow,AverageDailyVolume,YearHigh,YearLow,FiftydayMovingAverage,TwoHundreddayMovingAverage";
        var yql = "select " + selectFields + " from yahoo.finance.quotes where symbol in (" + symbolList + ")";

        axios.get(Constants.yahooBaseApi + yql + Constants.yahooFormat)
        .then(function(res) {

          var yhData = res.data.query.results.quote;
          //add fields from yahoo data into this.holdings
          tmpArray.forEach(function(item,index) {
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
        _this.shares = tmpArray;
      });
    });
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>

<template>

  <div id="share">

    <router-link to="/">
      <span class="icon icon is-large fa fa-arrow-left" ></span>
    </router-link>

    <h2 class="title is-2">{{share.Symbol}} <small>{{share.Name}}</small></h2>


    <div class="columns">
      <div class="column">
       <chart-share-history :symbol="$route.params.symbol"></chart-share-history>
       <br/>

<!--==========================================================//
//================| DIVIDENDS |===============================//
//===========================================================-->


        <h3 class="title is-3">Dividends</h3>
        <ul>
          <li v-for="divi in dividends">{{divi.Date}} - {{divi.Dividends}}</li>
        </ul>
<!--==========================================================//
//================| NEWS |====================================//
//===========================================================-->
       <!--  <h3 class="title is-3">NEWS</h3>
        <ul>
          <li v-for="article in articles">{{article}}</li>
        </ul>-->
      
      </div> 

      <div class="column">


<!--==========================================================//
//================| YAHOO DETAILS |===========================//
//===========================================================-->
        <table class="table is-striped is-narrow" >
          <tbody>
            <tr>
              <td>Price <b>({{share.Currency}})</b></td>
              <td class="has-text-right" :class="{changePos: +share.Change >   0,changeNeg: +share.Change < 0 }">
                <b>{{share.LastTradePriceOnly}}</b> 
                <span class="symbol" >
                  <span v-if="+share.Change > 0" class="fa fa-arrow-up" style="padding-top:2px;"></span>
                  <span v-if="+share.Change < 0" class="fa fa-arrow-down" style="padding-top:3px;"></span>
                  {{share.Change}}<!--.replace(/[+-]/g,'')-->
                </span>
              </td>
            </tr>
            <tr>
              <td>Holding</td>
              <td class="has-text-right">{{totalHoldings}} shares @ {{niceNum(share.LastTradePriceOnly)}} = <b>{{niceNum(totalHoldingsCurrentValue)}}</b></td>
            </tr>
            <tr>
              <td>Profit/Loss</td>
              <td class="has-text-right" :class="{changePos: profitLoss > 0,changeNeg: profitLoss < 0 }">
                <b>{{niceNum(profitLoss)}}</b>
              </td>
            </tr>

            <tr>
              <td>Day Open/Range</td>
              <td class="has-text-right">{{share.Open}} / {{share.DaysLow}} - {{share.DaysHigh}}</td>
            </tr>
            <tr>
              <td>Year Range</td>
              <td class="has-text-right">{{share.YearLow}} - {{share.YearHigh}}</td>
            </tr>
            <tr>
              <td>Volume</td>
              <td class="has-text-right">{{niceNum(share.Volume)}}</td>
            </tr>
            <tr>
              <td>Average Volume</td>
              <td class="has-text-right">{{niceNum(share.AverageDailyVolume)}}</td>
            </tr>
            <tr>
              <td>Activity</td>
              <td class="has-text-right">{{(share.Volume/share.AverageDailyVolume).toFixed(2)}}</td>
            </tr>
            <tr>
              <td>Dividend Yield</td>
              <td class="has-text-right">{{share.DividendYield}}</td>
            </tr>
            <tr>
              <td>Dividend Share</td>
              <td class="has-text-right">{{share.DividendShare}}</td>
            </tr>
            <tr>
              <td>Ex-Dividend Date</td>
              <td class="has-text-right">{{share.ExDividendDate}}</td>
            </tr>
            <tr>
              <td>Earnings Per Share</td>
              <td class="has-text-right">{{share.EarningsShare}}</td>
            </tr>
            <tr>
              <td>EPS Estimate Curr Yr / Next Yr</td>
              <td class="has-text-right">{{share.EPSEstimateCurrentYear}} / {{share.EPSEstimateNextYear}}</td>
            </tr>
            <tr>
              <td>Market Capitalisation</td>
              <td class="has-text-right">{{share.MarketCapitalization}}</td>
            </tr>
            <tr>
              <td>EBITDA</td>
              <td class="has-text-right">{{share.EBITDA}}</td>
            </tr>
            <tr>
              <td>Price EPS Estimate Curr Yr/Next Yr</td>
              <td class="has-text-right">{{share.PriceEPSEstimateCurrentYear}} / {{share.PriceEPSEstimateNextYear}}</td>
            </tr>
          </tbody>
        </table>

<!--==========================================================//
//================| PURCHASES |===============================//
//===========================================================-->
        <h4 class="title is-h4">Purchases</h4>
        <table class="table is-striped is-narrow">
          <thead>
          <tr>
            <th>Date</th>
            <th>Portfolio</th>
            <th>Holding</th>
            <th>Purchase Price</th>
            <th>Commission</th>
            <th>Cost</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="holding in holdings">
            <td>{{niceDate(holding.purchaseDate)}}</td>
            <td>{{holding.portfolioName}}</td>
            <td class="has-text-right">{{holding.holding1}}</td>
            <td class="has-text-right">{{holding.purchasePrice}}</td>
            <td class="has-text-right">{{holding.commission}}</td>
            <td class="has-text-right">{{niceNum((holding.holding1 * holding.purchasePrice) + holding.commission)}}</td>
          </tr>
          </tbody>
          <tfoot>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td><b>{{niceNum(totalHoldingsOriginalCost)}}</b></td>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

import Constants from 'components/helpers/Constants'
import ChartShareHistory from 'components/Charts/ChartShareHistory'
import Formats from 'components/helpers/Formats'
import Utilities from 'components/helpers/Utilities'

export default {
  name: 'share',
  components: {
    Constants,ChartShareHistory,Formats,Utilities
  },
  data () {
    return {
      symbol: this.$route.params.symbol,
      share:{},
      dividends:[],
      holdings:[],
      articles:[],
      searchTerm:''
    }
  },
  methods: {
    getYahooData: function(){
      var yqldetails = "select * from yahoo.finance.quotes where symbol in ('" + this.symbol + "')";
      this.$http.get(Constants.yahooBaseApi + yqldetails + Constants.yahooFormat)
      .then(function(res){
       this.share = res.data.query.results.quote;
     })
    },
    getDiviData: function(){
      var threeYearsAgo = '2015-01-01';
      var today = '2017-02-02';
      var yql = "select * from yahoo.finance.dividendhistory where symbol = '" + this.symbol + "' and startDate = '" + threeYearsAgo + "' and endDate = '" + today + "'";
      this.$http.get(Constants.yahooBaseApi + yql + Constants.yahooFormat)
      .then(function(res){
       this.dividends = res.data.query.results.quote;
     })
    },
    getHoldingData: function(){
      this.$http.get(Constants.hwdApi + 'GetBySymbol?symbol=' + this.symbol)//)
      .then(function (res){
        this.holdings = res.data;
      })
    },
    // getSearchTerm: function(){
    //   console.log(this.holdings[0].search);
    //   this.searchTerm = this.holdings[0].search;
    // },
    // getGoogleNews: function() {
    //   //this.getSearchTerm();
    //   //var yql = 'select * from google.news where q = "' + this.searchTerm + '"'
    //   //var yql = 'select * from google.news where q = "' + 'bp' + '"'
    //   var googleNewApiKey='fe988d80b6784757876c3b3904574931';
    //   var yql = 'https://newsapi.org/v1/articles?source=bloomberg&sortBy=top&apiKey=fe988d80b6784757876c3b3904574931'
    //   this.$http.get(yql)
    //   .then(function(res){
    //     this.articles = res.data.articles;
    //   })
    // },
    niceNum: function(number) {
      return Formats.niceNumber(number);
    },
    niceDate: function(date){
      return moment(date).format('DD/MM/YYYY');
    },
    
  },
  computed: {
    totalHoldings : function() {
      return  Utilities.sum(this.holdings, 'holding1');
    },
    totalHoldingsCurrentValue: function() {
      return this.totalHoldings * this.share.LastTradePriceOnly/100;
    },
    totalHoldingsOriginalCost: function() {
      var total = 0;
      var commission = 0
      this.holdings.forEach(function(item,index){
        total += item.holding1 * item.purchasePrice;
        commission += item.commission;
      });
    return total + commission;
    },
    profitLoss: function(){
      return this.totalHoldingsCurrentValue - this.totalHoldingsOriginalCost;
    },


  },
  mounted: function() {
    this.getYahooData();
    this.getDiviData();
    this.getHoldingData();
    //this.getGoogleNews();
  }
}

</script>

<style scoped>

</style>



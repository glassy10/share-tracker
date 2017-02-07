<template>
  <div class="holdings">
holdings here!!!
    <table class="table">
    <thead>
    <th>symbol</th>
    <th>Name</th>
    <th>Currency</th>
    <th>holding1</th>
    <th>purchase Price</th>
    <th>Last Trade Price Only</th>
    <th>commission</th>
    <th>portfolio Name</th>
    <th>sector</th>
    </thead>
     <tbody>
       <tr v-for="share in combined" :key="share.id">
         <td>{{share.symbol}}</td>
         <td>{{share.Name}}</td>
         <td>{{share.Currency}}</td>
         <td>{{share.holding1}}</td>
         <td>{{(share.purchasePrice * 100).toFixed(2)}}</td>
         <td>{{share.LastTradePriceOnly}}</td>
         <td>{{share.commission}}</td>
         <td>{{share.portfolioName}}</td>
         <td>{{share.sector}}</td>


       </tr>
     </tbody>
   </table>
    <!--<table class="table is-narrow">
      <thead>
        <th></th>
        <th></th>
        <th></th>
        <th class="not-mobile">52 Week Range <span style="font-size:75%;">with Av. 50-day markers</span></th>
      </thead>

      <tbody>
        <tr v-for="share in combined">

          <td>
            <router-link :to="{path: '/share/' + share.symbol}">
              <div class="symbol">{{share.symbol}}</div>
              <div class="share-name">{{share.Name.substring(0, 12)}}</div>
            </router-link>
          </td>

          <td class="has-text-right">
            <div class="symbol">{{share.LastTradePriceOnly}}</div>
            <div class="share-name">{{share.Currency}}</div>
          </td>

          <td class="has-text-right" v-bind:class="{changePos: +share.Change >   0,changeNeg: +share.Change < 0 }">
            <div class="symbol" >
              <span v-if="+share.Change > 0" class="fa fa-arrow-up" style="padding-top:2px;"></span>
              <span v-if="+share.Change < 0" class="fa fa-arrow-down" style="padding-top:3px;"></span>
              
            </div>
          </td>

          <td class="not-mobile" style="width:260px;">
            <chart-hi-lo :gData='[{
              "high":share.YearHigh,
              "low":share.YearLow,
              "today":share.LastTradePriceOnly,
              "av50":share.FiftydayMovingAverage,
              "av200":share.TwoHundreddayMovingAverage,
              "name":share.Name
            }]'><div v-bind:id="'hilochart-' + share.Name.split(' ')[0].toLowerCase()"></div>
            </chart-hi-lo>
          </td>

        </tr>
      </tbody>
      <tfoot>
        <th></th>
        <th></th>
        <th></th>
        <th class="not-mobile"></th>
      </tfoot>
    </table>-->

 </div>

</template>



<script>


import Constants from 'components/helpers/Constants'

export default {
  name: 'shares',
  components: {
    Constants
  },
  data () {
    return {
      shares: [],
      combined:[]
    }
  },
  methods: {
    
  },
  computed: {

   },
  created: function(){
    this.$http.get('http://localhost:60964/api/holdings/getholdings')
    .then(function(res) {
      this.shares = res.data;
      //get list of symbols and format it correctly for yql
      var mappedSymbols = this.shares.map(function(el) { return el.symbol; })
      var symbolList = "'" + mappedSymbols.join("','") + "'";
      
      var selectFields = "Name,Symbol,LastTradePriceOnly,Change,Currency,Volume,Open,DaysHigh,DaysLow,AverageDailyVolume,YearHigh,YearLow,FiftydayMovingAverage,TwoHundreddayMovingAverage";
      var yql = "select " + selectFields + " from yahoo.finance.quotes where symbol in (" + symbolList + ")";
      
      var combiTmp = [];
      this.$http.get(Constants.yahooBaseApi + yql + Constants.yahooFormat)
      .then(function(res) {
        var yhData = res.data.query.results.quote;
        //add fields from yahoo data into this.holdings
        this.shares.forEach(function(item,index) {
          var combi = {}
          var yhObj = yhData.find(function(obj) {return obj.Symbol === item.symbol});
          // item.Name = yhObj.Name;
          // item.LastTradePriceOnly = yhObj.LastTradePriceOnly;
          // item.Change = yhObj.Change;
          // item.Currency = yhObj.Currency;
          // item.FiftydayMovingAverage = yhObj.LastTradePriceOnly;
          // item.TwoHundreddayMovingAverage = yhObj.LastTradePriceOnly;
          // item.YearHigh = yhObj.YearHigh;
          // item.YearLow = yhObj.YearLow;
          combi.symbol = item.symbol;
          combi.holding1 = item.holding1;
          combi.purchasePrice = item.purchasePrice;
          combi.portfolioName = item.portfolioName;
          combi.commission = item.commission;
          combi.purchaseDate = item.purchaseDate;
          combi.sector = item.sector;
          combi.Name = yhObj.Name;
          combi.LastTradePriceOnly = yhObj.LastTradePriceOnly;
          combi.Change = yhObj.Change;
          combi.Currency = yhObj.Currency;
          combi.FiftydayMovingAverage = yhObj.LastTradePriceOnly;
          combi.TwoHundreddayMovingAverage = yhObj.LastTradePriceOnly;
          combi.YearHigh = yhObj.YearHigh;
          combi.YearLow = yhObj.YearLow;
          combiTmp.push(combi);
        })
      })
      this.combined = combiTmp;
      console.log('this.combined',this.combined);
    })
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>

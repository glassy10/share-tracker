<template>
  <div id="shares">

    <display-indices></display-indices>

    <h3 class="title is-3">Share Tracker&nbsp;&nbsp;&nbsp;&nbsp;</h3>

    <table class="table is-narrow">
      <thead>
        <th></th>
        <th></th>
        <th></th>
        <th class="not-mobile">52 Week Range <span style="font-size:75%;">with Av. 50-day markers</span></th>
      </thead>

      <tbody>
        <tr v-for="share in shares">

          <td>
            <router-link :to="{path: '/share/'+share.Symbol}">
              <div class="symbol">{{share.Symbol}}</div>
               <div class="share-name" v-if="share.Name">{{share.Name.substring(0, 12)}}</div>
            </router-link>
          </td>

          <td class="has-text-right">
            <div class="symbol">{{niceNum(+share.LastTradePriceOnly)}}</div>
            <div class="share-name">{{share.Currency}}</div>
          </td>

          <td class="has-text-right" v-bind:class="{changePos: +share.Change >   0,changeNeg: +share.Change < 0 }">
            <div class="symbol" v-if="share.Open" >
              <span v-if="+share.Change > 0" class="fa fa-arrow-up" style="padding-top:2px;"></span>
              <span v-if="+share.Change < 0" class="fa fa-arrow-down" style="padding-top:3px;"></span>
              {{percentPriceChange(share.Change,share.Open)}}
            </div>
            <div v-else>N/A</div>
          </td>

          <td class="not-mobile" style="width:260px;">
            <chart-hi-lo
              v-if="share.Name"
              :gData='[{
              "high":share.YearHigh,
              "low":share.YearLow,
              "today":share.LastTradePriceOnly,
              "av50":share.FiftydayMovingAverage,
              "av200":share.TwoHundreddayMovingAverage,
              "name":share.Name
            }]'> <div v-if="share.Name" v-bind:id="'hilochart-' + share.Name.split(' ')[0].toLowerCase()"></div>
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
    </table>

  </div>

     </div>
   </div>
 </template>



<script>

import Share from 'components/Share'
import Constants from 'components/helpers/Constants'
import MyShares from 'components/MyShares'
import DisplayIndices from 'components/DisplayIndices'
import ChartHiLo from 'components/Charts/ChartHiLo'
import Formats from 'components/helpers/Formats'
import Dates from 'components/helpers/Dates'

export default {
  name: 'shares',
  components: {
    Share, Constants, MyShares,DisplayIndices,ChartHiLo,Formats,Dates
  },
  data () {
    return {
      shares: [],
      symbolList:[],
      selectedShare:null
    }
  },
  methods: {
    selectShare: (symbol) => {
      this.selectedShare = symbol;
    },
    percentPriceChange: (change,price) => {
      return (((change/price)*100).toFixed(1)).replace('-','') + '%';
    },
    niceNum: (number) => {return Formats.niceNumber(number);
    }
  },
  computed: {
    twoYearsAgo:() => {return Dates.yhTwoYearsAgo},
    oneYearAgo: () => {return Dates.yhOneYearAgo}
  },
  created: function(){
    //var symbolList = "'" + MyShares.symbols.join("','") + "'";
    // var selectFields = "Name,Symbol,LastTradePriceOnly,Change,Currency,Volume,Open,DaysHigh,DaysLow,AverageDailyVolume,YearHigh,YearLow,FiftydayMovingAverage,TwoHundreddayMovingAverage";
    // var yql = "select " + selectFields + " from yahoo.finance.quotes where symbol in (" + symbolList + ")";
    // this.$http.get(Constants.yahooBaseApi + yql + Constants.yahooFormat)
    // .then((res) => {
    //   this.shares = res.data.query.results.quote;
    // })

    this.$http.get('http://localhost:60964/api/holdings/getsymbols')
    .then((response) => {
      this.symbolList = response.data;
       //get list of symbols and format it correctly for yql
       //var mappedSymbols = this.shares.map((el) => { return el.symbol; })
      var mappedSymbols = "'" + this.symbolList.join("','") + "'";
      var selectFields = "Name,Symbol,LastTradePriceOnly,Change,Currency,Volume,Open,DaysHigh,DaysLow,AverageDailyVolume,YearHigh,YearLow,FiftydayMovingAverage,TwoHundreddayMovingAverage";
      var yql = "select " + selectFields + " from yahoo.finance.quotes where symbol in (" + mappedSymbols + ")";
      
      this.$http.get(Constants.yahooBaseApi + yql + Constants.yahooFormat)
      .then((res) => {
        this.shares = res.data.query.results.quote;
        console.log('this.shares',this.shares);
      });
    })
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*bootstrap link color: #428bca;*/

  a:link {
    color:#428bca;
  }

  /* visited link */
  a:visited {
    color: #428bca;
  }

  /* mouse over link */
  a:hover {
    color: #333;
  }

  /* selected link */
  a:active {
    color:hsl(141, 71%, 48%);
  }
  .symbol {
    font-size: 16px;
    font-weight: bold;
  }
  .share-name {
    font-size: 10px;
  }

  

</style>

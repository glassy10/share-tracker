<template>
	<div id="display-indices" class="container is-pulled-right">
    <div style="margin:-30px 0 16px 0" class="is-small">
      <span v-for="index in indices"
      v-bind:class="{changePos: +index.Change > 0,changeNeg: +index.Change < 0 }">
      <span style="white-space: nowrap;">
        <b>{{index.Symbol.replace('^','')}}</b>
        <!-- {{(+index.LastTradePriceOnly).toFixed(0)}} -->

        {{niceNum(+index.LastTradePriceOnly)}}

        <span >
          <span v-if="+index.Change > 0" class="fa fa-arrow-up" style="padding-top:2px;"></span>
          <span v-if="+index.Change < 0" class="fa fa-arrow-down" style="padding-top:3px;"></span>
          {{percentPriceChange(+index.Change,+index.Open)}}
        </span>
      </span>

      &nbsp;&nbsp;&nbsp;&nbsp;
    </span>
  </div>
</div>
</template>

<script>
  import Constants from 'components/helpers/Constants'
  import Formats from 'components/helpers/Formats'

  export default {
    name: 'display-indices',
    components: {
      Constants, Formats
    },
    data () {
      return {
       indices:{}
     }
   },

   methods:{
    percentPriceChange: function(change,price) {
      return (((change/price)*100).toFixed(1)).replace('-','') + '%';
    },
    getIndices: function() {
      var yql = "select Symbol,LastTradePriceOnly,Change,Open from yahoo.finance.quotes where symbol in ('^FTSE','^GSPC', '^N225','^SSMI','^AXJO')"; //,'^DJI','^NDX'
      this.$http.get(Constants.yahooBaseApi + yql + Constants.yahooFormat)
        .then(function(res){
    	   this.indices = res.data.query.results.quote;
      }); 
    },
    niceNum: function(number) {
      return Formats.niceNumber(number);
    }
  },

  mounted: function() {
    this.getIndices();
  }
}

</script>

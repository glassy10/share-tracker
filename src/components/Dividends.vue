<template>
  <div class="dividends">
  <h1 class="title is-h1">Dividends</h1>
<table>
<tbody>
<tr v-for="divi in dividends">
<td>{{divi.Symbol}}
</td>
<td>{{divi.Date}}
</td>
<td>{{divi.Dividends}}
</td>
</tr>
</tbody>
</table>

   </div>
 </template>



 <script>

  
import Constants from 'components/helpers/Constants'
import MyShares from 'components/MyShares'
import Formats from 'components/helpers/Formats'

export default {
    name: 'dividends',
    components: {
      Constants, MyShares,Formats
    },
    data () {
      return {
        dividends: [],
        
      }
    },
    methods: {
      
    },
    computed: {
      
    },
    created: function(){
      var symbolList = "'" + MyShares.symbols.join("','") + "'";
      var today = '2017-02-02';
      var threeYearsAgo = '2015-01-01';//moment().subtract(3, 'years').format('YYYY-MM-DD');
      var yql = "select * from yahoo.finance.dividendhistory where symbol in (" + symbolList + ") and startDate = '" + threeYearsAgo + "' and endDate = '" + today + "'";
      this.$http.get(Constants.yahooBaseApi + yql + Constants.yahooFormat)
      .then(function(res){
        this.dividends = res.data.query.results.quote;

        //order by date?
      })

    }
  }


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>

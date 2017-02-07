<template>
  <div class="add-share">
    <router-link to="/">
      <span class="icon icon is-large fa fa-arrow-left" ></span>
    </router-link>

    <h3 class="title is-3">Add a share</h3>

    <form>

      <div class="columns">
        <div class="column">
          <label class="label">Symbol</label>
          <p class="control">
            <input class="input" type="text" v-model="newShare.symbol" placeholder="Symbol eg BP.L" v-bind:class="{ 'is-danger': shareNotFound }" @blur="getShare" />
          </p>
          <span class="help is-success" v-show="newShare.shareName">
           Name: <strong>{{newShare.shareName}}</strong>, Currency: <strong>{{newShare.currency}}</strong>
         </span>
         <span class="help is-danger" v-show="shareNotFound">
          Share not found!
        </span>
      </div>

      <div class="column">
        <label class="label">Number of Shares</label>
        <p class="control">
          <input class="input" type="text" v-model="newShare.holding" placeholder="Holding eg 500"/>
        </p>
      </div>
    </div>

      <!-- <label class="label">Currency</label>
      <p class="control" >
        <span class="select" >
          <select v-model="newShare.currency" @change="getFxRate()">
            <option value='GBP'>GBP</option>
            <option value='GBPUSD'>USD</option>
            <option value='GBPEUR'>Euro</option>
            <option value='GBPCHF'>SwFr</option>
            <option value='GBPAUD'>AuD</option>
          </select>
        </span>
      </p> -->

      <div class="columns">
        <div class="column">

          <a><span class="icon is-small is-pulled-right"  @click="showFxHelpActive">
            <i class="fa fa-question"></i>
          </span></a>
          <div class="popup-help is-info" v-show="showFxHelp">Edit non-GBP rate if required</div>
        
        <label class="label">FX Rate (edit non-GBP rate if required)</label>
        <p class="control">
          <input class="input" type="text" v-model="newShare.purchaseDateFxRate"
          :disabled="disableFXRateInput"/>
        </p>
        </div>
        <div class="column">
          <label class="label">Purchase Price (each)</label>
          <p class="control">
            <input class="input" type="text" v-model="newShare.purchasePrice" placeholder="Purchase Price per share eg 250"/>
          </p>
        </div>
      </div>
      <div class="columns">
        <div class="column">

          <label class="label">Commission</label>
          <p class="control">
            <input class="input" type="text" v-model="newShare.commission" placeholder="Commission Paid eg 90"/>
          </p>
        </div>
        <div class="column">
          <label class="label">Purchase Date</label>
 <!--         <p class="control">
             <input class="input" type="text" v-model="newShare.purchaseDate" placeholder="DD/MM/YYYY"/>
           -->            <datepicker format="dd/MM/yyyy" v-model="newShare.purchaseDate"></datepicker>
           <!--  </p> -->

         </div>
       </div>
       <div class="columns">
        <div class="column">
          <label class="label">Search Term (edit if required, for news articles etc)</label>
          <p class="control">
            <input class="input" type="text" v-model="newShare.search" placeholder="Search term eg Zurich"/>
          </p>
        </div>
        <div class="column">
          <label class="label">Portfolio</label>
          <p class="control" >
            <span class="select" >
              <select v-model="newShare.portfolio">
                <option>ISA-A</option>
                <option>Tr-A</option>
                <option>ISA-H</option>
                <option>Tr-H</option>
                <option>H&K</option>
                <option>None</option>
              </select>
            </span>
          </p>
        </div>
        
      </div>
      <div class="columns">
        <div class="column">
          <label class="label">Industry</label>
          <p class="control" >
            <span class="select" >
              <select v-model="newShare.industry">
                <option>Consumer Services</option>
                <option>Telecommunications</option>
                <option>Health Care</option>
                <option>Industrials</option>
                <option>Financials</option>
                <option>Technology  </option>
                <option>Basic Materials</option>
                <option>Oil & Gas</option>
              </select>
            </span>
          </p>
        </div>
        <div class="column">
          <label class="label">Sector</label>
          <p class="control" >
            <span class="select" >
              <select v-model="newShare.sector">
                <option>Aerospace & Defense</option>
                <option>Automobiles & Parts</option>
                <option>Banks</option>
                <option>Beverages</option>
                <option>Chemicals</option>
                <option>Construction & Materials</option>
                <option>Electricity </option>
                <option>Electronic & Electrical Equipment</option>
                <option>Equity Investment Instruments</option>
                <option>Financial Services</option>
                <option>Fixed Line Telecommunications</option>
                <option>Food & Drug Retailers</option>
                <option>Food Producers</option>
                <option>Forestry & Paper</option>
                <option>Gas; Water & Multiutilities</option>
                <option>General Industrials</option>
                <option>General Retailers</option>
                <option>Health Care Equipment & Services</option>
                <option>Household Goods & Home Construction</option>
                <option>Industrial Engineering</option>
                <option>Industrial Metals</option>
                <option>Industrial Transportation</option>
                <option>Life Insurance</option>
                <option>Media</option>
                <option>Mining</option>
                <option>Mobile Telecommunications</option>
                <option>Nonlife Insurance</option>
                <option>Oil & Gas Producers</option>
                <option>Oil Equipment, Services & Distribution</option>
                <option>Personal Goods</option>
                <option>Pharmaceuticals & Biotechnology</option>
                <option>Real Estate Investment & Services</option>
                <option>Real Estate Investment Trusts</option>
                <option>Software & Computer Services</option>
                <option>Support Services</option>
                <option>Technology Hardware & Equipment</option>
                <option>Tobacco </option>
                <option>Travel & Leisure</option>
              </select>
            </span>
          </p>
        </div>
      </div>


      <h4 class="title is-4">Total Cost: {{newShare.currency}} {{totalCost}}</h4>

      <a class="button is-primary" @click="addShare">Add</a>

    </div>
  </form>
</template>



<script>
  import Constants from 'components/helpers/Constants'
  import Datepicker from 'vuejs-datepicker';
  export default {
    name: 'add-share',
    components: {
      Constants, Datepicker
    },
    data () {
      return {
        newShare: {
          symbol:'',
          holding:'',
          currency:'',
          purchasePrice:'',
          commission:'',
          purchaseDate:'',
          purchaseDateFxRate:'',
          portfolio:'',
          search:'',
          industry:'',
          sector:'',
          shareName:''
        },
        disableFXRateInput:false,
        shareNotFound:false,
        showFxHelp:false
      }
    },
    methods: {
      getFxRate: function(){
        if (this.newShare.currency === "GBP") {
          this.newShare.purchaseDateFxRate = 1;
          this.disableFXRateInput = true;
        } else if (this.newShare.currency !== '') {
          this.disableFXRateInput = false;
          var yql = "select * from yahoo.finance.xchange where pair in ('GBP"+ this.newShare.currency +"')";
          this.$http.get(Constants.yahooBaseApi + yql + Constants.yahooFormat)
          .then(function(res){
            this.newShare.purchaseDateFxRate = res.data.query.results.rate.Rate;
          });
        }
      },
      getShare: function(){
        this.shareNotFound = false;
        if (this.newShare.symbol.length > 2) {
          var yqlShare = "select * from yahoo.finance.quotes where symbol in ('" + this.newShare.symbol + "')";
          this.$http.get(Constants.yahooBaseApi + yqlShare + Constants.yahooFormat)
          .then(function(res){
            var name = res.data.query.results.quote.Name;
            if (name !== null) {
              this.newShare.shareName = res.data.query.results.quote.Name;
              this.newShare.currency = res.data.query.results.quote.Currency.toUpperCase();
              this.getFxRate();
            //set search term to first word of name
            this.newShare.search = this.newShare.shareName.split(" ")[0].toLowerCase();
          }
          else {
              this.shareNotFound = true;//set bulma class to error & set message
              this.newShare.shareName = '';
              this.newShare.purchaseDateFxRate = '';
            }
            
          }); 
        }
      },
      addShare: function(){
      //post the share via ajax
      alert('You added it!', this.newShare);
      console.log(this.newShare.toJSON);
      //then go somewhere
    },
    showFxHelpActive: function() {
      console.log('showFxHelp',this.showFxHelp);
      this.showFxHelp = !this.showFxHelp;
    }
  },
  computed: {
    totalCost: function (){
      return (+this.newShare.holding * (+this.newShare.purchasePrice/100)) + +this.newShare.commission;
    }
  }

}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  input {
    /* for datepicker*/
    padding: 6px;
    border: solid 1px rgb(219,219,219);
    border-radius:3px;
    width:100%;
  }


</style>

<script>

export default {
	
    niceNumber: function(number){
      var fixed = (number*1).toFixed(0);
      return fixed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}
</script>

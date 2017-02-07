<template>
  <div id="app">
       <nav class="nav has-shadow">
        <div class="container">
          <div class="nav-left" id='nav-menu' >
            <router-link to="/" class="st-logo" style="margin-right:16px"><img src="./assets/9-512.png" ></router-link>
            <router-link class="nav-item is-tab is-hidden-mobile is-active" to="/" id="navHome">Home</router-link>
            <router-link class="nav-item is-tab is-hidden-mobile" to="/dividends" id="navDivi">Dividends</router-link>
            <router-link class="nav-item is-tab is-hidden-mobile" to="/add-share" id="navAdd">Add Share</router-link>
            <router-link class="nav-item is-tab is-hidden-mobile" to="/test" id="navTest">Test</router-link>
          </div>
          <span class="nav-toggle">
            <span><router-link class="nav-item is-tab is-active" to="/">Home</router-link></span>
            <span><router-link class="nav-item is-tab" to="/dividends">Dividends</router-link></span>
            <span><router-link class="nav-item is-tab" to="/add-share">Add Share</router-link></span>
          </span>
          <div class="nav-right nav-menu" id='nav-menu-right'>
            <a class="nav-item is-tab">Log out</a>
          </div>

        </div>
      </nav>


  <div class="section">
  <div class="container">
    <router-view></router-view>
    </div>
  </div>

  
</div>

</template>

<script>
  export default {
    name: 'app',
  

  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    color: #2c3e50;
  }
  .st-logo {
    width:10%;
  }
  .router-link-active {
    color: turquoise;
  }

.changePos {
  color:hsl(141, 71%, 48%);
  background-color: hsl(141, 71%, 95%);
}
.changeNeg {
  color:hsl(348, 100%, 61%);
  background-color:hsl(348, 100%, 95%);
}

@media only screen and (max-width: 768px) {
    .not-mobile{
      display: none;
    }
  }
</style>

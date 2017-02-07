import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Home from '../components/Home'
import Share from '../components/Share'
import AddShare from '../components/AddShare'
import Dividends from '../components/Dividends'
import Holdings from '../components/Holdings'
import Test from '../components/Test'
export default new Router ({
	mode:'hash',
	routes: [
		{
			path:'/',
			component: Home
		},
		{   
			path: '/share/:symbol',
		    component: Share
		},
		{   
			path: '/add-share',
		    component: AddShare
		},
		{   
			path: '/dividends',
		    component: Dividends
		},
		{   
			path: '/holdings',
		    component: Holdings
		},
		{   
			path: '/test',
		    component: Test
		}
	]
})


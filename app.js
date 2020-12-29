Vue.component('country-item', {
    props : ['country'],
    template: `
    <div class="country-item" v-on:click="$emit('show-details', country)">
        <figure>
            <img :src="country.flag">
        </figure>
        <div>
            <h2>{{ country.name }}</h2>
            <p><b>Population:</b> <span>{{country.population}}</span></p>
            <p><b>Region:</b> <span>{{country.region}}</span></p>
            <p><b>Capital:</b> <span>{{country.capital}}</span></p>
        </div>
    </div>`
})

Vue.component('border-item', {
    props : ['border'],
    template: `
    <li v-on:click="$emit('show-details', border)">
        <a>{{ border.name }}</a>
    </li>`
})

var vm = new Vue({
    el: '#app',
    data: {
        countries: null,
        search : '',
        region: '',
        details: false,
        borders: [],
        isDarkTheme: false
    },
    created () {
        axios
        .get('https://restcountries.eu/rest/v2/all')
        .then(response => (this.countries = response.data))
    },
    methods: {
        showDetails: function(country){
            
            this.details = country;
            
            if(typeof(this.details.borders) === 'object' && this.details.borders.length !== 0){
                var codes = this.details.borders;
                var str = '';
                for(let i = 0; i < codes.length; i++){
                    str += (i === 0 ) ? codes[i] : ';'+ codes[i];
                }

                axios
                    .get('https://restcountries.eu/rest/v2/alpha?codes='+str)
                    .then(response => (this.borders = response.data))
                ;
            }
        },
        reset: function(){
            this.details = false;
            this.borders = [];
        },
        getListCountries: function(){
            if(this.region == "" && this.search != ""){
                axios
                    .get('https://restcountries.eu/rest/v2/name/'+this.search)
                    .then(response => (this.countries = response.data));
            }
            else if(this.region != "" && this.search == ""){
                axios
                    .get('https://restcountries.eu/rest/v2/region/'+this.region)
                    .then(response => (this.countries = response.data));
            }else if(this.region != "" && this.search != ""){
                searchCountries = [];
                regionCountries = [];
                intersection = [];

                function getSearchCountries(search){
                    return axios.get('https://restcountries.eu/rest/v2/name/'+search);
                }

                function getRegionCountries(region){
                    return axios.get('https://restcountries.eu/rest/v2/region/'+region)
                }

                Promise.all([getSearchCountries(this.search), getRegionCountries(this.region)])
                    .then(function(results){
                        searchCountries = results[0].data;
                        regionCountries = results[1].data;

                        searchCountries.forEach(function(a){

                            regionCountries.forEach(function(b){
                                if(a.name === b.name){
                                    intersection.push(b);
                                }
                            })
                        })
                    })

                this.countries = intersection;
            }
        }
    },
    computed: {
        isSearchActive : function(){
            return (this.search != '' && this.search != "blank")
        },
        isFilterActive : function(){
            return (this.region != '' && this.region != "blank")
        },
        getLanguages : function(){
            if(this.details.languages != undefined){
                var languages = this.details.languages;
                var str = '';
                for(let i = 0; i < languages.length; i++){
                    str += (i === 0 ) ? languages[i].name : ', '+ languages[i].name;
                }
                return str;
            }
        },
        getCurrencies : function(){
            if(this.details.currencies != undefined){
                var currencies = this.details.currencies;
                var str = '';
                for(let i = 0; i < currencies.length; i++){
                    str += (i === 0 ) ? currencies[i].name : ', '+ currencies[i].name;
                }
                return str;
            }
        },
        getTopLevelDomains : function(){
            if(this.details.topLevelDomain != undefined){
                var domains = this.details.topLevelDomain;
                var str = '';
                for(let i = 0; i < domains.length; i++){
                    str += (i === 0 ) ? domains[i] : ', '+ domains[i];
                }
                return str;
            }
        }
    }
});
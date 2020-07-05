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

var vm = new Vue({
    el: '#app',
    data: {
        countries: null,
        search : '',
        region: ''
    },
    created () {
        axios
        .get('https://restcountries.eu/rest/v2/all')
        .then(response => (this.countries = response.data))
    },
    methods: {
        showDetails: function(country){
            alert(country.name);
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
        }
    }
});
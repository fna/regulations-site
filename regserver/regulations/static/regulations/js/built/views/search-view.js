define("search-view",["jquery","underscore","backbone","./dispatch"],function(e,t,n,r){var i=n.View.extend({el:"#search",events:{submit:"openSearchResults"},initialize:function(){r.hasPushState()===!1&&(this.events={})},openSearchResults:function(t){sessionStorage.setItem("drawerDefault","search");var n=e(t.target),r={};r.query=n.find("input[name=q]")[0].value,r.version=n.find("select[name=version]")[0].value}});return i});
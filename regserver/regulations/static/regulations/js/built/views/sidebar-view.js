define("sidebar-view",["jquery","underscore","backbone","dispatch","sidebar-head-view","sxs-list-view"],function(e,t,n,r,i,s){var o=n.View.extend({el:"#sidebar-content",events:{"click .expandable":"toggleMeta"},initialize:function(){r.on("sidebarModule:render",function(e){this.insertChild(e)},this),r.on("sidebarModule:close",function(e){this.removeChild(e)},this),this.childViews={},this.childViews.header=new i({el:"#sidebar-header"}),this.childViews.sxs=new s},render:function(){},insertChild:function(e){this.$el.append(e)},removeChild:function(t){e(t).remove()},toggleMeta:function(t){t.stopPropagation(),e(t.currentTarget).toggleClass("open").next(".chunk").slideToggle()}});return o});
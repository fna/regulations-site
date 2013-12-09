define('main-view', ['jquery', 'underscore', 'backbone', 'search-results-view', 'reg-view', 'reg-model', 'search-model', 'sub-head-view', './regs-helpers', 'drawer-controller', 'section-footer-view', 'main-controller', 'sidebar-controller', './regs-router', 'drawer-view', 'diff-model', 'diff-view'], function($, _, Backbone, SearchResultsView, RegView, RegModel, SearchModel, SubHeadView, Helpers, DrawerEvents, SectionFooter, MainEvents, SidebarEvents, Router, Drawer, DiffModel, DiffView) {
    'use strict';

    var MainView = Backbone.View.extend({
        el: '#content-body',

        initialize: function() {
            this.controller = MainEvents;
            this.controller.on('search-results:open', this.createView, this);
            this.controller.on('section:open', this.createView, this);
            this.controller.on('section:remove', this.sectionCleanup, this);
            this.controller.on('diff:open', this._assembleDiffURL, this);

            var childViewOptions = {},
                url, params;
            this.$topSection = this.$el.find('section[data-page-type]');

            // which page are we starting on?
            this.contentType = this.$topSection.data('page-type');
            // what version of the reg?
            this.regVersion = this.$topSection.data('base-version');
            // what section do we have open?
            this.sectionId = this.$topSection.attr('id');
            this.regPart = $('#menu').data('reg-id');

            // build options object to pass into child view constructor
            childViewOptions.id = this.sectionId;
            childViewOptions.version = this.regVersion;

            // find search query
            if (this.contentType === 'search-results') {
                childViewOptions.id = Helpers.parseURL(window.location.href);
                childViewOptions.params = childViewOptions.id.params;
                childViewOptions.query = childViewOptions.id.params.q;
                childViewOptions.rendered = true;
            }

            if (this.contentType === 'landing-page') {
                DrawerEvents.trigger('pane:change', 'table-of-contents');
            }

            if (this.sectionId) {
                // store the contents of our $el in the model so that we 
                // can re-render it later
                this.modelmap[this.contentType].set(this.sectionId, this.$el.html());
                childViewOptions.model = this.modelmap[this.contentType];
            }

            if (this.contentType && typeof this.viewmap[this.contentType] !== 'undefined') {
                // create new child view
                this.childView = new this.viewmap[this.contentType](childViewOptions);
            }

            this.sectionFooter = new SectionFooter({el: this.$el.find('.section-nav')});
        },

        modelmap: {
            'reg-section': RegModel,
            'search-results': SearchModel,
            'diff': DiffModel
        }, 

        viewmap: {
            'reg-section': RegView,
            'search-results': SearchResultsView,
            'diff': DiffView
        },

        createView: function(id, options, type) {
            // update
            this.contentType = type;
            if (id !== null) {
                this.sectionId = id;
            }

            options.id = id;
            options.type = this.contentType;
            options.regVersion = this.regVersion;
            options.regPart = this.regPart;
            options.model = this.modelmap[this.contentType];
            options.cb = this.render;

            this.loading();
            this.childView = new this.viewmap[this.contentType](options);
        },

        // ex: diff/1005-1/2011-12121/2012-11111/?from_version=2012-11111
        _assembleDiffURL: function(id, options) {
            var url = 'diff/' + id + '/' + options.baseVersion;
            url += '/' + options.newerVersion;
            url += '?from_version=' + options.newerVersion;

            options.url = url;
            this.loadContent(url, options, 'diff');
        },

        render: function(html, options) {
            var offsetTop, $scrollToId;

            if (typeof this.childView !== 'undefined') {
                this.childView.remove();
                this.sectionFooter.remove();
            }

            this.$el.html(html);

            SidebarEvents.trigger('update', {
                'type': this.contentType,
                'id': this.sectionId
            });

            if (typeof options.scrollToId !== 'undefined') {
                $scrollToId = $('#' + options.scrollToId);
                if ($scrollToId.length > 0) {
                    offsetTop = $scrollToId.offset().top;
                }
            }

            window.scrollTo(0, offsetTop || 0);

            this.loaded();
        },

        loading: function() {
            // visually indicate that a new section is loading
            $('.main-content').addClass('loading');

        },

        loaded: function() {
            $('.main-content').removeClass('loading');

            // change focus to main content area when new sections are loaded
            $('.section-focus').focus();
        }
    });
    var main = new MainView();
    return main;
});

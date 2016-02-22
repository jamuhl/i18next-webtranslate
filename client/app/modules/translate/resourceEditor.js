define([
    'backbone',
    'namespace',
    './resourceSync',
    'i18next'
],

function(Backbone, ns, resSync, i18n) {
	var app = ns.app;

    // Create a new module
    var module = ns.module({ name: 'translationSample', append: false });

    var Controller = ns.Controller.extend({
        editor: function() {
            //if (!this.isAuth()) return;

            var view = new module.Views.Main();
            app.main.show(view);
        }
    });
    module.controller = new Controller();

    var Router = ns.Router.extend({
        appRoutes: {
            '': 'editor',
            'editor': 'editor'
        },
        
        controller: module.controller
    });
    var router = new Router();
    var compareLng = '';

    module.Views.Main = ns.Layout.extend({
        tagName: 'div',
        template: 'resourceEditorLayout',

        regions: {
            resources: '#resources'
        },

        initialize: function(options) {
        },

        events: {
            'click #add': 'ui_add',
            'keyup .filter': 'ui_filter',
            'keyup .filter-value': 'ui_filter_value'
        },

        ui_filter: _.debounce(function(e) {
            //e.preventDefault();

            app.vent.trigger('filter', this.$('.filter').val());
        }, 250),

        ui_filter_value: _.debounce(function(e) {
            app.vent.trigger('filter', this.$('.filter-value').val(), true);
        }, 250),

        ui_load: function(e) {
            if (e) e.preventDefault();

            var lng = this.$('#languages').val()
              , ns = this.$('#namespaces').val();

            compareLng = this.$('#compare-lng').val();

            var compareItem = resSync.flat[compareLng][ns],
                currentItem = resSync.flat[lng][ns];

            if(currentItem.models.length > 0) {
              var counter = currentItem.models.length, 
                  compareCounter = compareItem.models.length,
                  i = 0,
                  j = 0;

              for(i = 0; i < counter; i++) {
                var checkCompare = false;
                for(j = 0; j < compareCounter; j++) {
                  if (compareItem.models[j] && compareItem.models[j].get('key') == currentItem.models[i].get('key')) {
                    currentItem.models[i].set({'compare': compareItem.models[j].get('value')});
                    checkCompare = true;
                    break;
                  }
                }
                if (!checkCompare) {
                  currentItem.models[i].set({'compare': ''});
                }
              }
            }
            var colView = new module.Views.Resources({
                collection: resSync.flat[lng][ns],
                parent: this
            });

            this.resources.show(colView);
        },

        ui_add: function(e) {
            e.preventDefault();
            var self = this;

            var key = this.$('#addKey').val();

            resSync.update(
                this.$('#languages').val(),
                this.$('#namespaces').val(),
                key,
                '',
                function(err) {
                    self.$('#addKey').val('')
                        .blur();

                    var binding = self.bindTo(self.resources.currentView, 'render', function() {
                        setTimeout(function() {
                            var sel = '#' + key.replace(/\./g, '');
                            var checkSel = '.resources:not(:has(' + sel + '))';
                            while($(sel) < 0) {
                                // doNothing
                            }
                            $.smoothScroll({
                                offset: -90,
                                direction: 'top', // one of 'top' or 'left'
                                scrollTarget: sel, // only use if you want to override default behavior
                                //afterScroll: null,   // function to be called after scrolling occurs. "this" is the triggering element
                                easing: 'swing',
                                speed: 400
                            });
                            self.unbindFrom(binding);
                        }, 200);
                    }, self);

                    self.resources.currentView.collection.sort();
                
                }
            );

        },
        
        onRender: function() {
            var data = resSync.options
              , i, len, opt, item;

            for (i = 0, len = data.languages.length; i < len; i++) {
                opt = data.languages[i];
                item = '<option value="' + opt + '">' + opt + '</option> ';
                this.$('#languages').append($(item));
                this.$('#compare-lng').append($(item));
            }     

            for (i = 0, len = data.namespaces.length; i < len; i++) {
                opt = data.namespaces[i];
                item = '<option value="' + opt + '">' + opt + '</option> ';
                this.$('#namespaces').append($(item));
            }
            
            this.ui_load();
        },

        onShow: function() {
            var self = this;

            this.$('#languages').chosen().change(function() { self.ui_load(); });
            this.$('#namespaces').chosen().change(function() { self.ui_load(); });
            this.$('#compare-lng').chosen().change(function() { self.ui_load(); });
        }
            
    });

    module.Views.ResourceItem = ns.ItemView.extend({
        tagName: 'li',
        template: 'resourceEditorItem',

        initialize: function(options) {
            this.isHidden = false;
            this.bindTo(app.vent, 'filter', this.filter, this);
        },

        events: {
            'click .edit': 'ui_edit',
            'click .editor-wrapper': 'ui_edit',
            'click .cancel': 'ui_cancelEdit',
            'click .save': 'ui_save',
            'click .remove': 'ui_toggleRemove',
            'click .cancelRemove': 'ui_toggleRemove',
            'click .confirmRemove': 'ui_confirmRemove',
            'click .test': 'ui_toggleTest',
            'click .refresh': 'ui_refreshTest',
            'click .compare': 'ui_compare',
            'click .preview': 'ui_preview',
            'click .multiline': 'ui_toggleArray',
            'click .singleline': 'ui_toggleArray',
            'click .compareEdit': 'ui_compare_edit',
            'click .compare-editor-wrapper': 'ui_compare_edit',
            'click .compareCancel': 'ui_compare_cancelEdit',
            'click .compareSave': 'ui_compare_save'
        },

        filter: function(token, value) {
            var reg = new RegExp(token), target;

            if (value) {
               target = this.model.get('value');
            } else {
                target = this.model.get('id');
            }

            if (token === '' && this.isHidden) {
                this.$el.show();
                this.isHidden = false;
            } else if (reg.test(target) === false && !this.isHidden) {
                this.$el.hide();
                this.isHidden = true;
            } else if (reg.test(target) === true && this.isHidden) {
                this.$el.show();
                this.isHidden = false;
            }
        },

        ui_edit: function(e) {
            e.preventDefault();

            if (!this.$('.editor').val()) {
                this.$('.editor').val(this.model.get('fallback').value);
            }

            this.$('.editor').removeAttr('disabled');
            this.$('.editor').focus();
            this.$('.mainCommands').hide();
            this.$('.editCommands').show();
        },

        ui_cancelEdit: function(e, noReplace) {
            if (e) e.preventDefault();

            this.$('.editor').attr('disabled', 'disabled');
            this.$('.mainCommands').show();
            this.$('.editCommands').hide();


            if (!noReplace) {
                this.$('.editor').val(this.model.get('value'));
            }
        },

        ui_save: function(e) {
            if (e) e.preventDefault();

            var self = this;
            this.$('.editCommands button').attr('disabled', 'disabled');

            var raw = this.$('.editor').val()
              , array;

            if (this.model.get('isArray')) {
                array = raw.split('\n');
            }

            resSync.update(
                this.model.get('lng'),
                this.model.get('ns'),
                this.model.id,
                array || raw,
                function(err) {
                    self.model.set('value', raw);
                    self.$('.editCommands button').removeAttr('disabled');
                    self.ui_cancelEdit(undefined, true);
                }
            );
        },

        ui_toggleRemove: function(e) {
            if (e) e.preventDefault();

            if (this.removing) {
                this.removing = false;
                this.$('.removeCommands').hide();
                this.$('.mainCommands').show();
                this.resetI18n(function() {});
            } else {
                this.removing = true;
                this.$('.removeCommands').show();
                this.$('.mainCommands').hide();
            }
        },

        ui_confirmRemove: function(e) {
            if (e) e.preventDefault();

            var self = this;
            this.$('.remove').attr('disabled', 'disabled');

            resSync.remove(
                this.model.get('lng'),
                this.model.get('ns'),
                this.model.id,
                '',
                function(err) { }
            );
        },

        ui_toggleTest: function(e) {
            e.preventDefault();

            if (this.testing) {
                this.testing = false;
                this.$('.testSection').hide();
                this.$('.previewSection').show();
                this.resetI18n(function() {});
            } else {
                this.testing = true;
                this.$('.testSection').show();
                this.$('.previewSection').hide();

                this.ui_refreshTest();
            }
        },

        ui_refreshTest: function(e) {
            if (e) e.preventDefault();

            var self = this;

            // test using the provided i18next options as a base
            var opts = resSync.options || {};

            // The default namespace to test is the current namespace
            opts.ns = self.model.get('ns');
            
            // replace default options with any provided in test window
            var args = self.$('.i18nOptions').val();
            if (args.length > 0) {
                args = args.replace(new RegExp(' = ', 'g'), '=').split(/\n|\r/);
                for (var i = 0, len = args.length; i < len; i++) {
                    var split = args[i].split('=');
                    if ($.isNumeric(split[1])) {
                        split[1] = parseInt(split[1], 10);
                    } else {
                        split[1] = split[1].replace(/'|"/g, '');
                    }
                    opts[split[0]] = split[1];
                }
            }

            function test(t, o) {
                self.$('.translated').html(t(self.model.id, o));
            }

            if (!resSync.i18nDirty) {
                this.prepareI18n(function(t) {
                    test(t, opts);
                });
            } else {
                test(i18n.t, opts);
            }
        },

        ui_compare: function(e) {
            e.preventDefault();

            this.$('.compare-commands').show();
            this.$('.compareControl').show();
            this.$('.preview-commands').hide();
            this.$('.previewControl').hide();
        },

        ui_preview: function(e) {
            e.preventDefault();

            this.$('.compare-commands').hide();
            this.$('.compareControl').hide();
            this.$('.preview-commands').show();
            this.$('.previewControl').show();
        },

        prepareI18n: function(cb) {
            var self= this;

            var options = _.extend(resSync.options, {
                resStore: resSync.resStore,
                lng: this.model.get('lng')
            });

            i18n.init(options, function(t) {
                resSync.i18nDirty = true;
                cb(t);
            });
        },

        resetI18n: function(cb) {
            var self = this;

            i18n.init(resSync.i18nOptions, function(t) {
                resSync.i18nDirty = false;
                if (cb) cb(t);
            });
        },

        ui_toggleArray: function(e) {
            e.preventDefault();

            if (this.model.get('isArray')) {
                this.model.set('isArray', false);
            } else {
                this.model.set('isArray', true);
            }
            this.render();
        },

        onRender: function() {
            this.$el.attr('id', this.model.id.replace(/\./, ''))
                .attr('name', this.model.id.replace(/\./, ''))
                .attr('href', '/#' + this.model.id.replace(/\./, ''));

            var fallbackLng = this.model.get('fallback').lng;
            if (fallbackLng !== this.model.get('lng')) {
                this.$('.resource').addClass('isFallback');
                this.$('.key').addClass('isFallback');
                this.$('.fallbackBadge').removeClass('badge-success')
                    .addClass('badge-warning');
            }
            if (fallbackLng === resSync.options.fallbackLng &&
                this.model.get('lng').indexOf(resSync.options.fallbackLng) < 0) {
                this.$('.resource').addClass('toFallback');
                this.$('.key').addClass('toFallback');
                this.$('.fallbackBadge').removeClass('badge-success')
                    .removeClass('badge-warning')
                    .addClass('badge-error');
            }

            if (this.model.get('isArray')) {
                this.$('.multiline').hide();
            } else {
                this.$('.singleline').hide();
            }
        },

        onClose: function() {
            if (resSync.i18nDirty) {
                this.resetI18n();
            } 
        },

        ui_compare_edit: function(e) {
          e.preventDefault();

          if (!this.$('.compare-editor').val()) {
            //this.$('.compare-editor').val(this.model.get('fallback').value);
          }

          this.$('.compare-editor').removeAttr('disabled');
          this.$('.compare-editor').focus();
          this.$('.compareMainCommands').hide();
          this.$('.compareEditCommands').show();
        },

        ui_compare_cancelEdit: function(e, noReplace) {
          if (e) e.preventDefault();

          this.$('.compare-editor').attr('disabled', 'disabled');
          this.$('.compareMainCommands').show();
          this.$('.compareEditCommands').hide();

          if (!noReplace) {
            this.$('.compare-editor').val(this.model.get('compare'));
          }
        },

        ui_compare_save: function(e) {
          if (e) e.preventDefault();

          var self = this;
          this.$('.compareEditCommands button').attr('disabled', 'disabled');

          var raw = this.$('.compare-editor').val()
            , array;

          if (this.model.get('isArray')) {
            array = raw.split('\n');
          }

          if (compareLng) {
            resSync.update(
              compareLng,
              this.model.get('ns'),
              this.model.id,
              array || raw,
              function(err) {
                self.$('.compareEditCommands button').removeAttr('disabled');
                self.ui_compare_cancelEdit(undefined, true);
              }
            );
          }
        }
    });

    module.Views.Resources = ns.CollectionView.extend({
        tagName: 'ul',
        className: 'unstyled resources',
        itemView: module.Views.ResourceItem
    });

    // Required, return the module for AMD compliance
    return module;
});

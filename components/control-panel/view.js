define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'lateralus.component.tabs'

], function (

  _
  ,Lateralus

  ,template

  ,TabsComponent

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ControlPanelComponentView = Base.extend({
    template: template

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);

      this.tabsComponent = this.addSubview(TabsComponent.View, {
        $tabsContainer: this.$tabsContainer,
        $tabsContentContainer: this.$tabsContentContainer
      });

      this.selectTabFromLocalStorage();
      this.listenTo(this.tabsComponent, 'tabShown', this.onTabShown.bind(this));
    }

    /**
     * @param {jQuery} $shownTab
     */
    ,onTabShown: function ($shownTab) {
      this.lateralus.model.setUi(
        'focusedControlPanelTab', $shownTab.data('tabName'));
    }

    ,selectTabFromLocalStorage: function () {
      var focusedTabName = this.lateralus.model.getUi('focusedControlPanelTab');

      if (focusedTabName) {
        var $focusedTab = this.$tabsContainer.children()
          .filter('[data-tab-name="' + focusedTabName + '"]');

        this.tabsComponent.selectTab($focusedTab);
      }
    }
  });

  return ControlPanelComponentView;
});

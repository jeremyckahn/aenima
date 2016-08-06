define([

  'lateralus'

  ,'./view'
  ,'./model'
  ,'text!./template.mustache'

  ,'aenima.component.user-creation'
  ,'aenima.component.user-display'

], function (

  Lateralus

  ,View
  ,Model
  ,template

  ,UserCreationComponent
  ,UserDisplayComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var UserPanelComponent = Base.extend({
    name: 'user-panel'
    ,View: View
    ,Model: Model
    ,template: template

    ,lateralusEvents: {
    }

    ,initialize: function () {
      this.userCreationComponent =
        this.addComponent(UserCreationComponent, {
          el: this.view.$userCreation[0]
        });

      this.userLoginComponent =
        this.addComponent(UserDisplayComponent, {
          el: this.view.$userDisplay[0]
        });
    }
  });

  return UserPanelComponent;
});

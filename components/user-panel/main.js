define([

  'lateralus'

  ,'./view'
  ,'./model'
  ,'text!./template.mustache'

  ,'../user-creation/main'
  ,'../user-login/main'
  ,'../user-display/main'

], function (

  Lateralus

  ,View
  ,Model
  ,template

  ,UserCreationComponent
  ,UserLoginComponent
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
      this.userLoginComponent =
        this.addComponent(UserLoginComponent, {
          el: this.view.$userLogin[0]
        });

      this.userCreationComponent =
        this.addComponent(UserCreationComponent, {
          el: this.view.$userCreation[0]
        });

      this.userDisplayComponent =
        this.addComponent(UserDisplayComponent, {
          el: this.view.$userDisplay[0]
        });
    }
  });

  return UserPanelComponent;
});

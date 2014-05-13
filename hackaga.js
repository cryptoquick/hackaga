if (Meteor.isClient) {
  // Init
  Session.set('x', $(window).width() / 2 - 50);
  Session.set('y', $(window).height() - 100);
  
  // Window Code
  
  // Meteor / game stuff
  
  Template.game.playerX = function () {
    return Session.get('x');
  };
  
  Template.game.playerY = function () {
    return Session.get('y');
  };

  $(document).ready(function () {
    $('body').on('keydown', function (evt) {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button", evt.which);

      var x = Session.get('x');
      var y = Session.get('y');
      var speed = 10;

      if (evt.which === 39) {
        Session.set('x', x += speed);
      }
      else if (evt.which == 37) {
        Session.set('x', x -= speed);
      }
    });
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

if (Meteor.isClient) {
  // Init
  Session.set('x', $(window).width() / 2 - 50);
  Session.set('y', $(window).height() - 100);
//   Session.set('missileFired', false);
//   Session.set('missilePop', false);
//   Session.set('missileTrack', Session.get('y') - 30);
  
  
  var missileStartY = Session.get('y') - 30;
  Session.set('missiles', []);
  
  // Rate Code
  
  // Meteor / game stuff
  
  window.missileInterval = setInterval(function () {
    var missiles = Session.get('missiles');
    missiles.forEach(function (m, i, arr) {
      if (m.y < 50) {
        m.deleted = true;
      }
      else {
        m.y = m.y - 30;
      }
    });
    Session.set('missiles', missiles);
  }, 100);
  
  Template.game.missiles = function () {
    return Session.get('missiles');
  };
  
  Template.game.burst = function () {
    if (Session.get('missilePop')) {
      Session.set('missilePop');
      return 'burst'
    }
    else {
      return '';
    }
  };
  
  Template.game.playerX = function () {
    return Session.get('x');
  };
  
  Template.game.playerY = function () {
    return Session.get('y');
  };
  
//   Template.game.missile = function () {
//     console.log((function () { return Session.get('x') + 37.5; })());
//     return {
//       x: (function () { return Session.get('x') + 37.5; })(),
//       y: Session.get('missileTrack'),
//       fired: Session.get('missileFired')
//     };
//   };

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
      
      if (evt.which === 38) {
        var missiles = Session.get('missiles');
        missiles.push({
          x: Session.get('x'),
          y: missileStartY
        });
        Session.set('missiles', missiles);
      }
    });
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

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
    var swarm = Session.get('swarm');
    missiles.forEach(function (m, i, arr) {
      if (m.y < -10) {
        arr[i] = undefined;
      }
      else {
        m.y = m.y - 30;
        var collision = _.detect(swarm, function(bug){
          var bugPosition = document.getElementById("bug-"+bug.id).getBoundingClientRect();
          return m.x > bugPosition.left && m.x < bugPosition.right &&
                 m.y > bugPosition.top && m.y < bugPosition.bottom;
        });
        if (collision) {
          arr[i] = undefined;
          Session.set('swarm', _.without(swarm, collision));
          explode(m);
        }
      }
    });
    Session.set('missiles', _.compact(missiles));
  }, 100);
  
  Template.game.missiles = function () {
    return Session.get('missiles');
  };
  
  Session.set('explosions', []);
  function explode(coords){
    var explosions = Session.get('explosions');
    if (coords.x && coords.y) {
      explosions.push(coords);
      coords['graphic'] = Math.random() > 0.5? "0" : "1";
      Session.set('explosions', explosions);
      var e = explosions
      setTimeout(function(){
        var explosions = Session.get('explosions');
        Session.set('explosions', _.without(explosions, _.findWhere(explosions, coords)));
      }, 500);
    }
  }

  Template.game.explosions = function () {
    return Session.get('explosions');
  };
  Template.game.graphicIs = function (graphic) {
    return this.graphic === graphic;
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
          x: Session.get('x') + 10,
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

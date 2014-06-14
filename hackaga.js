if (Meteor.isClient) {
  // Init
  Session.set('x', $(window).width() / 2 - 50);
  Session.set('y', $(window).height() - 100);

  var max = $(window).width() - 100;
  var min = 0;
  
  var missileStartY = Session.get('y') - 30;
  Session.set('missiles', []);
  Session.set('explosions', []);
  
  // Rate Code
  
  // Meteor / game stuff
  
  
  window.explode = function(coords, graphic, noTimeout){
    var explosions = Session.get('explosions');
    if (coords.x && coords.y) {
      coords['graphic'] = graphic || (Math.random() > 0.5? "0" : "1");
      explosions.push(coords);
      Session.set('explosions', explosions);
      var cleanUp = function() {
        var explosions = Session.get('explosions');
        Session.set('explosions', _.without(explosions, _.findWhere(explosions, coords)));
      };
      if(!noTimeout) setTimeout(cleanUp, 500);
    }
  };

  Template.game.explosions = function () {
    return Session.get('explosions');
  };
  Template.game.graphicIs = function (graphic) {
    return this.graphic === graphic;
  };
  
  window.missileInterval = setInterval(function () {
    var missiles = Session.get('missiles');
    var swarm = Session.get('swarm');
    missiles.forEach(function (m, i, arr) {
      if (m.y < -10) {
        arr[i] = undefined;
      }
      else {
        m.y = m.y - 20;
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
  }, 70);
  
  Template.game.missiles = function () {
    return Session.get('missiles');
  };
  
  Template.game.playerX = function () {
    return Session.get('x');
  };
  
  Template.game.playerY = function () {
    return Session.get('y');
  };

  window.stopEverything = function(){
    clearInterval(swarmInterval);
    $('body').off('keydown');
  }
  
  window.message = function(message, color) {
    var color = color || "#dddd00";
    $('#message').text(message).css('color', color).show();
  };

  $(document).ready(function () {
    $('body').on('keydown', function (evt) {
      // template data, if any, is available in 'this'
      console && console.log("You pressed the button", evt.which);

      var x = Session.get('x');
      var y = Session.get('y');
      var speed = 10;

      if (evt.which === 39) {
        Session.set('x', Math.min(x += speed, max));
      }
      else if (evt.which == 37) {
        Session.set('x', Math.max(x -= speed, min));
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

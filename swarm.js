if(Meteor.isClient) {
    var dim = 40;
    var bugz = [];

    var width = $(window).width() * 0.75;
    var height = $(window).height() * 0.6;

    var horiz_spacing = width / 8;
    var vert_spacing = (height / 4);

    var graphics = ["apple", "greenapple", "corn"];
    
    for( var i = 0; i < 8; i++ ) {
        for( var j = 0; j < 4; j++ ) {
            var graphic = graphics[Math.floor(Math.random()*3)];
            bugz.push({id: i*4+j, x: i*horiz_spacing, y: j*vert_spacing, width: dim, height: dim, graphic: graphic});
        }
    }
    Template.swarm.bugz = function(){
        return Session.get('swarm');
    };
    Template.swarm.graphicIs = function (graphic) {
      return this.graphic === graphic;
    };
    Session.set('swarm', bugz);

    window.swarmInterval = setInterval(function () {
        $swarm = $('#swarm');
        var x = $swarm.attr('data-position-x'),
            y = $swarm.attr('data-position-y');
        
        if ($swarm.attr('data-direction') == "left") {
            x--;
        } else {
            x++;
        }
        if (x%10 === 0)
            y++;
        
        if ($swarm.attr('data-position-x') >= $(window).width() * 0.25) {
            $swarm.attr('data-direction', 'left');
        } else if ($swarm.attr('data-position-x') <= 50) {
            $swarm.attr('data-direction', 'right');
        }

        $swarm.attr('transform', 'translate(' + x + ', ' + y + ')');
        $swarm.attr('data-position-x', x);
        $swarm.attr('data-position-y', y);

        if (x%5 === 0) {
            var swarm = Session.get('swarm');
            if (swarm.length === 0) {
                stopEverything();
                message("YOU WIN!", "#22DD22");
            }

            // colission detecton with tractor
            var player = {x: Session.get('x'), y:Session.get('y')};

            var collision = _.detect(swarm, function(bug){
              var bugPosition = document.getElementById("bug-"+bug.id).getBoundingClientRect();
              return player.y < bugPosition.bottom &&
                     player.x < bugPosition.right && (player.x + 100) > bugPosition.left;
            });
            if (collision) {
              Session.set('swarm', _.without(swarm, collision));
              stopEverything();
              explode(player, "4", true);
              message("YOU LOSE", "#DD2222");
            }
        }

    }, 30);

}


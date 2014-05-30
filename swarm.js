if(Meteor.isClient) {
    var dim = 40;
    var bugz = [];

    var width = $(window).width() * 0.75;
    var height = $(window).height() * 0.6;

    var horiz_spacing = width / 8;
    var vert_spacing = (height / 4);
    
    for( var i = 0; i < 8; i++ ) {
        for( var j = 0; j < 4; j++ ) {
            bugz.push({x: i*horiz_spacing, y: j*vert_spacing, width: dim, height: dim});
        }
    }
    Template.swarm.bugz = bugz;

    
    window.setInterval(function () {
        $swarm = $('#swarm');
        var x = $swarm.attr('data-position-x'),
            y = $swarm.attr('data-position-y');
        
        if ($swarm.attr('data-direction') == "left") {
            x--;
        } else {
            x++;
        }
        if (x%20 === 0)
            y++;
        
        if ($swarm.attr('data-position-x') == 200) {
            $swarm.attr('data-direction', 'left');
        } else if ($swarm.attr('data-position-x') <= 0) {
            $swarm.attr('data-direction', 'right');
        }

        $swarm.attr('transform', 'translate(' + x + ', ' + y + ')');
        $swarm.attr('data-position-x', x);
        $swarm.attr('data-position-y', y);
    }, 70);
}

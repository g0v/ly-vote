(function(){
  $(function(){
    return lyvote.render({
      /* optional argument */
      cx: 600,
      cy: 500,
      transform: "scale(0.8)",
      seatMapping: lyvote.map.linear
      /* required argument */,
      namelist: "voter.json",
      node: '#nuke'
    });
  });
}).call(this);

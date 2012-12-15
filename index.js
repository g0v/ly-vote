(function(){
  $(function(){
    lyvote.render({
      /* optional argument */
      cx: 500,
      cy: 500,
      seatMapping: lyvote.map.linear
      /* required argument */,
      namelist: "voter.json",
      node: '#nuke'
    });
    return lyvote.render({
      /* optional argument */
      cx: 500,
      cy: 500,
      seatMapping: lyvote.map.linear
      /* required argument */,
      namelist: "voter.json",
      node: '#madcow'
    });
  });
}).call(this);

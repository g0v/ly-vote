
@lyvote =
  svg: null
  config:
    min: true
    cx: 500
    cy: 500
    #seat-count:  [12 16 18 22 24 21] now seat-count is auto-calculated
    transform: ""
    node: \body

  colors:
    "KMT": \#55f
    "DPP": \#090
    "NSU": \#fbb
    "TSU": \#b26
    "PFP": \#f90
    "N/A": \#bbb
    null:  \#bbb

  map:
    qsort:
      idx: 0
      map: {}
      order: null
      limit: 0
      init: (r) ->
        len = r.config.seat-count.reduce (+)
        @limit = 0
        @order = [it for it til len]
        @order = [[it,(r.seat-position it)0] for it in @order]
        for it til len
          [t,i] = [@order[it],it + parseInt Math.random! * (len - it)]
          @order[it] = @order[i]
          @order[i]  = t

      _sort: (r, limit, level, L, R) ->
        if level>limit then return
        if L>=R then return
        pi = L + parseInt Math.random! * (R - L + 1 )
        t = @order[L]
        @order[L] = @order[pi]
        @order[pi] = t
        p = @order[L]1
        i = L+1
        j = R
        while i < j
          while @order[i]1<=p and i<j
            i++
          while @order[j]1>p
            j--
          if i>=j then break
          t = @order[i]
          @order[i] = @order[j]
          @order[j] = t
        t = @order[L]
        @order[L] = @order[j]
        @order[j] = t
        @_sort(r, limit, level+1, L, j-1)
        @_sort(r, limit, level+1, j+1, R)

      sort: (r) ->
        @_sort(r, @limit++, 0, 0, @order.length-1)

      indexOf: (r, name) ->
        @order[@map[name] ?= @idx++ ]0

    xorder:
      idx: 0
      map: {}
      order: null
      indexOf: (r, name) ->
        if !@order
          @order = [[it,(r.seat-position it)0] for it til r.config.seat-count.reduce (+)].sort (a,b) -> a[1]-b[1]
        return @order[@map[name] ?= @idx++ ]0

    strip:
      idx: 0
      map: {}
      order: null
      indexOf: (r, name) ->
        if !@order
          len = r.config.seat-count.reduce (+)
          @order = [0 to len by 2] +++ [1 to len by 2]
        @order[@map[name] ?= @idx++ ]

    circular:
      idx: 0
      map: {}
      order: null
      indexOf: (r, name) ->
        if !@order
          @order = [[it, (r.seat-position it)|> -> [it[0]-r.config.cx,it[1]] .reduce ((a,b)->a+b**2),0] for it til r.config.seat-count.reduce (+)].sort (a,b) -> a[1]-b[1]
        return @order[@map[name] ?= @idx++ ]0

    linear:
      idx: 0
      map: {}
      order: null
      indexOf: (r, name) ->
        return @map[name] ?= @idx++

    random:
      idx: 0
      map: {}
      order: null
      indexOf: (r, name) ->
        if !@order
          len = r.config.seat-count.reduce (+)
          @order = [it for it til len]
          for it til len
            [t,i] = [@order[it],it + parseInt Math.random! * (len - it)]
            @order[it] = @order[i]
            @order[i]  = t
        return @order[@map[name] ?= @idx++ ]


  _idx: 0
  _map: {}
  seat-mapping-default: (name) ->
    @_map[name] ?= @_idx++

  seat-mapping: (name) ->
    if @config.seat-mapping then @config.seat-mapping.indexOf .call @config.seat-mapping,@,name
    else @map.random.indexOf @,name

  remap: (map-obj) ->
    @config.seat-mapping = map-obj
    _pt = ~> @seat-position @seat-mapping it.name
    @seats.transition! .duration 750 .attr \transform ~> "translate(#{(_pt it)0},#{(_pt it)1})"
    @pie.transition!duration 750 .attr \transform ~> 
      if @config.min then "translate(#{@config.cx},#{@config.cy}) scale(3.2) translate(0 -50)"
      else "translate(#{@config.cx},#{@config.cy}) scale(1.3)"

  seat-position-xx: (idx) ->
    [0 0]

  seat-position: (idx) ->
    if @config.min then return [ @config.cx, @config.cy ]
    sc = @config.seat-count
    sc = [sc[to i].reduce (+) for ,i in sc]
    ret = (sc.map (-> it - idx) .filter (> 0))
    [row, len] = [@config.seat-count.length, ret.length]
    [i,j,m] = [row - len, ret[0]-1, sc[row - len] - 1 - (len<row && sc[row - len-1]) || 0 ]
    v = [ Math.cos(Math.PI*j/m), Math.sin Math.PI*j/m ]
    [ @config.cx + v[0]*(160+ i*60) , @config.cy - v[1]*(160 + i*60) ]

  seats: null
  h-name: {}
  h-party: {}
  generate: (error, mlys) ->
    [@h-name,@h-party] = [{}  {0:0}]
    if !@config.seat-count
      _sc = [0 til 6].map -> parseInt 2*Math.PI*(it*60+160)
      _sc_total = _sc.reduce (+)
      @config.seat-count = _sc.map -> Math.round it*mlys.length/_sc_total
    idx = 0
    for mly in mlys
      @h-name[mly.name] =
        name: mly.name
        vote: 0
        party: mly.party
        idx: idx++
      @h-party[mly.party] ?= @h-party[0]++
    for names,i in @config.vote
      for name in names
        @h-name[name].vote = i+1

    @svg = d3.select @config.node .append \svg
       .attr \class \lyvote
       .attr \viewBox "0 0 1024 500"
       .attr \preserveAspectRatio "xMinYMin meet"

    defs = @svg.selectAll \defs .data mlys .enter! .append \pattern
      .attr \id ~> \defs_h + @h-name[it.name].idx
      .attr \patternUnits \userSpaceOnUse
      .attr \x 30
      .attr \y 30
      .attr \width 50
      .attr \height 50

    imgs = defs.append \image
      .attr \xlink:href -> "http://avatars.io/50a65bb26e293122b0000073/#{CryptoJS.MD5('MLY/'+it.name).toString()}?size=medium"
      .attr \x 0
      .attr \y 0
      .attr \width 50
      .attr \height 50
      .attr \transform "scale(0.9)"

    panel = @svg.append \g
       .attr \transform ~> @config.transform

    _pt = ~> @seat-position @seat-mapping it.name
    @seats = panel.selectAll \g.seat
       .data [@h-name[it] for it of @h-name].sort( (a,b) ~>
         @h-party[a.party] - @h-party[b.party]) .enter! .append \g
       .attr \transform ~> "translate(#{(_pt it)0},#{(_pt it)1}) rotate(180) scale(-1, -1)"

    lockcell = null
    @seats.append \circle
       .attr \class \mly-seat
       .attr \r 20
       .attr \fill ~> @colors[it.party]
       .style \opacity ~> if it.vote == 0 then 0.3 else 1
    @seats.on \click ~>
       if lockcell
         d3.select lockcell .select \circle .attr \fill ~> @colors[it.party]
           .transition! .duration 500
           .attr \transform "scale(1)"
           .attr \stroke \none
           .style \opacity ~> if it.vote == 0 then 0.3 else 1
         d3.select lockcell .select \path .transition!duration 750 .style \opacity 1.0
         d3.select lockcell .select \rect .transition!duration 750 .style \opacity 0.4
         d3.select lockcell .select \text .transition!duration 750 .style \opacity 1.0
       p = d3.event.target.parentNode
       if lockcell == p then return lockcell := null
       lockcell := p
       d3.select lockcell .select \circle .attr \fill -> "url(\#defs_h#{it.idx})"
         .transition! .duration 500
         .attr \transform "scale(2)"
         .attr \stroke ~> @colors[it.party]
         .attr \stroke-width \3px
         .style \opacity  1
       d3.select lockcell .select \path .transition!duration 750 .style \opacity 0.1
       d3.select lockcell .select \rect .transition!duration 750 .style \opacity 0.0
       d3.select lockcell .select \text .transition!duration 750 .style \opacity 0.1

    @seats.append \path
       .attr \d ~> switch it.vote
       |1 => "M-12 0 L0 10 L11 -11"
       |2 => "M-10,-10 L10,10 L0 0 L-10 10 L10 -10"
       |3 => "M-10 0 L10 00"
       |9 => "M15 0 A15 15 0 1 1 -15 0 A15 15 0 1 1 15 0"
       |otherwise => "M0 0"
       .attr \stroke ~> switch it.vote
       |1 => \#0b0
       |2 => \#b00
       |3 => \#bb0
       |otherwise => \#b00
       .attr \stroke-width \5px
       .attr \fill \none

    @seats.append \rect
       .attr \class \mly-name-box
       .attr \x -25
       .attr \y 9
       .attr \width 50
       .attr \height 17
       .attr \rx 10
       .attr \ry 10
       .attr \fill \#fff
       .style \opacity 0.4

    @seats.append \text
       .attr \class \mly-name
       .attr \y 22
       .attr \text-anchor \middle
       .text (.name)
    color = d3.scale.ordinal! .range <[#0b0 #b00 #bb0 #999 #070 #700 #aa0 #777]>
      .domain <[贊成 反對 棄權 缺席]>
    arc = d3.svg.arc!outerRadius 80 .innerRadius 20
    pie = d3.layout.pie!sort null .value (-> it.1) .sort d3.ascending .startAngle 0
    pie-data = [
      ["贊成", @config.vote.0.length] 
      ["反對", @config.vote.1.length]
      ["棄權", @config.vote.2.length]
      ["缺席", (@config.seat-count.reduce (+)) - [0 to 2].map(~> @config.vote[it].length).reduce (+)]
    ]
    pie-data.sort -> it.1
    @pie = panel.append \g .attr \class \pie
      .attr \transform "translate(#{@config.cx},#{@config.cy}) scale(3.2) translate(0 -50)"
      .on \click ~> 
        @config.min = !@config.min 
        @remap @config.seat-mapping
    piecut = @pie.selectAll \g.arc .data pie(pie-data) .enter!append \g 
      .attr \class \arc
    piecut.append \path
      .attr \d arc
      .style \fill (n,i) -> color n.data.0

    @pie.selectAll \text .data pie(pie-data) .enter!append \text
      .attr \transform -> "translate(#{arc.centroid(it)}) translate(0 0)"
      .style \font-size \11px
      .style \text-anchor \middle
      .text -> if it.data[1]==0 then "" else "#{it.data[0]}#{it.data[1]}票"

  factory: (config) ->
    @config = config
    @render = ->
      d3.json @config.namelist, (error, json) ~>
        @generate.call @, error, json
      @
    @
    
  render: (config) ->
    unless config.vote
        $ config.node
            ..find \span.approval .each -> config.[]vote[0] = $ @ .text! / ' '
            ..find \span.veto .each -> config.[]vote[1] = $ @ .text! / ' '
            ..find \span.abstention .each -> config.[]vote[2] = $ @ .text! / ' '
            ..find \span .hide!
    [0 to 2].map -> config.vote[it] = config.vote[it].filter ->it
    new @factory {}<<<@config<<<config .render!

@lyvote.factory.prototype = @lyvote

<- $
$ \.twlyvote .each -> 
  [json,mapper] = [($ @ .data \mly-list ),($ @ .data \mapper ) || "linear"]
  lyvote.render do
    seat-mapping: lyvote.map[mapper]
    namelist: json
    node: "#"+@.id

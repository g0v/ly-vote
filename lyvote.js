(function(){
  var slice$ = [].slice, split$ = ''.split;
  this.lyvote = {
    svg: null,
    config: {
      cx: 500,
      cy: 500,
      transform: "",
      node: 'body'
    },
    colors: {
      "KMT": '#55f',
      "DPP": '#090',
      "NSU": '#fbb',
      "TSU": '#b26',
      "PFP": '#f90',
      "N/A": '#bbb',
      'null': '#bbb'
    },
    map: {
      qsort: {
        idx: 0,
        map: {},
        order: null,
        limit: 0,
        init: function(r){
          var len, res$, i$, it, ref$, len$, t, i, results$ = [];
          len = r.config.seatCount.reduce(curry$(function(x$, y$){
            return x$ + y$;
          }));
          this.limit = 0;
          res$ = [];
          for (i$ = 0; i$ < len; ++i$) {
            it = i$;
            res$.push(it);
          }
          this.order = res$;
          res$ = [];
          for (i$ = 0, len$ = (ref$ = this.order).length; i$ < len$; ++i$) {
            it = ref$[i$];
            res$.push([it, r.seatPosition(it)[0]]);
          }
          this.order = res$;
          for (i$ = 0; i$ < len; ++i$) {
            it = i$;
            ref$ = [this.order[it], it + parseInt(Math.random() * (len - it))], t = ref$[0], i = ref$[1];
            this.order[it] = this.order[i];
            results$.push(this.order[i] = t);
          }
          return results$;
        },
        _sort: function(r, limit, level, L, R){
          var pi, t, p, i, j;
          if (level > limit) {
            return;
          }
          if (L >= R) {
            return;
          }
          pi = L + parseInt(Math.random() * (R - L + 1));
          t = this.order[L];
          this.order[L] = this.order[pi];
          this.order[pi] = t;
          p = this.order[L][1];
          i = L + 1;
          j = R;
          while (i < j) {
            while (this.order[i][1] <= p && i < j) {
              i++;
            }
            while (this.order[j][1] > p) {
              j--;
            }
            if (i >= j) {
              break;
            }
            t = this.order[i];
            this.order[i] = this.order[j];
            this.order[j] = t;
          }
          t = this.order[L];
          this.order[L] = this.order[j];
          this.order[j] = t;
          this._sort(r, limit, level + 1, L, j - 1);
          return this._sort(r, limit, level + 1, j + 1, R);
        },
        sort: function(r){
          return this._sort(r, this.limit++, 0, 0, this.order.length - 1);
        },
        indexOf: function(r, name){
          var ref$, ref1$;
          return this.order[(ref1$ = (ref$ = this.map)[name]) != null
            ? ref1$
            : ref$[name] = this.idx++][0];
        }
      },
      xorder: {
        idx: 0,
        map: {},
        order: null,
        indexOf: function(r, name){
          var it, ref$, ref1$;
          if (!this.order) {
            this.order = (function(){
              var i$, to$, fn$ = curry$(function(x$, y$){
                return x$ + y$;
              }), results$ = [];
              for (i$ = 0, to$ = r.config.seatCount.reduce(fn$); i$ < to$; ++i$) {
                it = i$;
                results$.push([it, r.seatPosition(it)[0]]);
              }
              return results$;
            }()).sort(function(a, b){
              return a[1] - b[1];
            });
          }
          return this.order[(ref1$ = (ref$ = this.map)[name]) != null
            ? ref1$
            : ref$[name] = this.idx++][0];
        }
      },
      strip: {
        idx: 0,
        map: {},
        order: null,
        indexOf: function(r, name){
          var len, ref$, ref1$;
          if (!this.order) {
            len = r.config.seatCount.reduce(curry$(function(x$, y$){
              return x$ + y$;
            }));
            this.order = (function(){
              var i$, to$, results$ = [];
              for (i$ = 0, to$ = len; i$ <= to$; i$ += 2) {
                results$.push(i$);
              }
              return results$;
            }()).concat((function(){
              var i$, to$, results$ = [];
              for (i$ = 1, to$ = len; i$ <= to$; i$ += 2) {
                results$.push(i$);
              }
              return results$;
            }()));
          }
          return this.order[(ref1$ = (ref$ = this.map)[name]) != null
            ? ref1$
            : ref$[name] = this.idx++];
        }
      },
      circular: {
        idx: 0,
        map: {},
        order: null,
        indexOf: function(r, name){
          var it, ref$, ref1$;
          if (!this.order) {
            this.order = (function(){
              var i$, to$, fn$ = curry$(function(x$, y$){
                return x$ + y$;
              }), results$ = [];
              for (i$ = 0, to$ = r.config.seatCount.reduce(fn$); i$ < to$; ++i$) {
                it = i$;
                results$.push([
                  it, fn1$(
                  r.seatPosition(it))
                ]);
              }
              return results$;
              function fn1$(it){
                return [it[0] - r.config.cx, it[1]].reduce(function(a, b){
                  return a + Math.pow(b, 2);
                }, 0);
              }
            }()).sort(function(a, b){
              return a[1] - b[1];
            });
          }
          return this.order[(ref1$ = (ref$ = this.map)[name]) != null
            ? ref1$
            : ref$[name] = this.idx++][0];
        }
      },
      linear: {
        idx: 0,
        map: {},
        order: null,
        indexOf: function(r, name){
          var ref$, ref1$;
          return (ref1$ = (ref$ = this.map)[name]) != null
            ? ref1$
            : ref$[name] = this.idx++;
        }
      },
      random: {
        idx: 0,
        map: {},
        order: null,
        indexOf: function(r, name){
          var len, res$, i$, it, ref$, t, i, ref1$;
          if (!this.order) {
            len = r.config.seatCount.reduce(curry$(function(x$, y$){
              return x$ + y$;
            }));
            res$ = [];
            for (i$ = 0; i$ < len; ++i$) {
              it = i$;
              res$.push(it);
            }
            this.order = res$;
            for (i$ = 0; i$ < len; ++i$) {
              it = i$;
              ref$ = [this.order[it], it + parseInt(Math.random() * (len - it))], t = ref$[0], i = ref$[1];
              this.order[it] = this.order[i];
              this.order[i] = t;
            }
          }
          return this.order[(ref1$ = (ref$ = this.map)[name]) != null
            ? ref1$
            : ref$[name] = this.idx++];
        }
      }
    },
    _idx: 0,
    _map: {},
    seatMappingDefault: function(name){
      var ref$, ref1$;
      return (ref1$ = (ref$ = this._map)[name]) != null
        ? ref1$
        : ref$[name] = this._idx++;
    },
    seatMapping: function(name){
      if (this.config.seatMapping) {
        return this.config.seatMapping.indexOf.call(this.config.seatMapping, this, name);
      } else {
        return this.map.random.indexOf(this, name);
      }
    },
    remap: function(mapObj){
      var _pt, this$ = this;
      this.config.seatMapping = mapObj;
      _pt = function(it){
        return this$.seatPosition(this$.seatMapping(it.name));
      };
      return this.seats.transition().duration(750).attr('transform', function(it){
        return "translate(" + _pt(it)[0] + "," + _pt(it)[1] + ")";
      });
    },
    seatPosition: function(idx){
      var sc, res$, i$, len$, i, ret, ref$, row, len, j, m, v, fn$ = curry$(function(x$, y$){
        return x$ + y$;
      });
      sc = this.config.seatCount;
      res$ = [];
      for (i$ = 0, len$ = sc.length; i$ < len$; ++i$) {
        i = i$;
        res$.push(slice$.call(sc, 0, i + 1 || 9e9).reduce(fn$));
      }
      sc = res$;
      ret = sc.map(function(it){
        return it - idx;
      }).filter((function(it){
        return it > 0;
      }));
      ref$ = [this.config.seatCount.length, ret.length], row = ref$[0], len = ref$[1];
      ref$ = [row - len, ret[0] - 1, sc[row - len] - 1 - (len < row && sc[row - len - 1]) || 0], i = ref$[0], j = ref$[1], m = ref$[2];
      v = [Math.cos(Math.PI * j / m), Math.sin(Math.PI * j / m)];
      return [this.config.cx + v[0] * (160 + i * 60), this.config.cy - v[1] * (160 + i * 60)];
    },
    seats: null,
    hName: {},
    hParty: {},
    generate: function(error, mlys){
      var ref$, _sc, _sc_total, idx, i$, len$, mly, key$, i, names, j$, len1$, name, defs, imgs, panel, _pt, it, lockcell, this$ = this;
      ref$ = [
        {}, {
          0: 0
        }
      ], this.hName = ref$[0], this.hParty = ref$[1];
      if (!this.config.seatCount) {
        _sc = [0, 1, 2, 3, 4, 5].map(function(it){
          return parseInt(2 * Math.PI * (it * 60 + 160));
        });
        _sc_total = _sc.reduce(curry$(function(x$, y$){
          return x$ + y$;
        }));
        this.config.seatCount = _sc.map(function(it){
          return Math.round(it * mlys.length / _sc_total);
        });
      }
      idx = 0;
      for (i$ = 0, len$ = mlys.length; i$ < len$; ++i$) {
        mly = mlys[i$];
        this.hName[mly.name] = {
          name: mly.name,
          vote: 0,
          party: mly.party,
          idx: idx++
        };
        (ref$ = this.hParty)[key$ = mly.party] == null && (ref$[key$] = this.hParty[0]++);
      }
      for (i$ = 0, len$ = (ref$ = this.config.vote).length; i$ < len$; ++i$) {
        i = i$;
        names = ref$[i$];
        for (j$ = 0, len1$ = names.length; j$ < len1$; ++j$) {
          name = names[j$];
          this.hName[name].vote = i + 1;
        }
      }
      this.svg = d3.select(this.config.node).append('svg').attr('viewBox', "0 0 1024 500").attr('preserveAspectRatio', "xMinYMin meet");
      defs = this.svg.selectAll('defs').data(mlys).enter().append('pattern').attr('id', function(it){
        return 'defs_h' + this$.hName[it.name].idx;
      }).attr('patternUnits', 'userSpaceOnUse').attr('x', 30).attr('y', 30).attr('width', 50).attr('height', 50);
      imgs = defs.append('image').attr('xlink:href', function(it){
        return "http://avatars.io/50a65bb26e293122b0000073/" + CryptoJS.MD5('MLY/' + it.name).toString() + "?size=medium";
      }).attr('x', 0).attr('y', 0).attr('width', 50).attr('height', 50).attr('transform', "scale(0.9)");
      panel = this.svg.append('g').attr('transform', function(){
        return this$.config.transform;
      });
      _pt = function(it){
        return this$.seatPosition(this$.seatMapping(it.name));
      };
      this.seats = panel.selectAll('g.seat').data((function(){
        var results$ = [];
        for (it in this.hName) {
          results$.push(this.hName[it]);
        }
        return results$;
      }.call(this)).sort(function(a, b){
        return this$.hParty[a.party] - this$.hParty[b.party];
      })).enter().append('g').attr('transform', function(it){
        return "translate(" + _pt(it)[0] + "," + _pt(it)[1] + ") rotate(180) scale(-1, -1)";
      });
      lockcell = null;
      this.seats.append('circle').attr('class', 'mly-seat').attr('r', 20).attr('fill', function(it){
        return this$.colors[it.party];
      }).style('opacity', function(it){
        if (it.vote === 0) {
          return 0.3;
        } else {
          return 1;
        }
      }).on('click', function(){
        if (lockcell) {
          d3.select(lockcell).attr('fill', function(it){
            return this$.colors[it.party];
          }).transition().duration(500).attr('transform', "scale(1)").attr('stroke', 'none').style('opacity', function(it){
            if (it.vote === 0) {
              return 0.3;
            } else {
              return 1;
            }
          });
        }
        if (lockcell === d3.event.target) {
          return lockcell = null;
        }
        lockcell = d3.event.target;
        return d3.select(d3.event.target).attr('fill', function(it){
          return "url(#defs_h" + it.idx + ")";
        }).transition().duration(500).attr('transform', "scale(2)").attr('stroke', function(it){
          return this$.colors[it.party];
        }).attr('stroke-width', '3px').style('opacity', 1);
      });
      this.seats.append('path').attr('d', function(it){
        switch (it.vote) {
        case 1:
          return "M-12 0 L0 10 L11 -11";
        case 2:
          return "M-10,-10 L10,10 L0 0 L-10 10 L10 -10";
        case 3:
          return "M-10 0 L10 00";
        case 9:
          return "M15 0 A15 15 0 1 1 -15 0 A15 15 0 1 1 15 0";
        default:
          return "M0 0";
        }
      }).attr('stroke', function(it){
        switch (it.vote) {
        case 1:
          return '#0b0';
        case 2:
          return '#b00';
        case 3:
          return '#999';
        default:
          return '#b00';
        }
      }).attr('stroke-width', '5px').attr('fill', 'none');
      this.seats.append('rect').attr('class', 'mly-name-box').attr('x', -25).attr('y', 9).attr('width', 50).attr('height', 17).attr('rx', 10).attr('ry', 10).attr('fill', '#fff').style('opacity', 0.4);
      return this.seats.append('text').attr('class', 'mly-name').attr('y', 22).attr('text-anchor', 'middle').text(function(it){
        return it.name;
      });
    },
    factory: function(config){
      this.config = config;
      this.render = function(){
        var this$ = this;
        d3.json(this.config.namelist, function(error, json){
          return this$.generate.call(this$, error, json);
        });
        return this;
      };
      return this;
    },
    render: function(config){
      var x$;
      if (!config.vote) {
        x$ = $(config.node);
        x$.find('span.approval').each(function(){
          return (config.vote || (config.vote = []))[0] = split$.call($(this).text(), ' ');
        });
        x$.find('span.veto').each(function(){
          return (config.vote || (config.vote = []))[1] = split$.call($(this).text(), ' ');
        });
        x$.find('span.abstention').each(function(){
          return (config.vote || (config.vote = []))[2] = split$.call($(this).text(), ' ');
        });
        x$.find('span').hide();
      }
      return new this.factory(import$(import$({}, this.config), config)).render();
    }
  };
  this.lyvote.factory.prototype = this.lyvote;
  function curry$(f, args){
    return f.length > 1 ? function(){
      var params = args ? args.concat() : [];
      return params.push.apply(params, arguments) < f.length && arguments.length ?
        curry$.call(this, f, params) : f.apply(this, params);
    } : f;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);

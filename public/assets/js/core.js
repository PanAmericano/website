// Sticky Nav http://labs.anthonygarand.com/sticky
(function($) {
  var defaults = {
      topSpacing: 0,
      bottomSpacing: 0,
      className: 'is-sticky',
      wrapperClassName: 'sticky-wrapper'
    },
    $window = $(window),
    $document = $(document),
    sticked = [],
    windowHeight = $window.height(),
    scroller = function() {
      var scrollTop = $window.scrollTop(),
        documentHeight = $document.height(),
        dwh = documentHeight - windowHeight,
        extra = (scrollTop > dwh) ? dwh - scrollTop : 0;
      for (var i = 0; i < sticked.length; i++) {
        var s = sticked[i],
          elementTop = s.stickyWrapper.offset().top,
          etse = elementTop - s.topSpacing - extra;
        if (scrollTop <= etse) {
          if (s.currentTop !== null) {
            s.stickyElement.css('position', '').css('top', '').removeClass(s.className);
            s.stickyElement.parent().removeClass(s.className);
            s.currentTop = null
          }
        } else {
          var newTop = documentHeight - s.stickyElement.outerHeight() - s.topSpacing -
            s.bottomSpacing - scrollTop - extra;
          if (newTop < 0) {
            newTop = newTop + s.topSpacing
          } else {
            newTop = s.topSpacing
          }
          if (s.currentTop != newTop) {
            s.stickyElement.css('position', 'fixed').css('top', newTop).addClass(
              s.className);
            s.stickyElement.parent().addClass(s.className);
            s.currentTop = newTop
          }
        }
      }
    },
    resizer = function() {
      windowHeight = $window.height()
    },
    methods = {
      init: function(options) {
        var o = $.extend(defaults, options);
        return this.each(function() {
          var stickyElement = $(this);
          stickyId = stickyElement.attr('id');
          wrapper = $('<div></div>').attr('id', stickyId +
            '-sticky-wrapper').addClass(o.wrapperClassName);
          stickyElement.wrapAll(wrapper);
          var stickyWrapper = stickyElement.parent();
          stickyWrapper.css('height', stickyElement.outerHeight());
          sticked.push({
            topSpacing: o.topSpacing,
            bottomSpacing: o.bottomSpacing,
            stickyElement: stickyElement,
            currentTop: null,
            stickyWrapper: stickyWrapper,
            className: o.className
          })
        })
      },
      update: scroller
    };
  if (window.addEventListener) {
    window.addEventListener('scroll', scroller, false);
    window.addEventListener('resize', resizer, false)
  } else if (window.attachEvent) {
    window.attachEvent('onscroll', scroller);
    window.attachEvent('onresize', resizer)
  }
  $.fn.sticky = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(
        arguments, 1))
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments)
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sticky')
    }
  };
  $(function() {
    setTimeout(scroller, 0)
  })
})(jQuery);


// Scrolling http://flesler.blogspot.com/2007/10/jqueryscrollto.html
;
(function(d) {
  var k = d.scrollTo = function(a, i, e) {
    d(window).scrollTo(a, i, e)
  };
  k.defaults = {
    axis: 'xy',
    duration: parseFloat(d.fn.jquery) >= 1.3 ? 0 : 1
  };
  k.window = function(a) {
    return d(window)._scrollable()
  };
  d.fn._scrollable = function() {
    return this.map(function() {
      var a = this,
        i = !a.nodeName || d.inArray(a.nodeName.toLowerCase(), [
          'iframe', '#document', 'html', 'body'
        ]) != -1;
      if (!i) return a;
      var e = (a.contentWindow || a).document || a.ownerDocument || a;
      return d.browser.safari || e.compatMode == 'BackCompat' ? e.body :
        e.documentElement
    })
  };
  d.fn.scrollTo = function(n, j, b) {
    if (typeof j == 'object') {
      b = j;
      j = 0
    }
    if (typeof b == 'function') b = {
      onAfter: b
    };
    if (n == 'max') n = 9e9;
    b = d.extend({}, k.defaults, b);
    j = j || b.speed || b.duration;
    b.queue = b.queue && b.axis.length > 1;
    if (b.queue) j /= 2;
    b.offset = p(b.offset);
    b.over = p(b.over);
    return this._scrollable().each(function() {
      var q = this,
        r = d(q),
        f = n,
        s, g = {},
        u = r.is('html,body');
      switch (typeof f) {
        case 'number':
        case 'string':
          if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)) {
            f = p(f);
            break
          }
          f = d(f, this);
        case 'object':
          if (f.is || f.style) s = (f = d(f)).offset()
      }
      d.each(b.axis.split(''), function(a, i) {
        var e = i == 'x' ? 'Left' : 'Top',
          h = e.toLowerCase(),
          c = 'scroll' + e,
          l = q[c],
          m = k.max(q, i);
        if (s) {
          g[c] = s[h] + (u ? 0 : l - r.offset()[h]);
          if (b.margin) {
            g[c] -= parseInt(f.css('margin' + e)) || 0;
            g[c] -= parseInt(f.css('border' + e + 'Width')) || 0
          }
          g[c] += b.offset[h] || 0;
          if (b.over[h]) g[c] += f[i == 'x' ? 'width' : 'height']() *
            b.over[h]
        } else {
          var o = f[h];
          g[c] = o.slice && o.slice(-1) == '%' ? parseFloat(o) /
            100 * m : o
        }
        if (/^\d+$/.test(g[c])) g[c] = g[c] <= 0 ? 0 : Math.min(g[c],
          m);
        if (!a && b.queue) {
          if (l != g[c]) t(b.onAfterFirst);
          delete g[c]
        }
      });
      t(b.onAfter);

      function t(a) {
        r.animate(g, j, b.easing, a && function() {
          a.call(this, n, b)
        })
      }
    }).end()
  };
  k.max = function(a, i) {
    var e = i == 'x' ? 'Width' : 'Height',
      h = 'scroll' + e;
    if (!d(a).is('html,body')) return a[h] - d(a)[e.toLowerCase()]();
    var c = 'client' + e,
      l = a.ownerDocument.documentElement,
      m = a.ownerDocument.body;
    return Math.max(l[h], m[h]) - Math.min(l[c], m[c])
  };

  function p(a) {
    return typeof a == 'object' ? a : {
      top: a,
      left: a
    }
  }
})(jQuery);


// Active Nav Tab http://github.com/davist11/jQuery-One-Page-Nav
(function(a) {
  a.fn.onePageNav = function(b) {
    var c = a.extend({}, a.fn.onePageNav.defaults, b),
      d = {};
    d.sections = {};
    d.bindNav = function(g, k, j, f, h) {
      var i = g.parent(),
        e = g.attr("href"),
        l = a(document);
      if (!i.hasClass(j)) {
        d.adjustNav(k, i, j);
        l.unbind(".onePageNav");
        a.scrollTo(e, h, {
          onAfter: function() {
            if (f) {
              window.location.hash = e
            }
            l.bind("scroll.onePageNav", function() {
              d.scrollChange(k, j)
            })
          }
        })
      }
    };
    d.adjustNav = function(g, e, f) {
      g.find("." + f).removeClass(f);
      e.addClass(f)
    };
    d.getPositions = function(e) {
      e.find("a").each(function() {
        var h = a(this).attr("href"),
          g = a(h).offset(),
          f = g.top;
        d.sections[h.substr(1)] = Math.round(f)
      })
    };
    d.getSection = function(h) {
      var e = "",
        g = Math.round(a(window).height() / 2);
      for (var f in d.sections) {
        if ((d.sections[f] - g) < h) {
          e = f
        }
      }
      return e
    };
    d.scrollChange = function(h, g) {
      d.getPositions(h);
      var f = a(window).scrollTop(),
        e = d.getSection(f);
      if (e !== "") {
        d.adjustNav(h, h.find("a[href=#" + e + "]").parent(), g)
      }
    };
    d.init = function(f, g) {
      f.find("a").bind("click", function(h) {
        d.bindNav(a(this), f, g.currentClass, g.changeHash, g.scrollSpeed);
        h.preventDefault()
      });
      d.getPositions(f);
      var e = false;
      a(document).bind("scroll.onePageNav", function() {
        e = true
      });
      setInterval(function() {
        if (e) {
          e = false;
          d.scrollChange(f, g.currentClass)
        }
      }, 250)
    };
    return this.each(function() {
      var e = a(this),
        f = a.meta ? a.extend({}, c, e.data()) : c;
      d.init(e, f)
    })
  };
  a.fn.onePageNav.defaults = {
    currentClass: "current",
    changeHash: false,
    scrollSpeed: 500
  }
})(jQuery);



// Tweets http://tweet.seaofclouds.com
(function(factory) {
  if (typeof define === 'function' && define.amd) define(['jquery'], factory);
  else factory(jQuery)
}(function($) {
  $.fn.tweet = function(o) {
    var s = $.extend({
      username: "jguzmarketing",
      list: null,
      favorites: false,
      query: null,
      avatar_size: null,
      count: 3,
      fetch: null,
      page: 1,
      retweets: true,
      intro_text: null,
      outro_text: null,
      join_text: null,
      auto_join_text_default: "I said,",
      auto_join_text_ed: "I",
      auto_join_text_ing: "I am",
      auto_join_text_reply: "I replied to",
      auto_join_text_url: "I was looking at",
      loading_text: null,
      refresh_interval: null,
      twitter_url: "twitter.com",
      twitter_api_url: "api.twitter.com",
      twitter_search_url: "search.twitter.com",
      template: "{avatar}{time}{join}{text}",
      comparator: function(tweet1, tweet2) {
        return tweet2["tweet_time"] - tweet1["tweet_time"]
      },
      filter: function(tweet) {
        return true
      }
    }, o);
    var url_regexp =
      /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?Â«Â»â€œâ€â€˜â€™]))/gi;

    function t(template, info) {
      if (typeof template === "string") {
        var result = template;
        for (var key in info) {
          var val = info[key];
          result = result.replace(new RegExp('{' + key + '}', 'g'), val ===
            null ? '' : val)
        }
        return result
      } else return template(info)
    }
    $.extend({
      tweet: {
        t: t
      }
    });

    function replacer(regex, replacement) {
      return function() {
        var returning = [];
        this.each(function() {
          returning.push(this.replace(regex, replacement))
        });
        return $(returning)
      }
    }

    function escapeHTML(s) {
      return s.replace(/</g, "&lt;").replace(/>/g, "^&gt;")
    }
    $.fn.extend({
      linkUser: replacer(/(^|[\W])@(\w+)/gi,
        "$1<span class=\"at\">@</span><a href=\"http://" + s.twitter_url +
        "/$2\">$2</a>"),
      linkHash: replacer(
        /(?:^| )[\#]+([\w\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0600-\u06ff]+)/gi,
        ' <a href="http://' + s.twitter_search_url +
        '/search?q=&tag=$1&lang=all' + ((s.username && s.username.length ==
            1 && !s.list) ? '&from=' + s.username.join("%2BOR%2B") :
          '') + '" class="tweet_hashtag">#$1</a>'),
      makeHeart: replacer(/(&lt;)+[3]/gi,
        "<tt class='heart'>&#x2665;</tt>")
    });

    function linkURLs(text, entities) {
      return text.replace(url_regexp, function(match) {
        var url = (/^[a-z]+:/i).test(match) ? match : "http://" +
          match;
        var text = match;
        for (var i = 0; i < entities.length; ++i) {
          var entity = entities[i];
          if (entity.url == url && entity.expanded_url) {
            url = entity.expanded_url;
            text = entity.display_url;
            break
          }
        }
        return "<a href=\"" + escapeHTML(url) + "\">" + escapeHTML(
          text) + "</a>"
      })
    }

    function parse_date(date_str) {
      return Date.parse(date_str.replace(
        /^([a-z]{3})( [a-z]{3} \d\d?)(.*)( \d{4})$/i, '$1,$2$4$3'))
    }

    function extract_relative_time(date) {
      var toInt = function(val) {
        return parseInt(val, 10)
      };
      var relative_to = new Date();
      var delta = toInt((relative_to.getTime() - date) / 1000);
      if (delta < 1) delta = 0;
      return {
        days: toInt(delta / 86400),
        hours: toInt(delta / 3600),
        minutes: toInt(delta / 60),
        seconds: toInt(delta)
      }
    }

    function format_relative_time(time_ago) {
      if (time_ago.days > 2) return '' + time_ago.days + ' days ago';
      if (time_ago.hours > 24) return 'a day ago';
      if (time_ago.hours > 2) return '' + time_ago.hours + ' hours ago';
      if (time_ago.minutes > 45) return 'an hour ago';
      if (time_ago.minutes > 2) return '' + time_ago.minutes +
        ' minutes ago';
      if (time_ago.seconds > 1) return '' + time_ago.seconds +
        ' seconds ago';
      return 'just now'
    }

    function build_auto_join_text(text) {
      if (text.match(/^(@([A-Za-z0-9-_]+)) .*/i)) {
        return s.auto_join_text_reply
      } else if (text.match(url_regexp)) {
        return s.auto_join_text_url
      } else if (text.match(/^((\w+ed)|just) .*/im)) {
        return s.auto_join_text_ed
      } else if (text.match(/^(\w*ing) .*/i)) {
        return s.auto_join_text_ing
      } else {
        return s.auto_join_text_default
      }
    }

    function build_api_url() {
      var proto = ('https:' == document.location.protocol ? 'https:' :
        'http:');
      var count = (s.fetch === null) ? s.count : s.fetch;
      var common_params = '&include_entities=1&callback=?';
      if (s.list) {
        return proto + "//" + s.twitter_api_url + "/1/" + s.username[0] +
          "/lists/" + s.list + "/statuses.json?page=" + s.page +
          "&per_page=" + count + common_params
      } else if (s.favorites) {
        return proto + "//" + s.twitter_api_url + "/favorites/" + s.username[
            0] + ".json?page=" + s.page + "&count=" + count +
          common_params
      } else if (s.query === null && s.username.length == 1) {
        return proto + '//' + s.twitter_api_url +
          '/1/statuses/user_timeline.json?screen_name=' + s.username[0] +
          '&count=' + count + (s.retweets ? '&include_rts=1' : '') +
          '&page=' + s.page + common_params
      } else {
        var query = (s.query || 'from:' + s.username.join(' OR from:'));
        return proto + '//' + s.twitter_search_url + '/search.json?&q=' +
          encodeURIComponent(query) + '&rpp=' + count + '&page=' + s.page +
          common_params
      }
    }

    function extract_avatar_url(item, secure) {
      if (secure) {
        return ('user' in item) ? item.user.profile_image_url_https :
          extract_avatar_url(item, false).replace(
            /^http:\/\/[a-z0-9]{1,3}\.twimg\.com\//,
            "https://s3.amazonaws.com/twitter_production/")
      } else {
        return item.profile_image_url || item.user.profile_image_url
      }
    }

    function extract_template_data(item) {
      var o = {};
      o.item = item;
      o.source = item.source;
      o.screen_name = item.from_user || item.user.screen_name;
      o.name = item.from_user_name || item.user.name;
      o.avatar_size = s.avatar_size;
      o.avatar_url = extract_avatar_url(item, (document.location.protocol ===
        'https:'));
      o.retweet = typeof(item.retweeted_status) != 'undefined';
      o.tweet_time = parse_date(item.created_at);
      o.join_text = s.join_text == "auto" ? build_auto_join_text(item.text) :
        s.join_text;
      o.tweet_id = item.id_str;
      o.twitter_base = "http://" + s.twitter_url + "/";
      o.user_url = o.twitter_base + o.screen_name;
      o.tweet_url = o.user_url + "/status/" + o.tweet_id;
      o.reply_url = o.twitter_base + "intent/tweet?in_reply_to=" + o.tweet_id;
      o.retweet_url = o.twitter_base + "intent/retweet?tweet_id=" + o.tweet_id;
      o.favorite_url = o.twitter_base + "intent/favorite?tweet_id=" + o.tweet_id;
      o.retweeted_screen_name = o.retweet && item.retweeted_status.user.screen_name;
      o.tweet_relative_time = format_relative_time(extract_relative_time(
        o.tweet_time));
      o.entities = item.entities ? (item.entities.urls || []).concat(item
        .entities.media || []) : [];
      o.tweet_raw_text = o.retweet ? ('RT @' + o.retweeted_screen_name +
        ' ' + item.retweeted_status.text) : item.text;
      o.tweet_text = $([linkURLs(o.tweet_raw_text, o.entities)]).linkUser()
        .linkHash()[0];
      o.tweet_text_fancy = $([o.tweet_text]).makeHeart()[0];
      o.user = t(
        '<a class="tweet_user" href="{user_url}">{screen_name}</a>', o);
      o.join = s.join_text ? t(
        ' <span class="tweet_join">{join_text}</span> ', o) : ' ';
      o.avatar = o.avatar_size ? t(
        '<a class="tweet_avatar" href="{user_url}"><img src="{avatar_url}" height="{avatar_size}" width="{avatar_size}" alt="{screen_name}\'s avatar" title="{screen_name}\'s avatar" border="0"/></a>',
        o) : '';
      o.time = t(
        '<span class="timeago"><a href="{tweet_url}">{tweet_relative_time}</a></span></div>',
        o);
      o.text = t(
        '<div class="follow">Follow me!! <strong><a href="{user_url}">@{screen_name}</a></strong></div> <div class="tweet"><p>{tweet_text_fancy}</p>',
        o);
      o.reply_action = t(
        '<a class="tweet_action tweet_reply" href="{reply_url}">reply</a>',
        o);
      o.retweet_action = t(
        '<a class="tweet_action tweet_retweet" href="{retweet_url}">retweet</a>',
        o);
      o.favorite_action = t(
        '<a class="tweet_action tweet_favorite" href="{favorite_url}">favorite</a>',
        o);
      return o
    }

    function load(widget) {
      var intro = '<p class="tweet_intro">' + s.intro_text + '</p>';
      var outro = '<p class="tweet_outro">' + s.outro_text + '</p>';
      var loading = $('<p class="loading">' + s.loading_text + '</p>');
      if (s.loading_text) $(widget).not(":has(.tweet_list)").empty().append(
        loading);
      $.getJSON(build_api_url(), function(data) {
        var list = $('<ul class="tweet_list">');
        var tweets = $.map(data.results || data,
          extract_template_data);
        tweets = $.grep(tweets, s.filter).sort(s.comparator).slice(0,
          s.count);
        list.append($.map(tweets, function(o) {
            return "<li>" + t(s.template, o) + "</li>"
          }).join('')).children('li:first').addClass('tweet_first').end()
          .children('li:odd').addClass('tweet_even').end().children(
            'li:even').addClass('tweet_odd');
        $(widget).empty().append(list);
        if (s.intro_text) list.before(intro);
        if (s.outro_text) list.after(outro);
        $(widget).trigger("loaded").trigger((tweets.length === 0 ?
          "empty" : "full"));
        if (s.refresh_interval) {
          window.setTimeout(function() {
            $(widget).trigger("tweet:load")
          }, 1000 * s.refresh_interval)
        }
      })
    }
    return this.each(function(i, widget) {
      if (s.username && typeof(s.username) == "string") {
        s.username = [s.username]
      }
      $(widget).unbind("tweet:load").bind("tweet:load", function() {
        load(widget)
      }).trigger("tweet:load")
    })
  }
}));


// Table Sorter http://tablesorter.com/docs/
(function($) {
  $.extend({
    tablesorter: new
    function() {
      var parsers = [],
        widgets = [];
      this.defaults = {
        cssHeader: "header",
        cssAsc: "headerSortUp",
        cssDesc: "headerSortDown",
        cssChildRow: "expand-child",
        sortInitialOrder: "asc",
        sortMultiSortKey: "shiftKey",
        sortForce: null,
        sortAppend: null,
        sortLocaleCompare: true,
        textExtraction: "simple",
        parsers: {},
        widgets: [],
        widgetZebra: {
          css: ["even", "odd"]
        },
        headers: {},
        widthFixed: false,
        cancelSelection: true,
        sortList: [],
        headerList: [],
        dateFormat: "us",
        decimal: '/\.|\,/g',
        onRenderHeader: null,
        selectorHeaders: 'thead th',
        debug: false
      };

      function benchmark(s, d) {
        log(s + "," + (new Date().getTime() - d.getTime()) + "ms");
      }
      this.benchmark = benchmark;

      function log(s) {
        if (typeof console != "undefined" && typeof console.debug !=
          "undefined") {
          console.log(s);
        } else {
          alert(s);
        }
      }

      function buildParserCache(table, $headers) {
        if (table.config.debug) {
          var parsersDebug = "";
        }
        if (table.tBodies.length == 0) return;
        var rows = table.tBodies[0].rows;
        if (rows[0]) {
          var list = [],
            cells = rows[0].cells,
            l = cells.length;
          for (var i = 0; i < l; i++) {
            var p = false;
            if ($.metadata && ($($headers[i]).metadata() && $($headers[i])
                .metadata().sorter)) {
              p = getParserById($($headers[i]).metadata().sorter);
            } else if ((table.config.headers[i] && table.config.headers[i]
                .sorter)) {
              p = getParserById(table.config.headers[i].sorter);
            }
            if (!p) {
              p = detectParserForColumn(table, rows, -1, i);
            }
            if (table.config.debug) {
              parsersDebug += "column:" + i + " parser:" + p.id + "\n";
            }
            list.push(p);
          }
        }
        if (table.config.debug) {
          log(parsersDebug);
        }
        return list;
      };

      function detectParserForColumn(table, rows, rowIndex, cellIndex) {
        var l = parsers.length,
          node = false,
          nodeValue = false,
          keepLooking = true;
        while (nodeValue == '' && keepLooking) {
          rowIndex++;
          if (rows[rowIndex]) {
            node = getNodeFromRowAndCellIndex(rows, rowIndex, cellIndex);
            nodeValue = trimAndGetNodeText(table.config, node);
            if (table.config.debug) {
              log('Checking if value was empty on row:' + rowIndex);
            }
          } else {
            keepLooking = false;
          }
        }
        for (var i = 1; i < l; i++) {
          if (parsers[i].is(nodeValue, table, node)) {
            return parsers[i];
          }
        }
        return parsers[0];
      }

      function getNodeFromRowAndCellIndex(rows, rowIndex, cellIndex) {
        return rows[rowIndex].cells[cellIndex];
      }

      function trimAndGetNodeText(config, node) {
        return $.trim(getElementText(config, node));
      }

      function getParserById(name) {
        var l = parsers.length;
        for (var i = 0; i < l; i++) {
          if (parsers[i].id.toLowerCase() == name.toLowerCase()) {
            return parsers[i];
          }
        }
        return false;
      }

      function buildCache(table) {
        if (table.config.debug) {
          var cacheTime = new Date();
        }
        var totalRows = (table.tBodies[0] && table.tBodies[0].rows.length) ||
          0,
          totalCells = (table.tBodies[0].rows[0] && table.tBodies[0].rows[
            0].cells.length) || 0,
          parsers = table.config.parsers,
          cache = {
            row: [],
            normalized: []
          };
        for (var i = 0; i < totalRows; ++i) {
          var c = $(table.tBodies[0].rows[i]),
            cols = [];
          if (c.hasClass(table.config.cssChildRow)) {
            cache.row[cache.row.length - 1] = cache.row[cache.row.length -
              1].add(c);
            continue;
          }
          cache.row.push(c);
          for (var j = 0; j < totalCells; ++j) {
            cols.push(parsers[j].format(getElementText(table.config, c[0]
              .cells[j]), table, c[0].cells[j]));
          }
          cols.push(cache.normalized.length);
          cache.normalized.push(cols);
          cols = null;
        };
        if (table.config.debug) {
          benchmark("Building cache for " + totalRows + " rows:",
            cacheTime);
        }
        return cache;
      };

      function getElementText(config, node) {
        var text = "";
        if (!node) return "";
        if (!config.supportsTextContent) config.supportsTextContent =
          node.textContent || false;
        if (config.textExtraction == "simple") {
          if (config.supportsTextContent) {
            text = node.textContent;
          } else {
            if (node.childNodes[0] && node.childNodes[0].hasChildNodes()) {
              text = node.childNodes[0].innerHTML;
            } else {
              text = node.innerHTML;
            }
          }
        } else {
          if (typeof(config.textExtraction) == "function") {
            text = config.textExtraction(node);
          } else {
            text = $(node).text();
          }
        }
        return text;
      }

      function appendToTable(table, cache) {
        if (table.config.debug) {
          var appendTime = new Date()
        }
        var c = cache,
          r = c.row,
          n = c.normalized,
          totalRows = n.length,
          checkCell = (n[0].length - 1),
          tableBody = $(table.tBodies[0]),
          rows = [];
        for (var i = 0; i < totalRows; i++) {
          var pos = n[i][checkCell];
          rows.push(r[pos]);
          if (!table.config.appender) {
            var l = r[pos].length;
            for (var j = 0; j < l; j++) {
              tableBody[0].appendChild(r[pos][j]);
            }
          }
        }
        if (table.config.appender) {
          table.config.appender(table, rows);
        }
        rows = null;
        if (table.config.debug) {
          benchmark("Rebuilt table:", appendTime);
        }
        applyWidget(table);
        setTimeout(function() {
          $(table).trigger("sortEnd");
        }, 0);
      };

      function buildHeaders(table) {
        if (table.config.debug) {
          var time = new Date();
        }
        var meta = ($.metadata) ? true : false;
        var header_index = computeTableHeaderCellIndexes(table);
        $tableHeaders = $(table.config.selectorHeaders, table).each(
          function(index) {
            this.column = header_index[this.parentNode.rowIndex + "-" +
              this.cellIndex];
            this.order = formatSortingOrder(table.config.sortInitialOrder);
            this.count = this.order;
            if (checkHeaderMetadata(this) || checkHeaderOptions(table,
                index)) this.sortDisabled = true;
            if (checkHeaderOptionsSortingLocked(table, index)) this.order =
              this.lockedOrder = checkHeaderOptionsSortingLocked(table,
                index);
            if (!this.sortDisabled) {
              var $th = $(this).addClass(table.config.cssHeader);
              if (table.config.onRenderHeader) table.config.onRenderHeader
                .apply($th);
            }
            table.config.headerList[index] = this;
          });
        if (table.config.debug) {
          benchmark("Built headers:", time);
          log($tableHeaders);
        }
        return $tableHeaders;
      };

      function computeTableHeaderCellIndexes(t) {
        var matrix = [];
        var lookup = {};
        var thead = t.getElementsByTagName('THEAD')[0];
        var trs = thead.getElementsByTagName('TR');
        for (var i = 0; i < trs.length; i++) {
          var cells = trs[i].cells;
          for (var j = 0; j < cells.length; j++) {
            var c = cells[j];
            var rowIndex = c.parentNode.rowIndex;
            var cellId = rowIndex + "-" + c.cellIndex;
            var rowSpan = c.rowSpan || 1;
            var colSpan = c.colSpan || 1
            var firstAvailCol;
            if (typeof(matrix[rowIndex]) == "undefined") {
              matrix[rowIndex] = [];
            }
            for (var k = 0; k < matrix[rowIndex].length + 1; k++) {
              if (typeof(matrix[rowIndex][k]) == "undefined") {
                firstAvailCol = k;
                break;
              }
            }
            lookup[cellId] = firstAvailCol;
            for (var k = rowIndex; k < rowIndex + rowSpan; k++) {
              if (typeof(matrix[k]) == "undefined") {
                matrix[k] = [];
              }
              var matrixrow = matrix[k];
              for (var l = firstAvailCol; l < firstAvailCol + colSpan; l++) {
                matrixrow[l] = "x";
              }
            }
          }
        }
        return lookup;
      }

      function checkCellColSpan(table, rows, row) {
        var arr = [],
          r = table.tHead.rows,
          c = r[row].cells;
        for (var i = 0; i < c.length; i++) {
          var cell = c[i];
          if (cell.colSpan > 1) {
            arr = arr.concat(checkCellColSpan(table, headerArr, row++));
          } else {
            if (table.tHead.length == 1 || (cell.rowSpan > 1 || !r[row +
                1])) {
              arr.push(cell);
            }
          }
        }
        return arr;
      };

      function checkHeaderMetadata(cell) {
        if (($.metadata) && ($(cell).metadata().sorter === false)) {
          return true;
        };
        return false;
      }

      function checkHeaderOptions(table, i) {
        if ((table.config.headers[i]) && (table.config.headers[i].sorter ===
            false)) {
          return true;
        };
        return false;
      }

      function checkHeaderOptionsSortingLocked(table, i) {
        if ((table.config.headers[i]) && (table.config.headers[i].lockedOrder))
          return table.config.headers[i].lockedOrder;
        return false;
      }

      function applyWidget(table) {
        var c = table.config.widgets;
        var l = c.length;
        for (var i = 0; i < l; i++) {
          getWidgetById(c[i]).format(table);
        }
      }

      function getWidgetById(name) {
        var l = widgets.length;
        for (var i = 0; i < l; i++) {
          if (widgets[i].id.toLowerCase() == name.toLowerCase()) {
            return widgets[i];
          }
        }
      };

      function formatSortingOrder(v) {
        if (typeof(v) != "Number") {
          return (v.toLowerCase() == "desc") ? 1 : 0;
        } else {
          return (v == 1) ? 1 : 0;
        }
      }

      function isValueInArray(v, a) {
        var l = a.length;
        for (var i = 0; i < l; i++) {
          if (a[i][0] == v) {
            return true;
          }
        }
        return false;
      }

      function setHeadersCss(table, $headers, list, css) {
        $headers.removeClass(css[0]).removeClass(css[1]);
        var h = [];
        $headers.each(function(offset) {
          if (!this.sortDisabled) {
            h[this.column] = $(this);
          }
        });
        var l = list.length;
        for (var i = 0; i < l; i++) {
          h[list[i][0]].addClass(css[list[i][1]]);
        }
      }

      function fixColumnWidth(table, $headers) {
        var c = table.config;
        if (c.widthFixed) {
          var colgroup = $('<colgroup>');
          $("tr:first td", table.tBodies[0]).each(function() {
            colgroup.append($('<col>').css('width', $(this).width()));
          });
          $(table).prepend(colgroup);
        };
      }

      function updateHeaderSortCount(table, sortList) {
        var c = table.config,
          l = sortList.length;
        for (var i = 0; i < l; i++) {
          var s = sortList[i],
            o = c.headerList[s[0]];
          o.count = s[1];
          o.count++;
        }
      }

      function multisort(table, sortList, cache) {
        if (table.config.debug) {
          var sortTime = new Date();
        }
        var dynamicExp = "var sortWrapper = function(a,b) {",
          l = sortList.length;
        for (var i = 0; i < l; i++) {
          var c = sortList[i][0];
          var order = sortList[i][1];
          var s = (table.config.parsers[c].type == "text") ? ((order == 0) ?
            makeSortFunction("text", "asc", c) : makeSortFunction(
              "text", "desc", c)) : ((order == 0) ? makeSortFunction(
            "numeric", "asc", c) : makeSortFunction("numeric", "desc",
            c));
          var e = "e" + i;
          dynamicExp += "var " + e + " = " + s;
          dynamicExp += "if(" + e + ") { return " + e + "; } ";
          dynamicExp += "else { ";
        }
        var orgOrderCol = cache.normalized[0].length - 1;
        dynamicExp += "return a[" + orgOrderCol + "]-b[" + orgOrderCol +
          "];";
        for (var i = 0; i < l; i++) {
          dynamicExp += "}; ";
        }
        dynamicExp += "return 0; ";
        dynamicExp += "}; ";
        if (table.config.debug) {
          benchmark("Evaling expression:" + dynamicExp, new Date());
        }
        eval(dynamicExp);
        cache.normalized.sort(sortWrapper);
        if (table.config.debug) {
          benchmark("Sorting on " + sortList.toString() + " and dir " +
            order + " time:", sortTime);
        }
        return cache;
      };

      function makeSortFunction(type, direction, index) {
        var a = "a[" + index + "]",
          b = "b[" + index + "]";
        if (type == 'text' && direction == 'asc') {
          return "(" + a + " == " + b + " ? 0 : (" + a +
            " === null ? Number.POSITIVE_INFINITY : (" + b +
            " === null ? Number.NEGATIVE_INFINITY : (" + a + " < " + b +
            ") ? -1 : 1 )));";
        } else if (type == 'text' && direction == 'desc') {
          return "(" + a + " == " + b + " ? 0 : (" + a +
            " === null ? Number.POSITIVE_INFINITY : (" + b +
            " === null ? Number.NEGATIVE_INFINITY : (" + b + " < " + a +
            ") ? -1 : 1 )));";
        } else if (type == 'numeric' && direction == 'asc') {
          return "(" + a + " === null && " + b + " === null) ? 0 :(" + a +
            " === null ? Number.POSITIVE_INFINITY : (" + b +
            " === null ? Number.NEGATIVE_INFINITY : " + a + " - " + b +
            "));";
        } else if (type == 'numeric' && direction == 'desc') {
          return "(" + a + " === null && " + b + " === null) ? 0 :(" + a +
            " === null ? Number.POSITIVE_INFINITY : (" + b +
            " === null ? Number.NEGATIVE_INFINITY : " + b + " - " + a +
            "));";
        }
      };

      function makeSortText(i) {
        return "((a[" + i + "] < b[" + i + "]) ? -1 : ((a[" + i +
          "] > b[" + i + "]) ? 1 : 0));";
      };

      function makeSortTextDesc(i) {
        return "((b[" + i + "] < a[" + i + "]) ? -1 : ((b[" + i +
          "] > a[" + i + "]) ? 1 : 0));";
      };

      function makeSortNumeric(i) {
        return "a[" + i + "]-b[" + i + "];";
      };

      function makeSortNumericDesc(i) {
        return "b[" + i + "]-a[" + i + "];";
      };

      function sortText(a, b) {
        if (table.config.sortLocaleCompare) return a.localeCompare(b);
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
      };

      function sortTextDesc(a, b) {
        if (table.config.sortLocaleCompare) return b.localeCompare(a);
        return ((b < a) ? -1 : ((b > a) ? 1 : 0));
      };

      function sortNumeric(a, b) {
        return a - b;
      };

      function sortNumericDesc(a, b) {
        return b - a;
      };

      function getCachedSortType(parsers, i) {
        return parsers[i].type;
      };
      this.construct = function(settings) {
        return this.each(function() {
          if (!this.tHead || !this.tBodies) return;
          var $this, $document, $headers, cache, config, shiftDown =
            0,
            sortOrder;
          this.config = {};
          config = $.extend(this.config, $.tablesorter.defaults,
            settings);
          $this = $(this);
          $.data(this, "tablesorter", config);
          $headers = buildHeaders(this);
          this.config.parsers = buildParserCache(this, $headers);
          cache = buildCache(this);
          var sortCSS = [config.cssDesc, config.cssAsc];
          fixColumnWidth(this);
          $headers.click(function(e) {
            var totalRows = ($this[0].tBodies[0] && $this[0].tBodies[
              0].rows.length) || 0;
            if (!this.sortDisabled && totalRows > 0) {
              $this.trigger("sortStart");
              var $cell = $(this);
              var i = this.column;
              this.order = this.count++ % 2;
              if (this.lockedOrder) this.order = this.lockedOrder;
              if (!e[config.sortMultiSortKey]) {
                config.sortList = [];
                if (config.sortForce != null) {
                  var a = config.sortForce;
                  for (var j = 0; j < a.length; j++) {
                    if (a[j][0] != i) {
                      config.sortList.push(a[j]);
                    }
                  }
                }
                config.sortList.push([i, this.order]);
              } else {
                if (isValueInArray(i, config.sortList)) {
                  for (var j = 0; j < config.sortList.length; j++) {
                    var s = config.sortList[j],
                      o = config.headerList[s[0]];
                    if (s[0] == i) {
                      o.count = s[1];
                      o.count++;
                      s[1] = o.count % 2;
                    }
                  }
                } else {
                  config.sortList.push([i, this.order]);
                }
              };
              setTimeout(function() {
                setHeadersCss($this[0], $headers, config.sortList,
                  sortCSS);
                appendToTable($this[0], multisort($this[0],
                  config.sortList, cache));
              }, 1);
              return false;
            }
          }).mousedown(function() {
            if (config.cancelSelection) {
              this.onselectstart = function() {
                return false
              };
              return false;
            }
          });
          $this.bind("update", function() {
            var me = this;
            setTimeout(function() {
              me.config.parsers = buildParserCache(me,
                $headers);
              cache = buildCache(me);
            }, 1);
          }).bind("updateCell", function(e, cell) {
            var config = this.config;
            var pos = [(cell.parentNode.rowIndex - 1), cell.cellIndex];
            cache.normalized[pos[0]][pos[1]] = config.parsers[
              pos[1]].format(getElementText(config, cell),
              cell);
          }).bind("sorton", function(e, list) {
            $(this).trigger("sortStart");
            config.sortList = list;
            var sortList = config.sortList;
            updateHeaderSortCount(this, sortList);
            setHeadersCss(this, $headers, sortList, sortCSS);
            appendToTable(this, multisort(this, sortList, cache));
          }).bind("appendCache", function() {
            appendToTable(this, cache);
          }).bind("applyWidgetId", function(e, id) {
            getWidgetById(id).format(this);
          }).bind("applyWidgets", function() {
            applyWidget(this);
          });
          if ($.metadata && ($(this).metadata() && $(this).metadata()
              .sortlist)) {
            config.sortList = $(this).metadata().sortlist;
          }
          if (config.sortList.length > 0) {
            $this.trigger("sorton", [config.sortList]);
          }
          applyWidget(this);
        });
      };
      this.addParser = function(parser) {
        var l = parsers.length,
          a = true;
        for (var i = 0; i < l; i++) {
          if (parsers[i].id.toLowerCase() == parser.id.toLowerCase()) {
            a = false;
          }
        }
        if (a) {
          parsers.push(parser);
        };
      };
      this.addWidget = function(widget) {
        widgets.push(widget);
      };
      this.formatFloat = function(s) {
        var i = parseFloat(s);
        return (isNaN(i)) ? 0 : i;
      };
      this.formatInt = function(s) {
        var i = parseInt(s);
        return (isNaN(i)) ? 0 : i;
      };
      this.isDigit = function(s, config) {
        return /^[-+]?\d*$/.test($.trim(s.replace(/[,.']/g, '')));
      };
      this.clearTableBody = function(table) {
        if ($.browser.msie) {
          function empty() {
            while (this.firstChild) this.removeChild(this.firstChild);
          }
          empty.apply(table.tBodies[0]);
        } else {
          table.tBodies[0].innerHTML = "";
        }
      };
    }
  });
  $.fn.extend({
    tablesorter: $.tablesorter.construct
  });
  var ts = $.tablesorter;
  ts.addParser({
    id: "text",
    is: function(s) {
      return true;
    },
    format: function(s) {
      return $.trim(s.toLocaleLowerCase());
    },
    type: "text"
  });
  ts.addParser({
    id: "digit",
    is: function(s, table) {
      var c = table.config;
      return $.tablesorter.isDigit(s, c);
    },
    format: function(s) {
      return $.tablesorter.formatFloat(s);
    },
    type: "numeric"
  });
  ts.addParser({
    id: "currency",
    is: function(s) {
      return /^[Â£$â‚¬?.]/.test(s);
    },
    format: function(s) {
      return $.tablesorter.formatFloat(s.replace(new RegExp(/[Â£$â‚¬]/g),
        ""));
    },
    type: "numeric"
  });
  ts.addParser({
    id: "ipAddress",
    is: function(s) {
      return /^\d{2,3}[\.]\d{2,3}[\.]\d{2,3}[\.]\d{2,3}$/.test(s);
    },
    format: function(s) {
      var a = s.split("."),
        r = "",
        l = a.length;
      for (var i = 0; i < l; i++) {
        var item = a[i];
        if (item.length == 2) {
          r += "0" + item;
        } else {
          r += item;
        }
      }
      return $.tablesorter.formatFloat(r);
    },
    type: "numeric"
  });
  ts.addParser({
    id: "url",
    is: function(s) {
      return /^(https?|ftp|file):\/\/$/.test(s);
    },
    format: function(s) {
      return jQuery.trim(s.replace(new RegExp(/(https?|ftp|file):\/\//),
        ''));
    },
    type: "text"
  });
  ts.addParser({
    id: "isoDate",
    is: function(s) {
      return /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(s);
    },
    format: function(s) {
      return $.tablesorter.formatFloat((s != "") ? new Date(s.replace(
        new RegExp(/-/g), "/")).getTime() : "0");
    },
    type: "numeric"
  });
  ts.addParser({
    id: "percent",
    is: function(s) {
      return /\%$/.test($.trim(s));
    },
    format: function(s) {
      return $.tablesorter.formatFloat(s.replace(new RegExp(/%/g), ""));
    },
    type: "numeric"
  });
  ts.addParser({
    id: "usLongDate",
    is: function(s) {
      return s.match(new RegExp(
        /^[A-Za-z]{3,10}\.? [0-9]{1,2}, ([0-9]{4}|'?[0-9]{2}) (([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(AM|PM)))$/
      ));
    },
    format: function(s) {
      return $.tablesorter.formatFloat(new Date(s).getTime());
    },
    type: "numeric"
  });
  ts.addParser({
    id: "shortDate",
    is: function(s) {
      return /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(s);
    },
    format: function(s, table) {
      var c = table.config;
      s = s.replace(/\-/g, "/");
      if (c.dateFormat == "us") {
        s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
          "$3/$1/$2");
      } else if (c.dateFormat == "uk") {
        s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
          "$3/$2/$1");
      } else if (c.dateFormat == "dd/mm/yy" || c.dateFormat ==
        "dd-mm-yy") {
        s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/,
          "$1/$2/$3");
      }
      return $.tablesorter.formatFloat(new Date(s).getTime());
    },
    type: "numeric"
  });
  ts.addParser({
    id: "time",
    is: function(s) {
      return
        /^(([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(am|pm)))$/
        .test(s);
    },
    format: function(s) {
      return $.tablesorter.formatFloat(new Date("2000/01/01 " + s).getTime());
    },
    type: "numeric"
  });
  ts.addParser({
    id: "metadata",
    is: function(s) {
      return false;
    },
    format: function(s, table, cell) {
      var c = table.config,
        p = (!c.parserMetadataName) ? 'sortValue' : c.parserMetadataName;
      return $(cell).metadata()[p];
    },
    type: "numeric"
  });
  ts.addWidget({
    id: "zebra",
    format: function(table) {
      if (table.config.debug) {
        var time = new Date();
      }
      var $tr, row = -1,
        odd;
      $("tr:visible", table.tBodies[0]).each(function(i) {
        $tr = $(this);
        if (!$tr.hasClass(table.config.cssChildRow)) row++;
        odd = (row % 2 == 0);
        $tr.removeClass(table.config.widgetZebra.css[odd ? 0 : 1]).addClass(
          table.config.widgetZebra.css[odd ? 1 : 0])
      });
      if (table.config.debug) {
        $.tablesorter.benchmark("Applying Zebra widget", time);
      }
    }
  });
})(jQuery);


// Isotope http://isotope.metafizzy.com
(function(a, b, c) {
  "use strict";
  var d = a.document,
    e = a.Modernizr,
    f = function(a) {
      return a.charAt(0).toUpperCase() + a.slice(1)
    },
    g = "Moz Webkit O Ms".split(" "),
    h = function(a) {
      var b = d.documentElement.style,
        c;
      if (typeof b[a] == "string") return a;
      a = f(a);
      for (var e = 0, h = g.length; e < h; e++) {
        c = g[e] + a;
        if (typeof b[c] == "string") return c
      }
    },
    i = h("transform"),
    j = h("transitionProperty"),
    k = {
      csstransforms: function() {
        return !!i
      },
      csstransforms3d: function() {
        var a = !!h("perspective");
        if (a) {
          var c = " -o- -moz- -ms- -webkit- -khtml- ".split(" "),
            d = "@media (" + c.join("transform-3d),(") + "modernizr)",
            e = b("<style>" + d + "{#modernizr{height:3px}}" + "</style>").appendTo(
              "head"),
            f = b('<div id="modernizr" />').appendTo("html");
          a = f.height() === 3, f.remove(), e.remove()
        }
        return a
      },
      csstransitions: function() {
        return !!j
      }
    },
    l;
  if (e)
    for (l in k) e.hasOwnProperty(l) || e.addTest(l, k[l]);
  else {
    e = a.Modernizr = {
      _version: "1.6ish: miniModernizr for Isotope"
    };
    var m = " ",
      n;
    for (l in k) n = k[l](), e[l] = n, m += " " + (n ? "" : "no-") + l;
    b("html").addClass(m)
  }
  if (e.csstransforms) {
    var o = e.csstransforms3d ? {
        translate: function(a) {
          return "translate3d(" + a[0] + "px, " + a[1] + "px, 0) "
        },
        scale: function(a) {
          return "scale3d(" + a + ", " + a + ", 1) "
        }
      } : {
        translate: function(a) {
          return "translate(" + a[0] + "px, " + a[1] + "px) "
        },
        scale: function(a) {
          return "scale(" + a + ") "
        }
      },
      p = function(a, c, d) {
        var e = b.data(a, "isoTransform") || {},
          f = {},
          g, h = {},
          j;
        f[c] = d, b.extend(e, f);
        for (g in e) j = e[g], h[g] = o[g](j);
        var k = h.translate || "",
          l = h.scale || "",
          m = k + l;
        b.data(a, "isoTransform", e), a.style[i] = m
      };
    b.cssNumber.scale = !0, b.cssHooks.scale = {
      set: function(a, b) {
        p(a, "scale", b)
      },
      get: function(a, c) {
        var d = b.data(a, "isoTransform");
        return d && d.scale ? d.scale : 1
      }
    }, b.fx.step.scale = function(a) {
      b.cssHooks.scale.set(a.elem, a.now + a.unit)
    }, b.cssNumber.translate = !0, b.cssHooks.translate = {
      set: function(a, b) {
        p(a, "translate", b)
      },
      get: function(a, c) {
        var d = b.data(a, "isoTransform");
        return d && d.translate ? d.translate : [0, 0]
      }
    }
  }
  var q, r;
  e.csstransitions && (q = {
    WebkitTransitionProperty: "webkitTransitionEnd",
    MozTransitionProperty: "transitionend",
    OTransitionProperty: "oTransitionEnd otransitionend",
    transitionProperty: "transitionend"
  }[j], r = h("transitionDuration"));
  var s = b.event,
    t;
  s.special.smartresize = {
    setup: function() {
      b(this).bind("resize", s.special.smartresize.handler)
    },
    teardown: function() {
      b(this).unbind("resize", s.special.smartresize.handler)
    },
    handler: function(a, b) {
      var c = this,
        d = arguments;
      a.type = "smartresize", t && clearTimeout(t), t = setTimeout(
        function() {
          jQuery.event.handle.apply(c, d)
        }, b === "execAsap" ? 0 : 100)
    }
  }, b.fn.smartresize = function(a) {
    return a ? this.bind("smartresize", a) : this.trigger("smartresize", [
      "execAsap"
    ])
  }, b.Isotope = function(a, c, d) {
    this.element = b(c), this._create(a), this._init(d)
  };
  var u = ["width", "height"],
    v = b(a);
  b.Isotope.settings = {
    resizable: !0,
    layoutMode: "masonry",
    containerClass: "isotope",
    itemClass: "isotope-item",
    hiddenClass: "isotope-hidden",
    hiddenStyle: {
      opacity: 0,
      scale: .001
    },
    visibleStyle: {
      opacity: 1,
      scale: 1
    },
    containerStyle: {
      position: "relative",
      overflow: "hidden"
    },
    animationEngine: "best-available",
    animationOptions: {
      queue: !1,
      duration: 800
    },
    sortBy: "original-order",
    sortAscending: !0,
    resizesContainer: !0,
    transformsEnabled: !0,
    itemPositionDataEnabled: !1
  }, b.Isotope.prototype = {
    _create: function(a) {
      this.options = b.extend({}, b.Isotope.settings, a), this.styleQueue = [],
        this.elemCount = 0;
      var c = this.element[0].style;
      this.originalStyle = {};
      var d = u.slice(0);
      for (var e in this.options.containerStyle) d.push(e);
      for (var f = 0, g = d.length; f < g; f++) e = d[f], this.originalStyle[
        e] = c[e] || "";
      this.element.css(this.options.containerStyle), this._updateAnimationEngine(),
        this._updateUsingTransforms();
      var h = {
        "original-order": function(a, b) {
          return b.elemCount++, b.elemCount
        },
        random: function() {
          return Math.random()
        }
      };
      this.options.getSortData = b.extend(this.options.getSortData, h),
        this.reloadItems(), this.offset = {
          left: parseInt(this.element.css("padding-left") || 0, 10),
          top: parseInt(this.element.css("padding-top") || 0, 10)
        };
      var i = this;
      setTimeout(function() {
        i.element.addClass(i.options.containerClass)
      }, 0), this.options.resizable && v.bind("smartresize.isotope",
        function() {
          i.resize()
        }), this.element.delegate("." + this.options.hiddenClass,
        "click",
        function() {
          return !1
        })
    },
    _getAtoms: function(a) {
      var b = this.options.itemSelector,
        c = b ? a.filter(b).add(a.find(b)) : a,
        d = {
          position: "absolute"
        };
      return this.usingTransforms && (d.left = 0, d.top = 0), c.css(d).addClass(
        this.options.itemClass), this.updateSortData(c, !0), c
    },
    _init: function(a) {
      this.$filteredAtoms = this._filter(this.$allAtoms), this._sort(),
        this.reLayout(a)
    },
    option: function(a) {
      if (b.isPlainObject(a)) {
        this.options = b.extend(!0, this.options, a);
        var c;
        for (var d in a) c = "_update" + f(d), this[c] && this[c]()
      }
    },
    _updateAnimationEngine: function() {
      var a = this.options.animationEngine.toLowerCase().replace(
          /[ _\-]/g, ""),
        b;
      switch (a) {
        case "css":
        case "none":
          b = !1;
          break;
        case "jquery":
          b = !0;
          break;
        default:
          b = !e.csstransitions
      }
      this.isUsingJQueryAnimation = b, this._updateUsingTransforms()
    },
    _updateTransformsEnabled: function() {
      this._updateUsingTransforms()
    },
    _updateUsingTransforms: function() {
      var a = this.usingTransforms = this.options.transformsEnabled && e.csstransforms &&
        e.csstransitions && !this.isUsingJQueryAnimation;
      a || (delete this.options.hiddenStyle.scale, delete this.options.visibleStyle
        .scale), this.getPositionStyles = a ? this._translate : this._positionAbs
    },
    _filter: function(a) {
      var b = this.options.filter === "" ? "*" : this.options.filter;
      if (!b) return a;
      var c = this.options.hiddenClass,
        d = "." + c,
        e = a.filter(d),
        f = e;
      if (b !== "*") {
        f = e.filter(b);
        var g = a.not(d).not(b).addClass(c);
        this.styleQueue.push({
          $el: g,
          style: this.options.hiddenStyle
        })
      }
      return this.styleQueue.push({
        $el: f,
        style: this.options.visibleStyle
      }), f.removeClass(c), a.filter(b)
    },
    updateSortData: function(a, c) {
      var d = this,
        e = this.options.getSortData,
        f, g;
      a.each(function() {
        f = b(this), g = {};
        for (var a in e) !c && a === "original-order" ? g[a] = b.data(
          this, "isotope-sort-data")[a] : g[a] = e[a](f, d);
        b.data(this, "isotope-sort-data", g)
      })
    },
    _sort: function() {
      var a = this.options.sortBy,
        b = this._getSorter,
        c = this.options.sortAscending ? 1 : -1,
        d = function(d, e) {
          var f = b(d, a),
            g = b(e, a);
          return f === g && a !== "original-order" && (f = b(d,
            "original-order"), g = b(e, "original-order")), (f > g ? 1 :
            f < g ? -1 : 0) * c
        };
      this.$filteredAtoms.sort(d)
    },
    _getSorter: function(a, c) {
      return b.data(a, "isotope-sort-data")[c]
    },
    _translate: function(a, b) {
      return {
        translate: [a, b]
      }
    },
    _positionAbs: function(a, b) {
      return {
        left: a,
        top: b
      }
    },
    _pushPosition: function(a, b, c) {
      b = Math.round(b + this.offset.left), c = Math.round(c + this.offset
        .top);
      var d = this.getPositionStyles(b, c);
      this.styleQueue.push({
        $el: a,
        style: d
      }), this.options.itemPositionDataEnabled && a.data(
        "isotope-item-position", {
          x: b,
          y: c
        })
    },
    layout: function(a, b) {
      var c = this.options.layoutMode;
      this["_" + c + "Layout"](a);
      if (this.options.resizesContainer) {
        var d = this["_" + c + "GetContainerSize"]();
        this.styleQueue.push({
          $el: this.element,
          style: d
        })
      }
      this._processStyleQueue(a, b), this.isLaidOut = !0
    },
    _processStyleQueue: function(a, c) {
      var d = this.isLaidOut ? this.isUsingJQueryAnimation ? "animate" :
        "css" : "css",
        f = this.options.animationOptions,
        g = this.options.onLayout,
        h, i, j, k;
      i = function(a, b) {
        b.$el[d](b.style, f)
      };
      if (this._isInserting && this.isUsingJQueryAnimation) i = function(
        a, b) {
        h = b.$el.hasClass("no-transition") ? "css" : d, b.$el[h](b.style,
          f)
      };
      else if (c || g || f.complete) {
        var l = !1,
          m = [c, g, f.complete],
          n = this;
        j = !0, k = function() {
          if (l) return;
          var b;
          for (var c = 0, d = m.length; c < d; c++) b = m[c], typeof b ==
            "function" && b.call(n.element, a, n);
          l = !0
        };
        if (this.isUsingJQueryAnimation && d === "animate") f.complete =
          k, j = !1;
        else if (e.csstransitions) {
          var o = 0,
            p = this.styleQueue[0],
            s = p && p.$el,
            t;
          while (!s || !s.length) {
            t = this.styleQueue[o++];
            if (!t) return;
            s = t.$el
          }
          var u = parseFloat(getComputedStyle(s[0])[r]);
          u > 0 && (i = function(a, b) {
            b.$el[d](b.style, f).one(q, k)
          }, j = !1)
        }
      }
      b.each(this.styleQueue, i), j && k(), this.styleQueue = []
    },
    resize: function() {
      this["_" + this.options.layoutMode + "ResizeChanged"]() && this.reLayout()
    },
    reLayout: function(a) {
      this["_" + this.options.layoutMode + "Reset"](), this.layout(this.$filteredAtoms,
        a)
    },
    addItems: function(a, b) {
      var c = this._getAtoms(a);
      this.$allAtoms = this.$allAtoms.add(c), b && b(c)
    },
    insert: function(a, b) {
      this.element.append(a);
      var c = this;
      this.addItems(a, function(a) {
        var d = c._filter(a);
        c._addHideAppended(d), c._sort(), c.reLayout(), c._revealAppended(
          d, b)
      })
    },
    appended: function(a, b) {
      var c = this;
      this.addItems(a, function(a) {
        c._addHideAppended(a), c.layout(a), c._revealAppended(a, b)
      })
    },
    _addHideAppended: function(a) {
      this.$filteredAtoms = this.$filteredAtoms.add(a), a.addClass(
        "no-transition"), this._isInserting = !0, this.styleQueue.push({
        $el: a,
        style: this.options.hiddenStyle
      })
    },
    _revealAppended: function(a, b) {
      var c = this;
      setTimeout(function() {
        a.removeClass("no-transition"), c.styleQueue.push({
          $el: a,
          style: c.options.visibleStyle
        }), c._isInserting = !1, c._processStyleQueue(a, b)
      }, 10)
    },
    reloadItems: function() {
      this.$allAtoms = this._getAtoms(this.element.children())
    },
    remove: function(a, b) {
      this.$allAtoms = this.$allAtoms.not(a), this.$filteredAtoms = this.$filteredAtoms
        .not(a);
      var c = this,
        d = function() {
          a.remove(), b && b.call(c.element)
        };
      a.filter(":not(." + this.options.hiddenClass + ")").length ? (this.styleQueue
        .push({
          $el: a,
          style: this.options.hiddenStyle
        }), this._sort(), this.reLayout(d)) : d()
    },
    shuffle: function(a) {
      this.updateSortData(this.$allAtoms), this.options.sortBy = "random",
        this._sort(), this.reLayout(a)
    },
    destroy: function() {
      var a = this.usingTransforms,
        b = this.options;
      this.$allAtoms.removeClass(b.hiddenClass + " " + b.itemClass).each(
        function() {
          var b = this.style;
          b.position = "", b.top = "", b.left = "", b.opacity = "", a &&
            (b[i] = "")
        });
      var c = this.element[0].style;
      for (var d in this.originalStyle) c[d] = this.originalStyle[d];
      this.element.unbind(".isotope").undelegate("." + b.hiddenClass,
          "click").removeClass(b.containerClass).removeData("isotope"), v
        .unbind(".isotope")
    },
    _getSegments: function(a) {
      var b = this.options.layoutMode,
        c = a ? "rowHeight" : "columnWidth",
        d = a ? "height" : "width",
        e = a ? "rows" : "cols",
        g = this.element[d](),
        h, i = this.options[b] && this.options[b][c] || this.$filteredAtoms[
          "outer" + f(d)](!0) || g;
      h = Math.floor(g / i), h = Math.max(h, 1), this[b][e] = h, this[b][
        c
      ] = i
    },
    _checkIfSegmentsChanged: function(a) {
      var b = this.options.layoutMode,
        c = a ? "rows" : "cols",
        d = this[b][c];
      return this._getSegments(a), this[b][c] !== d
    },
    _masonryReset: function() {
      this.masonry = {}, this._getSegments();
      var a = this.masonry.cols;
      this.masonry.colYs = [];
      while (a--) this.masonry.colYs.push(0)
    },
    _masonryLayout: function(a) {
      var c = this,
        d = c.masonry;
      a.each(function() {
        var a = b(this),
          e = Math.ceil(a.outerWidth(!0) / d.columnWidth);
        e = Math.min(e, d.cols);
        if (e === 1) c._masonryPlaceBrick(a, d.colYs);
        else {
          var f = d.cols + 1 - e,
            g = [],
            h, i;
          for (i = 0; i < f; i++) h = d.colYs.slice(i, i + e), g[i] =
            Math.max.apply(Math, h);
          c._masonryPlaceBrick(a, g)
        }
      })
    },
    _masonryPlaceBrick: function(a, b) {
      var c = Math.min.apply(Math, b),
        d = 0;
      for (var e = 0, f = b.length; e < f; e++)
        if (b[e] === c) {
          d = e;
          break
        }
      var g = this.masonry.columnWidth * d,
        h = c;
      this._pushPosition(a, g, h);
      var i = c + a.outerHeight(!0),
        j = this.masonry.cols + 1 - f;
      for (e = 0; e < j; e++) this.masonry.colYs[d + e] = i
    },
    _masonryGetContainerSize: function() {
      var a = Math.max.apply(Math, this.masonry.colYs);
      return {
        height: a
      }
    },
    _masonryResizeChanged: function() {
      return this._checkIfSegmentsChanged()
    },
    _fitRowsReset: function() {
      this.fitRows = {
        x: 0,
        y: 0,
        height: 0
      }
    },
    _fitRowsLayout: function(a) {
      var c = this,
        d = this.element.width(),
        e = this.fitRows;
      a.each(function() {
        var a = b(this),
          f = a.outerWidth(!0),
          g = a.outerHeight(!0);
        e.x !== 0 && f + e.x > d && (e.x = 0, e.y = e.height), c._pushPosition(
            a, e.x, e.y), e.height = Math.max(e.y + g, e.height), e.x +=
          f
      })
    },
    _fitRowsGetContainerSize: function() {
      return {
        height: this.fitRows.height
      }
    },
    _fitRowsResizeChanged: function() {
      return !0
    },
    _cellsByRowReset: function() {
      this.cellsByRow = {
        index: 0
      }, this._getSegments(), this._getSegments(!0)
    },
    _cellsByRowLayout: function(a) {
      var c = this,
        d = this.cellsByRow;
      a.each(function() {
        var a = b(this),
          e = d.index % d.cols,
          f = Math.floor(d.index / d.cols),
          g = (e + .5) * d.columnWidth - a.outerWidth(!0) / 2,
          h = (f + .5) * d.rowHeight - a.outerHeight(!0) / 2;
        c._pushPosition(a, g, h), d.index++
      })
    },
    _cellsByRowGetContainerSize: function() {
      return {
        height: Math.ceil(this.$filteredAtoms.length / this.cellsByRow.cols) *
          this.cellsByRow.rowHeight + this.offset.top
      }
    },
    _cellsByRowResizeChanged: function() {
      return this._checkIfSegmentsChanged()
    },
    _straightDownReset: function() {
      this.straightDown = {
        y: 0
      }
    },
    _straightDownLayout: function(a) {
      var c = this;
      a.each(function(a) {
        var d = b(this);
        c._pushPosition(d, 0, c.straightDown.y), c.straightDown.y +=
          d.outerHeight(!0)
      })
    },
    _straightDownGetContainerSize: function() {
      return {
        height: this.straightDown.y
      }
    },
    _straightDownResizeChanged: function() {
      return !0
    },
    _masonryHorizontalReset: function() {
      this.masonryHorizontal = {}, this._getSegments(!0);
      var a = this.masonryHorizontal.rows;
      this.masonryHorizontal.rowXs = [];
      while (a--) this.masonryHorizontal.rowXs.push(0)
    },
    _masonryHorizontalLayout: function(a) {
      var c = this,
        d = c.masonryHorizontal;
      a.each(function() {
        var a = b(this),
          e = Math.ceil(a.outerHeight(!0) / d.rowHeight);
        e = Math.min(e, d.rows);
        if (e === 1) c._masonryHorizontalPlaceBrick(a, d.rowXs);
        else {
          var f = d.rows + 1 - e,
            g = [],
            h, i;
          for (i = 0; i < f; i++) h = d.rowXs.slice(i, i + e), g[i] =
            Math.max.apply(Math, h);
          c._masonryHorizontalPlaceBrick(a, g)
        }
      })
    },
    _masonryHorizontalPlaceBrick: function(a, b) {
      var c = Math.min.apply(Math, b),
        d = 0;
      for (var e = 0, f = b.length; e < f; e++)
        if (b[e] === c) {
          d = e;
          break
        }
      var g = c,
        h = this.masonryHorizontal.rowHeight * d;
      this._pushPosition(a, g, h);
      var i = c + a.outerWidth(!0),
        j = this.masonryHorizontal.rows + 1 - f;
      for (e = 0; e < j; e++) this.masonryHorizontal.rowXs[d + e] = i
    },
    _masonryHorizontalGetContainerSize: function() {
      var a = Math.max.apply(Math, this.masonryHorizontal.rowXs);
      return {
        width: a
      }
    },
    _masonryHorizontalResizeChanged: function() {
      return this._checkIfSegmentsChanged(!0)
    },
    _fitColumnsReset: function() {
      this.fitColumns = {
        x: 0,
        y: 0,
        width: 0
      }
    },
    _fitColumnsLayout: function(a) {
      var c = this,
        d = this.element.height(),
        e = this.fitColumns;
      a.each(function() {
        var a = b(this),
          f = a.outerWidth(!0),
          g = a.outerHeight(!0);
        e.y !== 0 && g + e.y > d && (e.x = e.width, e.y = 0), c._pushPosition(
            a, e.x, e.y), e.width = Math.max(e.x + f, e.width), e.y +=
          g
      })
    },
    _fitColumnsGetContainerSize: function() {
      return {
        width: this.fitColumns.width
      }
    },
    _fitColumnsResizeChanged: function() {
      return !0
    },
    _cellsByColumnReset: function() {
      this.cellsByColumn = {
        index: 0
      }, this._getSegments(), this._getSegments(!0)
    },
    _cellsByColumnLayout: function(a) {
      var c = this,
        d = this.cellsByColumn;
      a.each(function() {
        var a = b(this),
          e = Math.floor(d.index / d.rows),
          f = d.index % d.rows,
          g = (e + .5) * d.columnWidth - a.outerWidth(!0) / 2,
          h = (f + .5) * d.rowHeight - a.outerHeight(!0) / 2;
        c._pushPosition(a, g, h), d.index++
      })
    },
    _cellsByColumnGetContainerSize: function() {
      return {
        width: Math.ceil(this.$filteredAtoms.length / this.cellsByColumn.rows) *
          this.cellsByColumn.columnWidth
      }
    },
    _cellsByColumnResizeChanged: function() {
      return this._checkIfSegmentsChanged(!0)
    },
    _straightAcrossReset: function() {
      this.straightAcross = {
        x: 0
      }
    },
    _straightAcrossLayout: function(a) {
      var c = this;
      a.each(function(a) {
        var d = b(this);
        c._pushPosition(d, c.straightAcross.x, 0), c.straightAcross.x +=
          d.outerWidth(!0)
      })
    },
    _straightAcrossGetContainerSize: function() {
      return {
        width: this.straightAcross.x
      }
    },
    _straightAcrossResizeChanged: function() {
      return !0
    }
  }, b.fn.imagesLoaded = function(a) {
    function h() {
      a.call(c, d)
    }

    function i(a) {
      var c = a.target;
      c.src !== f && b.inArray(c, g) === -1 && (g.push(c), --e <= 0 && (
        setTimeout(h), d.unbind(".imagesLoaded", i)))
    }
    var c = this,
      d = c.find("img").add(c.filter("img")),
      e = d.length,
      f =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
      g = [];
    return e || h(), d.bind("load.imagesLoaded error.imagesLoaded", i).each(
      function() {
        var a = this.src;
        this.src = f, this.src = a
      }), c
  };
  var w = function(b) {
    a.console && a.console.error(b)
  };
  b.fn.isotope = function(a, c) {
    if (typeof a == "string") {
      var d = Array.prototype.slice.call(arguments, 1);
      this.each(function() {
        var c = b.data(this, "isotope");
        if (!c) {
          w(
            "cannot call methods on isotope prior to initialization; attempted to call method '" +
            a + "'");
          return
        }
        if (!b.isFunction(c[a]) || a.charAt(0) === "_") {
          w("no such method '" + a + "' for isotope instance");
          return
        }
        c[a].apply(c, d)
      })
    } else this.each(function() {
      var d = b.data(this, "isotope");
      d ? (d.option(a), d._init(c)) : b.data(this, "isotope", new b.Isotope(
        a, this, c))
    });
    return this
  }
})(window, jQuery);


// Placeholder http://mths.be/placeholder
;
(function(f, h, $) {
  var a = 'placeholder' in h.createElement('input'),
    d = 'placeholder' in h.createElement('textarea'),
    i = $.fn,
    c = $.valHooks,
    k, j;
  if (a && d) {
    j = i.placeholder = function() {
      return this
    };
    j.input = j.textarea = true
  } else {
    j = i.placeholder = function() {
      var l = this;
      l.filter((a ? 'textarea' : ':input') + '[placeholder]').not(
        '.placeholder').bind({
        'focus.placeholder': b,
        'blur.placeholder': e
      }).data('placeholder-enabled', true).trigger('blur.placeholder');
      return l
    };
    j.input = a;
    j.textarea = d;
    k = {
      get: function(m) {
        var l = $(m);
        return l.data('placeholder-enabled') && l.hasClass('placeholder') ?
          '' : m.value
      },
      set: function(m, n) {
        var l = $(m);
        if (!l.data('placeholder-enabled')) {
          return m.value = n
        }
        if (n == '') {
          m.value = n;
          if (m != h.activeElement) {
            e.call(m)
          }
        } else {
          if (l.hasClass('placeholder')) {
            b.call(m, true, n) || (m.value = n)
          } else {
            m.value = n
          }
        }
        return l
      }
    };
    a || (c.input = k);
    d || (c.textarea = k);
    $(function() {
      $(h).delegate('form', 'submit.placeholder', function() {
        var l = $('.placeholder', this).each(b);
        setTimeout(function() {
          l.each(e)
        }, 10)
      })
    });
    $(f).bind('beforeunload.placeholder', function() {
      $('.placeholder').each(function() {
        this.value = ''
      })
    })
  }

  function g(m) {
    var l = {},
      n = /^jQuery\d+$/;
    $.each(m.attributes, function(p, o) {
      if (o.specified && !n.test(o.name)) {
        l[o.name] = o.value
      }
    });
    return l
  }

  function b(m, n) {
    var l = this,
      o = $(l);
    if (l.value == o.attr('placeholder') && o.hasClass('placeholder')) {
      if (o.data('placeholder-password')) {
        o = o.hide().next().show().attr('id', o.removeAttr('id').data(
          'placeholder-id'));
        if (m === true) {
          return o[0].value = n
        }
        o.focus()
      } else {
        l.value = '';
        o.removeClass('placeholder');
        l == h.activeElement && l.select()
      }
    }
  }

  function e() {
    var q, l = this,
      p = $(l),
      m = p,
      o = this.id;
    if (l.value == '') {
      if (l.type == 'password') {
        if (!p.data('placeholder-textinput')) {
          try {
            q = p.clone().attr({
              type: 'text'
            })
          } catch (n) {
            q = $('<input>').attr($.extend(g(this), {
              type: 'text'
            }))
          }
          q.removeAttr('name').data({
            'placeholder-password': true,
            'placeholder-id': o
          }).bind('focus.placeholder', b);
          p.data({
            'placeholder-textinput': q,
            'placeholder-id': o
          }).before(q)
        }
        p = p.removeAttr('id').hide().prev().attr('id', o).show()
      }
      p.addClass('placeholder');
      p[0].value = p.attr('placeholder')
    } else {
      p.removeClass('placeholder')
    }
  }
}(this, document, jQuery));

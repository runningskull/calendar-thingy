var laf = require('laf')
  , fs = require('fs')
  , bindEvents = require('./_bind-events')
  , moment = require('moment')
  , _ = require('underscore')



var templates = {
   month: fs.readFileSync(__dirname + '/templates/month.mustache', 'utf8')
  ,day: fs.readFileSync(__dirname + '/templates/day.mustache', 'utf8')
}


module.exports = function(month, ind) {
  month.dragging = false

  var dom = laf(month, templates.month, {
     container: $('#calendar')
    ,partials: templates

    ,mkctx: function(state) {
      var _mnames = moment.months()
        , thisMonth = moment({month:ind})

      var days = _.range(1, thisMonth.endOf('month').date()+1)

      days = _.map(days, function(day, ind) {
        return {
          n: day,
          selected: ((ind >= state.drag_start) && (ind <= state.drag_end))
        }
      })

      return _.extend(state, {
         first_dow: thisMonth.day()
        ,name: _mnames[ind]
        ,days: days
      })
    }
  })

  bindEvents(dom, month, {
    render: function() {
      console.log("RENDERED")
    }

    ,'mousedown/ .day': function(evt, state) {
      state.dragging = true
      state.drag_start = _findDay(evt, this)
      state.drag_end = state.drag_start
    }

    ,'mouseup/ .day': function(evt, state) {
      state.dragging = false
      state.drag_end = _findDay(evt, this)
    }

    ,'mousemove/ .day': function(evt, state) {
      if (state.dragging) {
        var ind = _findDay(evt, this)

        // state.drag_end = _findDay(evt, this)
        var $days = $(this).closest('.month').find('.day')
          , seld = $days.toArray().splice(state.drag_start, 
                                          (ind - state.drag_start + 1))

        $days.removeClass('selected')
        $(seld).addClass('selected')
      }
    }
  })
}

function _findDay(evt, dayNode) {
  return $(evt.delegateTarget).find('.day').toArray().indexOf(dayNode)
}

